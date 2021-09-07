const express = require("express");
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 1337;

const database = require("./db/database");

app.use(cors());

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

// Add a route
app.get("/", async (req, res) => {
    const db = await database.getDb();
    const resultSet = await db.collection.find({}).toArray();

    console.log(resultSet);

    await db.client.close();

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
app.listen(port, () => console.log(`Example API listening on port ${port}!`));