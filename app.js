const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const { ObjectId } = require('bson');
const app = express();
const port = process.env.PORT || 1337;

const visual = true;
const { graphqlHTTP } = require('express-graphql');
const {
  GraphQLSchema
} = require("graphql");

const RootQueryType = require("./graphql/root.js");

const schema = new GraphQLSchema({
    query: RootQueryType
});

//Routes
const auth = require('./routes/auth');
const data = require('./routes/data');
const queries = require('./db/queries');


app.use(cors({
    origin: [
        'http://localhost:4200',
        'https://www.student.bth.se']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use('/', data);
app.use('/', auth);

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: visual,
}));

// Add a route
app.get("/", async (req, res) => {
    const data = {
        data: {
            msg: "Hello from ezy-api"
        }
    };

    res.json(data);
});

app.use(express.json());

app.use((req, res, next) => {
    var err = new Error("Not Found");

    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "detail": err.message
            }
        ]
    });
});

// Start up server
const server = app.listen(port, () => console.log(`Example API listening on port ${port}!`));

//const httpServer = require("http").createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: ["http://localhost:4200", 'https://www.student.bth.se'],
        methods: ["GET", "POST"]
    }
});

io.sockets.on('connection', async function(socket) {
    let throttleTimer;

    socket.on('message', async function(data) {
        console.log(data.id + " ", data.html ); // Nått lång och slumpat
        //io.sockets.emit("message", message);
        console.log("Sending to room: ", data.id);
        socket.to(data.id).emit("message", data.html);

        socket.to(data.id).emit("save", true);

        clearTimeout(throttleTimer);
        throttleTimer = setTimeout(async function() {
            try {
                await queries.update(data.owner, ObjectId(data.id), data.name, data.html);
                socket.to(data.id).emit("save", false);
            } catch (error) {
                console.log(error);
            }
        }, 2000);
    });

    socket.on('add_allowed_user', async function(data) {
        let docId = ObjectId(data.docId);

        await queries.addAllowedUser(data.owner, data.username, docId);

        const allowedUsers = await queries.getAllowedUsers(data.owner, docId);

        socket.emit("permission_updated", allowedUsers);
    });

    socket.on('remove_allowed_user', async function(data) {
        let docId = ObjectId(data.docId);

        await queries.removeAllowedUser(data.owner, data.username, docId);

        const allowedUsers = await queries.getAllowedUsers(data.owner, docId);

        socket.emit("permission_updated", allowedUsers);
    });

    socket.on('create', function(room) {
        console.log('Joined: ', room);
        socket.join(room);
    });
});


module.exports = server;
