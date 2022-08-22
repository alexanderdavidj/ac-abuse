const sources = [
    {
        name: "duckduckgo",
        template: "https://duckduckgo.com/ac/?q=%query&kl=%language",
        attributes: ["language"],
        tags: ["json", "cors"],
        broken: false,
        method: "GET",
    },
    {
        name: "google",
        template:
            "https://www.google.com/complete/search?xssi=t&client=gws-wiz&q=%query&hl=%language",
        attributes: ["language"],
        tags: ["jsonp"],
        broken: true,
        method: "GET",
    },
    {
        name: "yandex",
        template:
            "https://yandex.com/suggest/suggest-ya.cgi?part=%query&uil=%language&n=%results&v=4",
        attributes: ["results", "language"],
        tags: ["jsonp", "cors"],
        broken: false,
        method: "GET",
    },
    {
        name: "yahoo",
        template:
            "https://search.yahoo.com/sugg/gossip/gossip-us-ura/?command=%query&nresults=%results&output=sd",
        attributes: ["results"],
        tags: ["jsonp"],
        broken: true,
        method: "GET",
    },
    {
        name: "baidu",
        template: "https://www.baidu.com/sugrec?prod=pc&wd=%query",
        attributes: [],
        tags: ["json", "cors"],
        broken: false,
        method: "GET",
    },
    {
        name: "codeinu",
        template: "https://codeinu.net/api/search?key=%query",
        attributes: [],
        tags: ["json"],
        broken: false,
        method: "GET",
    },
    {
        name: "codegrepper",
        template:
            "https://www.codegrepper.com/api/search_autocomplete.php?q=%query",
        attributes: [],
        tags: ["jsonp"],
        broken: true,
        method: "GET",
    },
    {
        name: "unity",
        template:
            'https://learn.unity.com/api/learn/headerSearch?k=["q:%query"]',
        attributes: [],
        tags: ["json", "cors"],
        broken: false,
        method: "GET",
    },
    {
        name: "amazon",
        template:
            "https://completion.amazon.com/api/2017/suggestions?alias=aps&wc=&plain-mid=1&lop=%language&limit=%results&prefix=%query",
        attributes: ["results", "language"],
        tags: ["json", "cors"],
        broken: false,
        method: "GET",
    },
    {
        name: "npm",
        template: "https://www.npmjs.com/search/suggestions?q=%query",
        attributes: [],
        tags: ["json", "cors"],
        broken: false,
        method: "GET",
    },
    {
        name: "steam",
        template:
            "https://store.steampowered.com/search/suggest?term=%query&cc=%language&realm=1&l=english",
        attributes: ["language"],
        tags: ["cors", "html"],
        broken: false,
        method: "GET",
    },
    {
        name: "emag",
        template: "https://www.emag.ro/search-suggester?query=%query",
        attributes: [],
        tags: ["json", "cors"],
        broken: false,
        method: "GET",
    },
    {
        name: "urbandictionary",
        template:
            "https://api.urbandictionary.com/v0/autocomplete-extra?term=%query",
        attributes: [],
        tags: ["json", "cors"],
        broken: false,
        method: "GET",
    },
    {
        name: "wikipedia",
        template:
            "https://%language.wikipedia.org/w/api.php?action=query&format=json&generator=prefixsearch&gpssearch=%query&gpslimit=%results",
        attributes: ["results", "language"],
        tags: ["json", "cors"],
        broken: false,
        method: "GET",
    },
    {
        name: "roblox",
        template:
            "https://apis.roblox.com/games-autocomplete/v1/get-suggestion/%query",
        attributes: [],
        tags: ["json", "cors"],
        broken: false,
        method: "GET",
    },
    {
        name: "thefreedictionary",
        template:
            "https://www.thefreedictionary.com/_/search/suggest.ashx?query=%query",
        attributes: [],
        tags: ["json", "cors"],
        broken: false,
        method: "GET",
    },
    {
        name: "versus",
        template:
            "https://versus.com/api/search/?q=%query&lang=%language&category=",
        attributes: ["language"],
        tags: ["json", "cors"],
        broken: true,
        method: "GET",
    },
    {
        name: "apple",
        template: "https://www.apple.com/search-services/suggestions/",
        attributes: [],
        tags: ["json", "cors"],
        broken: true,
        method: "POST",
        body: {
            query: "%query",
            src: "globalnav",
            id: "youve-been-ac-abused",
            locale: "%language",
        },
    },
    {
        name: "wordpress",
        template:
            "https://public-api.wordpress.com/wpcom/v2/site-verticals?term=%query&limit=%results&include_weighted_roots=true",
        attributes: ["results"],
        tags: ["json", "cors"],
        broken: false,
        method: "GET",
    },
    {
        name: "imdb",
        template: "https://v3.sg.media-imdb.com/suggestion/x/%query.json",
        attributes: [],
        tags: ["json", "cors"],
        broken: false,
        method: "GET",
    },
    // {
    //     name: "quora",
    //     template:
    //         "https://www.quora.com/graphql/gql_para_POST?q=SiteSearchBarQuery",
    //     attributes: [],
    //     tags: ["json", "cors"],
    //     broken: true,
    //     method: "POST",
    //     body: {
    //         queryName: "SiteSearchBarQuery",
    //         variables: {
    //             query: "b",
    //             querySource: "search_bar",
    //             queryHash: "ecb5aafa257ca5fdb0a9f34b83253190",
    //             sessionId: "0",
    //             selectorId: "7304915296570339",
    //         },

    //         extensions: {
    //             hash: "9ca2b953f705d31c6321c0ebbf943f75eae74fb594b519e3097f8ed0903b42d7",
    //         },
    //     },

    //     keys: [
    //         "f92936cfc4a29f56c8a5256fc0bd3d3e",
    //         "7e9963e625d2ec79aa455eaa8a02e7e4",
    //     ],
    // },
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

            case "wikipedia":
                for (i in res.query.pages) {
                    content.push(res.query.pages[i].title);
                }

                break;

            case "roblox":
                for (i in res.entries) {
                    content.push(res.entries[i].searchQuery);
                }

                break;

            case "thefreedictionary":
                for (i in res[1]) {
                    content.push(res[1][i]);
                }

                break;
            case "versus":
                for (i in res) {
                    for (j in res[i].suggestions) {
                        content.push(j);
                    }
                }

                break;

            case "apple":
                newres = res.results;

                for (i in newres) {
                    for (j in newres[i].sectionResults) {
                        content.push(newres[i].sectionResults[j].label);
                    }
                }

                break;

            case "wordpress":
                for (i in newres) {
                    content.push(newres[i].title);
                }

                break;

            case "imdb":
                for (i in newres.d) {
                    content.push(newres.d[i].l);
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
