const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const { ObjectId } = require('bson');

const app = express();
const port = process.env.PORT || 1337;

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
            // Filter to search find the document requested by id.
            const filter = { _id: ObjectId(data.id) };
            // this option instructs the method to create a
            // document if no documents match the filter
            const options = { upsert: true };
            // create a document that sets name and html attributes of the document.
            const updateDoc = {
                $set: {
                    name: data.name,
                    html: data.html
                },
            };

            try {
                await queries.update(filter, updateDoc, options);
                socket.to(data.id).emit("save", false);
            } catch (error) {
                console.log(error);
            }
        }, 2000);
    });
    socket.on('create', function(room) {
        console.log('Joined: ', room);
        socket.join(room);
    });
});


module.exports = server;
