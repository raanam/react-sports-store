
const express = require("express");
const jsonServer = require("json-server");
const chokidar = require("chokidar");
const cors = require("cors");

const fileName = process.argv[2] || "./data.js";
const port = process.argv[3] || 3500;

let router = undefined;
const app = express();

const createServer = () => {
    delete require.cache[require.resolve(fileName)];
    setTimeout(() => {
        router = jsonServer.router(fileName.endsWith(".js") ? require(fileName)() : fileName);
    }, 100);
}

createServer();

// Require to handle requests from React app running on different port.
app.use(cors());

// Required to handle POST, PUT and PATCH
app.use(jsonServer.bodyParser);
app.use("/api", (req, resp, next) => {
    return router(req, resp, next);
});

chokidar
.watch(fileName)
.on("change", () => {
    console.log("Reloading web service data - start");
    createServer();
    console.log("RReloading web service data - done");
});

app.listen(port, () => console.log(`Web service listening to port ${port}`));