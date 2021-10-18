var sites = require('./sites.js');

sites.all.map(filterPair).some((ffr)=> {
    let filter = ffr[0];
    let fn = ffr[1];
    let r = ffr[2];
    let runit = filter(window.location.hostname)
    return runit && ( fn() || True )
})

function filterPair(redirectee) {
    return [(hn) => redirectee.domain === hn, () => adjustPdfUrl(redirectee), redirectee];
}

function adjustPdfUrl(redirectee) {
    redirectee.pdfSelector().forEach((el) => {
      const href = el.getAttribute("href")
      el.setAttribute("href", href+redirectee.breakPdfRegex)
    })
}
