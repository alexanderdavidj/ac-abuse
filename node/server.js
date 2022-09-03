const request = require("request");
const fakeUa = require("fake-useragent");
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
        url: req.headers["x-url"],
        method: req.headers["x-method"] || "GET",
        headers: {},
    };

    if (req.headers["x-method"] == "POST") {
        options.body = req.headers["x-body"];
        options.headers["Content-Type"] = req.headers["x-type"];
        options.headers["Content-Length"] = Buffer.byteLength(
            req.headers["x-body"]
        );
    }

    options["headers"]["User-Agent"] = fakeUa();

    request(options, function (error, response, body) {
        // console.log(req.headers);
        // console.log(error, response, body);
        res.send(body);
    });
});

server.listen(server_port, () => {
    console.log(`server.start http://localhost:${server_port}`);
});
