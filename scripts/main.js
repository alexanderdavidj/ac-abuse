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

        autocomplete: false,
    },
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

async function search(engine, data) {
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
        if (engine.cors) {
            if (engine.json) {
                data2 = $.ajax({
                    method: "GET",
                    url: window.location.origin + "/cors",
                    dataType: "json",
                    headers: {
                        url: url,
                    },
                }).done((res) => {
                    return res;
                });
            } else {
                data2 = $.ajax({
                    method: "GET",
                    url: window.location.origin + "/cors",
                    headers: {
                        url: url,
                    },
                }).done((res) => {
                    return res;
                });
            }
        } else {
            data2 = $.ajax({
                method: "GET",
                url: url,
                dataType: "json",
            }).done((res) => {
                return res;
            });
        }
    }

    return new Promise((resolve, reject) => {
        data2.then((res) => {
            content = validate(engine.name, res);

            resolve(content);
        });
    });
}

async function autocomplete() {
    app.$options.data().searches = await search(
        engine(app.$options.data().selected),
        {
            query: app.$options.data().search,
            language: app.$options.data().language,
            results: app.$options.data().results,
        }
    );
}

$("#linkstart").click(async () => {
    autocomplete();
});

$("#acengine").change(async (e) => {
    app.$options.data().selected = e.target.value;

    if (app.$options.data().autocomplete) {
        autocomplete();
    }
});

$("input").keyup(async (e) => {
    app.$options.data()[e.target.id] = e.target.value;

    if (app.$options.data().autocomplete) {
        autocomplete();
    }
});

$("#autocomplete").change(async (e) => {
    app.$options.data().autocomplete = e.target.checked;

    if (app.$options.data().autocomplete) {
        autocomplete();
    }
});
