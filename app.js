const express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    cors = require('cors'),
    socketio = require("socket.io"),
    routers = require("./app/routers/router"),
    swagger = require("./app/routers/swagger");

const app = express();

app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "./app/public")));

routerConfig();

const server = require('http').createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});


io.on('connection', function (client) { console.log('New client joined') });
module.exports = { app: app, server: server, io: io };

var integraSocket = require('./routes/Events/integra').integraSocket;


function routerConfig() {
    app.use(routers);
    swagger.initSwaggerUI(app);
    const router = express.Router();
    app.use("/", router.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, "./app/public", "index.html"));
    }));
}
