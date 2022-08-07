const sources = [
    {
        name: "duckduckgo",
        template: "https://duckduckgo.com/ac/?q=%query&kl=%language",
        attributes: ["language"],
        jsonp: true,
        broken: true,
    },
    {
        name: "google",
        template:
            "https://www.google.com/complete/search?xssi=t&client=gws-wiz&q=%query&hl=%language",
        attributes: ["language"],
        jsonp: true,
        broken: true,
    },
    {
        name: "yandex",
        template:
            "https://yandex.com/suggest/suggest-ya.cgi?part=%query&uil=%language&n=%results&v=4",
        attributes: ["results", "language"],
        jsonp: true,
    },
    {
        name: "yahoo",
        template:
            "https://search.yahoo.com/sugg/gossip/gossip-us-ura/?command=%query&nresults=%results&output=sd",
        attributes: ["results"],
        jsonp: true,
        broken: true,
    },
    {
        name: "baidu",
        template: "https://www.baidu.com/sugrec?prod=pc&wd=%query",
        attributes: [],
        jsonp: true,
    },
    {
        name: "codeinu",
        template: "https://codeinu.net/api/search?key=%query",
        attributes: [],
        jsonp: false,
    },
    {
        name: "codegrepper",
        template:
            "https://www.codegrepper.com/api/search_autocomplete.php?q=%query",
        attributes: [],
        jsonp: true,
        broken: true,
    },
];

const languages = [
    "af",
    "sq",
    "ar-dz",
    "ar-bh",
    "ar-eg",
    "ar-iq",
    "ar-jo",
    "ar-kw",
    "ar-lb",
    "ar-ly",
    "ar-ma",
    "ar-om",
    "ar-qa",
    "ar-sa",
    "ar-sy",
    "ar-tn",
    "ar-ae",
    "ar-ye",
    "eu",
    "be",
    "bg",
    "ca",
    "zh-hk",
    "zh-cn",
    "zh-sg",
    "zh-tw",
    "hr",
    "cs",
    "da",
    "nl-be",
    "nl",
    "en",
    "en-au",
    "en-bz",
    "en-ca",
    "en-ie",
    "en-jm",
    "en-nz",
    "en-za",
    "en-tt",
    "en-gb",
    "en-us",
    "et",
    "fo",
    "fa",
    "fi",
    "fr-be",
    "fr-ca",
    "fr-lu",
    "fr",
    "fr-ch",
    "gd",
    "de-at",
    "de-li",
    "de-lu",
    "de",
    "de-ch",
    "el",
    "he",
    "hi",
    "hu",
    "is",
    "id",
    "ga",
    "it",
    "it-ch",
    "ja",
    "ko",
    "ko",
    "ku",
    "lv",
    "lt",
    "mk",
    "ml",
    "ms",
    "mt",
    "no",
    "nb",
    "nn",
    "pl",
    "pt-br",
    "pt",
    "pa",
    "rm",
    "ro",
    "ro-md",
    "ru",
    "ru-md",
    "sr",
    "sk",
    "sl",
    "sb",
    "es-ar",
    "es-bo",
    "es-cl",
    "es-co",
    "es-cr",
    "es-do",
    "es-ec",
    "es-sv",
    "es-gt",
    "es-hn",
    "es-mx",
    "es-ni",
    "es-pa",
    "es-py",
    "es-pe",
    "es-pr",
    "es",
    "es-uy",
    "es-ve",
    "sv",
    "sv-fi",
    "th",
    "ts",
    "tn",
    "tr",
    "ua",
    "ur",
    "ve",
    "vi",
    "cy",
    "xh",
    "ji",
    "zu",
];

const engine = (name) => {
    return sources[sources.findIndex((s) => s.name == name)];
};

const app = new Vue({
    el: "#app",
    data: {
        elements: sources,
        languages: languages.sort(),
        selected: "yandex",
        searches: ["Nothing yet"],

        search: "The quick brown fox jumped over the lazy dog",
        language: "en",
        results: 20,
    },
});

$("#acengine").change((e) => {
    app.$options.data().selected = e.target.value;
});

$("input").keyup((e) => {
    app.$options.data()[e.target.id] = e.target.value;
});

function jsonp(url) {
    const promise = new Promise(function (resolve, reject) {
        let script = document.createElement("script");
        const name = "_jsonp_" + Math.round(100000 * Math.random());

        if (url.match(/\?/)) url += "&callback=" + name;
        else url += "?callback=" + name;
        script.src = url;

        window[name] = function (data) {
            resolve(data);
            document.body.removeChild(script);
            delete window[name];
        };

        document.body.appendChild(script);
    });

    return promise;
}

function search(engine, data) {
    content = [];
    var data2;
    let url = engine.template;
    for (let attr of engine.attributes) {
        url = url.replace(`%${attr}`, data[attr]);
    }

    url = url.replace("%query", data.query);

    if (engine.jsonp) {
        data2 = jsonp(url);
    } else {
        data2 = $.getJSON(url);
    }

    return new Promise((resolve, reject) => {
        data2.then((res) => {
            newres = res;

            switch (engine.name) {
                case "duckduckgo":
                    for (i in newres) {
                        content.push(newres[i].phrase);
                    }

                    break;

                case "google":
                    newres = JSON.parse(res.replace(")]}'", ""));

                    for (i in newres[0]) {
                        content.push(i[0]);
                    }

                    break;

                case "yandex":
                    content = newres[1];
                    break;

                case "yahoo":
                    newres = res.gossip.results;

                    for (i in newres) {
                        content.push(newres[i].key);
                    }

                    break;

                case "baidu":
                    newres = res.g;

                    for (i in newres) {
                        content.push(newres[i].q);
                    }

                    break;

                case "codeinu":
                    for (i in newres) {
                        content.push(newres[i].questions);
                    }

                    break;

                case "codegrepper":
                    newres = res.terms;

                    for (i in newres) {
                        content.push(newres[i].term);
                    }

                    break;
            }

            resolve(content);
            console.log(content);
        });
    });
}

$("#linkstart").click(async () => {
    app.$options.data().searches = await search(
        engine(app.$options.data().selected),
        {
            query: app.$options.data().search,
            language: app.$options.data().language,
            results: app.$options.data().results,
        }
    );
});
