const sources = [
    {
        name: "duckduckgo",
        template: "https://duckduckgo.com/ac/?q=%query&kl=%language",
        attributes: ["language"],
        jsonp: true,
        json: false,
        broken: true,
        cors: false,
    },
    {
        name: "google",
        template:
            "https://www.google.com/complete/search?xssi=t&client=gws-wiz&q=%query&hl=%language",
        attributes: ["language"],
        jsonp: true,
        json: false,
        broken: true,
        cors: false,
    },
    {
        name: "yandex",
        template:
            "https://yandex.com/suggest/suggest-ya.cgi?part=%query&uil=%language&n=%results&v=4",
        attributes: ["results", "language"],
        jsonp: true,
        json: false,
        cors: false,
    },
    {
        name: "yahoo",
        template:
            "https://search.yahoo.com/sugg/gossip/gossip-us-ura/?command=%query&nresults=%results&output=sd",
        attributes: ["results"],
        jsonp: true,
        json: false,
        broken: true,
        cors: false,
    },
    {
        name: "baidu",
        template: "https://www.baidu.com/sugrec?prod=pc&wd=%query",
        attributes: [],
        jsonp: true,
        json: true,
        cors: false,
    },
    {
        name: "codeinu",
        template: "https://codeinu.net/api/search?key=%query",
        attributes: [],
        jsonp: false,
        json: true,
        cors: false,
    },
    {
        name: "codegrepper",
        template:
            "https://www.codegrepper.com/api/search_autocomplete.php?q=%query",
        attributes: [],
        jsonp: true,
        json: false,
        broken: true,
        cors: false,
    },
    {
        name: "unity",
        template:
            'https://learn.unity.com/api/learn/headerSearch?k=["q:%query"]',
        attributes: [],
        jsonp: false,
        json: true,
        broken: false,
        cors: true,
    },
    {
        name: "amazon",
        template:
            "https://completion.amazon.com/api/2017/suggestions?alias=aps&wc=&plain-mid=1&lop=%language&limit=%results&prefix=%query",
        attributes: ["results", "language"],
        jsonp: false,
        json: true,
        broken: false,
        cors: true,
    },
    {
        name: "npm",
        template: "https://www.npmjs.com/search/suggestions?q=%query",
        attributes: [],
        jsonp: false,
        json: true,
        broken: false,
        cors: true,
    },
    {
        name: "steam",
        template:
            "https://store.steampowered.com/search/suggest?term=%query&cc=%language&realm=1&l=english",
        attributes: ["language"],
        jsonp: false,
        json: false,
        broken: false,
        cors: true,
    },
    {
        name: "emag",
        template: "https://www.emag.ro/search-suggester?query=%query",
        attributes: [],
        jsonp: false,
        json: true,
        broken: false,
        cors: true,
    },
    {
        name: "urbandictionary",
        template:
            "https://api.urbandictionary.com/v0/autocomplete-extra?term=%query",
        attributes: [],
        jsonp: false,
        json: true,
        broken: false,
        cors: true,
    },
];

function validate(engine, res) {
    try {
        content = [];
        newres = res;

        switch (engine) {
            case "duckduckgo":
                for (i in newres) {
                    content.push(newres[i].phrase);
                }

                break;

            case "google":
                newres = res;

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

            case "unity":
                newres = res.result.learnResult.results;

                for (i in newres) {
                    content.push(newres[i].tutorial.title);
                }

                break;

            case "amazon":
                newres = res.suggestions;

                for (i in newres) {
                    content.push(newres[i].value);
                }

                break;

            case "npm":
                for (i in res) {
                    content.push(res[i].name);
                }

                break;

            case "steam":
                content = res
                    .replaceAll(/<(\/)?ul>/g, "")
                    .replaceAll("<li>", "")
                    .replaceAll("</li>", "\n")
                    .split("\n");
                content.pop();

                break;

            case "emag":
                for (i in res.data.queries) {
                    content.push(res.data.queries[i].name);
                }

                break;

            case "urbandictionary":
                for (i in res.results) {
                    content.push(res.results[i].term);
                }

                break;

            default:
                content = [];

                break;
        }

        return content;
    } catch (err) {
        return [];
    }
}
