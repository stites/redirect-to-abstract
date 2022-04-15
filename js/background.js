var sites = require('./sites.js');

sites.all.forEach(function listenBeforeRequests (redirectee) {
  function mkPattern (sub) {
    const subdomain = sub === "" ? "" : sub + ".";
    return "*://"+subdomain + redirectee.domain+"/"+redirectee.pdfURIPattern;
  }

  const urlPatterns = [mkPattern("")].concat(redirectee.subdomains.map(mkPattern));
  const listener = (deets)=> redirect(redirectee, deets)
  console.log(
    "[redirect-to-abstract]",
    "triggering `chrome.webRequest.onBeforeRequest.addListener`",
    "urls:", urlPatterns
  );
  chrome.webRequest.onBeforeRequest.addListener(
    listener,
    { urls: urlPatterns },
    ["blocking"] // NOTE: listener must return redirectUrl
  );
});

function pdfurlToId (redirectee, url) {
    const r = redirectee
    const uri = url.split(r.domain+"/")[1]
    const ms = uri.match(r.pdfURIRegex)

    if (ms === null) {
        throw ("error on match: " + url + " regex:" + r.pdfURIRegex)
    }
    else if (ms.length > 1) {
        ms.shift()
        return ms;
    } else {
        throw ("don't redirect " + url)
    }
}

function redirect (redirectee, details) {
    let absUrl = redirectee.abstractUrl(pdfurlToId(redirectee, details.url))
    console.info("Redirecting: " + details.url + " to " + absUrl);
    return { redirectUrl: absUrl };
}

