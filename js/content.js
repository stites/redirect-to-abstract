var sites = require('./sites.js');

console.debug("[redirect-to-abstract] starting...");

function domReady() {
  console.debug("[redirect-to-abstract] mapping over all sites.js");
  sites.all.map(filterPair).some((ffr)=> {
    let filter = ffr[0];
    let fn = ffr[1];
    let r = ffr[2];
    let runit = filter(window.location.hostname)
    return runit && ( fn() || true )
  })
}

function filterPair(redirectee) {
  return [
    (hn) => redirectee.domain === hn,
    () => ensureRedirection(redirectee),
    redirectee
  ];
}

var count = 0;
var maxcount = 10;

function adjustPdfUrl(redirectee) {
  const found = redirectee.pdfSelector();
  found.forEach((el) => {
    const href = el.getAttribute("href")
    if (href[href.length-1] !== redirectee.breakPdfRegex) {
      el.setAttribute("href", href+redirectee.breakPdfRegex)
      console.debug("[redirect-to-abstract] adujsting url ", href, "->", el.getAttribute("href"))
    }
  });
  count += 1;
  ensureRedirection(redirectee);
}

function ensureRedirection(redirectee) {
  const found = redirectee.pdfSelector();
  if (found.length === 0) {
    console.error("[redirect-to-abstract] pdf selector no longer valid! please file an issue at https://github.com/stites/redirect-to-abstract")
  } else if (count > maxcount) {
    console.debug("[redirect-to-abstract] no longer rewriting urls");
  } else {
    const timeout = count * count;
    console.debug("[redirect-to-abstract] checking urls again in", timeout, "seconds (", count, "/", maxcount,")")
    setTimeout(
      adjustPdfUrl.bind(null, redirectee),
      1000 * timeout
    );
  }
}

if (window.location.hostname.includes("neurips")) {
  domReady();
} else {
  document.addEventListener('DOMContentLoaded', domReady);
}
