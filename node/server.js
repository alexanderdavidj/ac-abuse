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
    options = {
        url: req.headers["url"],
        method: req.headers["cors-methodd"] || "GET",
        headers: req.headers,
    };

    if (req.headers["cors-method"] == "POST") {
        options.body = req.headers["body"];
        options.headers["Content-Type"] = req.headers["body-type"];
        options.headers["Content-Length"] = Buffer.byteLength(
            req.headers["body"]
        );
    }

    request(options, function (error, response, body) {
        console.log(error, response, body);
        res.send(body);
    });
});

server.listen(server_port, () => {
    console.log(`server.start http://localhost:${server_port}`);
});
