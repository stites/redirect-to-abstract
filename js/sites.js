
idrx = "[a-zA-Z0-9.]+"

arxiv = {
    domain: "arxiv.org",
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
    pdfURIPattern:"pdf?id=*",
    pdfURIRegex: new RegExp("pdf\\?id=("+idrx+")$", ""),
    abstractUrl: (ms) => "https://openreview.net/forum?id=" + ms[0],
    breakPdfRegex:"&",
    pdfSelector: () => [document.querySelector(".note_content_pdf:not(.item)")],
}

mlr = {
    domain: "proceedings.mlr.press",
    pdfURIPattern:"**.pdf",
    pdfURIRegex: new RegExp("(v[0-9]+\/"+idrx+")\/"+idrx+".pdf$", ""),
    abstractUrl: (ms) =>  "https://proceedings.mlr.press/" + ms[0] + ".html",
    breakPdfRegex:"?",
    pdfSelector: () => [document.querySelector("#extras > ul > li > a")],
}

neurips = {
    domain: "proceedings.neurips.cc",
    pdfURIPattern:"**.pdf",
    pdfURIRegex: new RegExp("paper\/([0-9]+)\/file\/("+idrx+")-Paper\\.pdf$", ""),
    abstractUrl: (ms) => {
        return "https://proceedings.neurips.cc/paper/" + ms[0] + "/hash/"+ms[1]+"-Abstract.html";
    },
    breakPdfRegex:"?",
    pdfSelector: () =>  [document.getElementsByClassName("btn-primary")[0]],
}

module.exports.arxiv = arxiv;
module.exports.openreview = openreview;
module.exports.mlr = mlr;
module.exports.neurips = neurips;

module.exports.all = [
    arxiv,
    openreview,
    mlr,
    neurips,
];
