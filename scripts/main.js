// var app = new Vue({
//     el: "#app",
//     data: {
//         scrollButton: false,
//     },
// });

var socket = io.connect(window.location.origin);
var temp = Math.floor(
    Math.random() * (9999999 - 1000000 + 1) + 1000000
).toString(16);

/* theme toggling */

$("#toggleTheme").click(() => {
    if ($("body").hasClass("dark")) {
        $("body").removeClass("dark");
        $("body").addClass("light");
        $("#themeIcon").attr("src", "/svg/sun.svg");
    } else {
        $("body").removeClass("light");
        $("body").addClass("dark");
        $("#themeIcon").attr("src", "/svg/moon.svg");
    }
});

socket.emit("client.id.request", temp);
socket.on("client.id.request-" + temp, (content) => {
    socket.id = content;

    if (/[0-9a-fA-F]+/g.test(socket.id)) {
        socket.emit("client.id.success", socket.id);
    } else {
        socket.emit("client.id.error", socket.id);
    }
});

// temp = null;
// /* scroll down button */

// $("#scrollDown").click(() => {
//     window.scrollTo(0, document.body.scrollHeight);
// });

/* controls */

$("#input").attr("tabindex", "0");
var f = document.getElementById("form");
var i = document.getElementById("input");

// $("#input").keypress(function (e) {
//     if (e.which === 13 && !e.shiftKey) {
//         e.preventDefault();

//         $(this).closest("form").submit();
//     }
// });

function emitMessage(type) {
    if (i.value) {
        socket.emit("client.message.send", {
            message: i.value,
            user: socket.id,
        });
        i.value = "";
    }
}

f.addEventListener("submit", (e) => {
    e.preventDefault();

    emitMessage("text");
});

$("#text").click(() => {
    emitMessage("text");

    $("#input").focus();
});

$("#video").click(() => {
    emitMessage("video");
});

$(document).keypress(function (e) {
    if (
        document.activeElement != i &&
        document.activeElement != document.getElementById("toggleTheme")
    ) {
        if (e.which === 13 && !e.shiftKey) {
            e.preventDefault();

            $("#input").focus();
        }
    }
});

/* admin controls */

// $("#clear").click(() => {
//     socket.emit("clear", i.value);
// });

// $("#refresh").click(() => {
//     socket.emit("refresh", i.value);
// });

/* socket listeners */

function dateParse() {
    var date = new Date();

    var year = date.getFullYear();
    var month = (date.getMonth() < 10 ? "0" : "") + date.getMonth();
    var day = (date.getDay() < 10 ? "0" : "") + date.getDay();
    var hours = (date.getHours() < 10 ? "0" : "") + date.getHours();
    var minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    var seconds = (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();

    var datePrefix = "/";
    var timePrefix = ":";

    var dateString = `${day}${datePrefix}${month}${datePrefix}${year}`;
    var timeString = `${hours}${timePrefix}${minutes}${timePrefix}${seconds}`;

    var dateFirst = false;

    var dateParse = `${dateFirst ? dateString : timeString} ${
        dateFirst ? timeString : dateString
    }`;
    return dateParse;
}

function getYtID(url) {
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return url[2] !== undefined ? url[2].split(/[^0-9a-z_\-]/i)[0] : false;
}

function linkCheck(url) {
    try {
        regex =
            /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/g;
        match = regex.exec(url);
        if (match !== undefined) {
            return match[0];
        } else {
            return false;
        }
    } catch {
        return false;
    }
}

function htmlLink(message) {
    var linkChecked = linkCheck(message);
    if (linkChecked)
        return message.replace(
            linkChecked,
            `<a href="${linkChecked}" targ
            // generate 6 character idt="_blank">${linkChecked}</a>`
        );
    else return message;
}

const isImage = (url) =>
    new Promise((resolve) => {
        const img = new Image();

        img.src = url;
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
    });

function antiXSS(unsanitized) {
    return String(unsanitized);
}

function format(message) {
    return htmlLink(antiXSS(message));
}

function sendText(message = "", user = "") {
    message = format(message);
    var mainParent = document.createElement("div");
    // var image = document.createElement("img");
    // image.src = "/svg/person.svg";
    // image.style = "vertical-align: middle;";
    // mainParent.appendChild(image);

    var div = document.createElement("div");
    div.style = "vertical-align:middle; display:inline; word-wrap: break-word;";
    div.innerHTML = `${
        user ? user : socket.id
    } at ${dateParse()}<br />${message}`;
    mainParent.appendChild(div);

    messages.appendChild(mainParent);
    window.scrollTo(0, document.body.scrollHeight);
}

// function scrollToEnd() {
//     window.scrollTo(0, document.body.scrollHeight);
// }

// socket.on("refresh", () => {
//     window.location.reload();
// });

// socket.on("clear", () => {
//     $("#messages").html("<li>Cleared</li>");
// });

socket.on("client.message.send", async function (data) {
    // if (data.type == "video") {
    //     sendText();
    //     var item = document.createElement("video");
    //     item.controls = true;
    //     item.volume = 0.15;
    //     item.src = data.message;
    //     item.class = "h";
    //     messages.appendChild(item);
    //     scrollToEnd();
    // } else if (data.type == "text") {
    var imageCheck = await isImage(
        linkCheck(data.message) ? linkCheck(data.message) : ""
    );

    if (getYtID(data.message)) {
        sendText(data.message);

        var item = document.createElement("iframe");

        item.width = 560;
        item.height = 315;
        item.src =
            "https://www.youtube-nocookie.com/embed/" + getYtID(data.message);
        item.title = "Youtube Player";
        item.frameborder = "0";
        item.allow =
            "accelerometer; autoplay; clibpoard-write; encrypted-media; gyroscope; picture-in-picture;";
        // item.class = "h";

        messages.appendChild(item);
        scrollToEnd();

        return;
    }

    if (imageCheck) {
        // console.log(imageCheck);
        // console.log(linkCheck(data.message));
        sendText(data.message, data.user);

        var item = document.createElement("img");
        var item2 = document.createElement("p");

        item.src = linkCheck(data.message);
        // item.class = "h";
        item.style =
            "max-width: 35%; max-height: 35%; border-width: 20px; border-color: black;";

        messages.appendChild(item2);
        messages.appendChild(item);
        scrollToEnd();

        return;
    }

    sendText(data.message, data.user);
    // }
});
