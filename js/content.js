var sites = require('./sites.js');

var maxcount = 12; // 9 for slow connections, 12 for very slow connections
const header = "[redirect-to-abstract]";
const mkctx = (ctx) => "["+ctx+"]";
const mkerr = (msg) => "Error! "+msg+ " Please file an issue at https://github.com/stites/redirect-to-abstract";

function adjustPdfUrl(ctx, redirectee) {
  const found = redirectee.pdfSelector();
  found.forEach((el) => {
    const href = el.getAttribute("href");
    if (href[href.length-1] !== redirectee.breakPdfRegex) {
      el.setAttribute("href", href+redirectee.breakPdfRegex);
      console.debug(header, mkctx(ctx), "adujsting url "+ href+ "->"+ el.getAttribute("href"));
    }
  });
}

function idx2schedule(i) {
  // exponential backoff, stretched out a bit.
  if (i === 0) {
    return 0;
  } else {
    const n = Math.exp(i)/(i*i) * 150; // this schedule looks good
    const ms = Math.floor(n);          // convert to ms
    return ms;
  }
}

function schedule(ctx, maxcount, count, redirectee) {
  const ms = idx2schedule(count);
  const s = ms / 1000;
  console.debug(header, mkctx(ctx), "checking urls again in", s, "seconds ("+ count+ "/"+ maxcount+")");
  return setTimeout(() => {
    ensureRedirection(ctx, maxcount, count, redirectee);
  }, ms);
}

function ensureRedirection(ctx, maxcount, count, redirectee) {
  const found = redirectee.pdfSelector();
  if (found.length === 0) {
    myerror("pdf selector no longer valid!", ctx);
  } else if (count > (maxcount-1)) { // adjust for 0 indexing
    console.debug(header, mkctx(ctx), "no longer rewriting urls");
  } else {
    adjustPdfUrl(ctx, redirectee);
    schedule(ctx, maxcount, count+1, redirectee);
  }
}

function domainCheck(domain) {
  const parts = domain.split(".");
  const hn = window.location.hostname;
  const hnParts = hn.split(".");
  return hnParts.slice(-1*parts.length).join(".") === domain;
}

function main(ctx, maxcount) {
  console.debug(header, "starting schedule:", [...Array(maxcount).keys()].map((i) => idx2schedule(i) / 1000));
  const rs = sites.all.filter((r) => domainCheck(r.domain));
  if (rs.length !== 1) {
    console.error(header, mkctx(ctx), mkerr("multiple sites found!"), rs);
  } else {
    // add hooks that I don't trust:
    document.addEventListener('DOMContentLoaded', (event) => { adjustPdfUrl('document.DOMContentLoaded', rs[0]); });
    window.addEventListener('load', (event) => {  adjustPdfUrl('window.load', rs[0]); });

    // add schedule which I do trust
    ensureRedirection(ctx, maxcount, 0, rs[0]);
  }
}


main("main", maxcount);
