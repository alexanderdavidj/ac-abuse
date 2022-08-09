const request = require("request");
const server = require("express")();
const path = require("path");
const server_port = 25564;

server.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/../ui/index.html"));
});

server.get("/scripts/:file", (req, res) => {
    res.sendFile(path.join(__dirname + "/../scripts/" + req.params.file));
});

server.get("/ui/:file", (req, res) => {
    res.sendFile(path.join(__dirname + "/../ui/" + req.params.file));
});

server.get("/cors/", (req, res) => {
    request(req.headers["url"], function (error, response, body) {
        res.send(body);
    });
});

server.listen(server_port, () => {
    console.log(`server.start http://localhost:${server_port}`);
});
