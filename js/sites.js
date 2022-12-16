
idrx = "[a-zA-Z0-9.]+"

arxiv = {
    domain: "arxiv.org",
    subdomains: [],
    pdfURIPattern:"**.pdf",
    pdfURIRegex: new RegExp("pdf\/("+idrx+").pdf$", ""),
    abstractUrl: (ms) => "https://www.arxiv.org/abs/" + ms[0],
    breakPdfRegex:"?",
    pdfSelector: () => {
        return [
            document.querySelector(".download-pdf"),
            document.querySelector(".mobile-submission-download"),
        ];
    },
}

openreview = {
    domain: "openreview.net",
    subdomains: [],
    pdfURIPattern:"pdf?id=*",
    pdfURIRegex: new RegExp("pdf\\?id=("+idrx+")$", ""),
    abstractUrl: (ms) => "https://openreview.net/forum?id=" + ms[0],
    breakPdfRegex:"&",
    pdfSelector: () => [document.querySelector(".note_content_pdf:not(.item)")],
}

mlr = {
    domain: "mlr.press",
    subdomains: ["proceedings"],
    pdfURIPattern:"**.pdf",
    pdfURIRegex: new RegExp("(v[0-9]+\/"+idrx+").pdf$", ""),
    abstractUrl: (ms) =>  "https://proceedings.mlr.press/" + ms[0] + ".html",
    breakPdfRegex:"?",
    pdfSelector: () => [document.querySelector("#extras > ul > li > a")],
}

neurips = {
    domain: "neurips.cc",
    subdomains: ["proceedings", "papers", "media"],
    pdfURIPattern:"**.pdf",
    pdfURIRegex: new RegExp("paper\/([0-9]+)\/file\/("+idrx+")-Paper\\.pdf$", ""),
    abstractUrl: (ms) => {
        return "https://proceedings.neurips.cc/paper/" + ms[0] + "/hash/"+ms[1]+"-Abstract.html";
    },
    breakPdfRegex:"?",
    pdfSelector: () => {
        const nodes = document.querySelectorAll(".col > div > .btn");
        return [...nodes].filter((el) => {
            const href = el.getAttribute("href");
            const parts = href.split(".");
            const ext = parts[parts.length - 1]
            return ext.includes("pdf");
        });
    },
}

nips = Object.assign({}, neurips)
nips.domain = "nips.cc"

aclanthology = {
    domain: "aclanthology.org",
    subdomains: [],
    pdfURIPattern:"**.pdf",
    pdfURIRegex: new RegExp("([a-zA-Z0-9.-]+).pdf$", ""),
    abstractUrl: (ms) => {
        return "https://aclanthology.org/" + ms[0];
    },
    breakPdfRegex:"?",
    pdfSelector: () =>  [document.querySelector(".acl-paper-link-block > a.btn-primary")],
}

biorxiv = {
    domain: "biorxiv.org",
    subdomains: [],
    pdfURIPattern:"**.pdf",
    pdfURIRegex: new RegExp("(content\/[a-zA-Z0-9\/.-]+).full.pdf$", ""),
    abstractUrl: (ms) => {
        return "https://biorxiv.org/" + ms[0];
    },
    breakPdfRegex:"?",
    pdfSelector: () =>  [document.querySelector(".pane-content > a.article-dl-pdf-link")],
}

module.exports.arxiv = arxiv;
module.exports.openreview = openreview;
module.exports.mlr = mlr;
module.exports.neurips = neurips;
module.exports.nips = nips;
module.exports.aclanthology = aclanthology;
module.exports.biorxiv = biorxiv;

module.exports.all = [
    arxiv,
    openreview,
    mlr,
    neurips,
    nips,
    aclanthology,
    biorxiv,
];
