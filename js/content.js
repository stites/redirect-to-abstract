var sites = require('./sites.js');

window.addEventListener('load', () => {
  sites.all.map(filterPair).some((ffr)=> {
      let filter = ffr[0];
      let fn = ffr[1];
      let r = ffr[2];
      let runit = filter(window.location.hostname)
      return runit && ( fn() || True )
  })
})

function filterPair(redirectee) {
    return [(hn) => redirectee.domain === hn, () => adjustPdfUrl(redirectee), redirectee];
}

function adjustPdfUrl(redirectee) {
    console.debug("timer of:", redirectee.extraRewriteTimeout)
    setTimeout(() => {
      const found = redirectee.pdfSelector();
      console.debug("adujst pdf url on ", location.href, "?", found)
      found.forEach((el) => {
        const href = el.getAttribute("href")
        el.setAttribute("href", href+redirectee.breakPdfRegex)
        console.debug("adujsting url ", href, "->", el.getAttribute("href"))
      })
    }, redirectee.extraRewriteTimeout);
}
