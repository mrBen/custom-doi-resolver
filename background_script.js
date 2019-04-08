let re = /10\.\d{4,9}\/[\-._;()i\/:A-Z0-9]+/i;

async function resolve(doi) {
  let url = 'https://doi.org/';
  let value = await browser.storage.sync.get('resolverUrl');
  if (value.resolverUrl) {
    url = value.resolverUrl;
  }
  if (url.slice(-1) != '/') {
    url += '/';
  }
  return url + doi;
}

browser.menus.create({
  id: 'menuItem',
  title: 'Open as DOI',
  contexts: ['link', 'selection']
});

browser.menus.onClicked.addListener(function(info) {
  let input;
  if (info.linkUrl) {
    input = decodeURIComponent(info.linkUrl);
  } else if (info.selectionText) {
    input = info.selectionText;
  }
  let doi = input.match(re);
  if (doi) {
    resolve(doi[0]).then( value => browser.tabs.create({ url: value }) );
  }
});

browser.webRequest.onBeforeRequest.addListener(
  async function(details) {
    let doi = details.url.match(re);
    if (doi) {
      let value = await browser.storage.sync.get(['resolverUrl', 'autoRedirect']);
      if (value.autoRedirect && !value.resolverUrl.includes('doi.org')) {
        let url = await resolve(doi[0]);
        return { redirectUrl: url };
      }
    }
  },
  { urls: ["*://*.doi.org/*"], types: ["main_frame"] },
  ["blocking"]
);
