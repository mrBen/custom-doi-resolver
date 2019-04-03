browser.menus.create({
  id: 'menuItem',
  title: 'Open as DOI',
  contexts: ['link', 'selection']
});

browser.menus.onClicked.addListener(function(info) {
  if (info.linkUrl) {
    var input = decodeURIComponent(info.linkUrl);
  } else if (info.selectionText) {
    var input = info.selectionText;
  }
  var resolverUrl = 'https://doi.org/';
  var doi = input.match(/10\.\d{4,9}\/[\-._;()i\/:A-Z0-9]+/i);
  if (doi) {
    doi = doi[0];
    browser.storage.sync.get('resolverUrl').then((result) => { 
      if (result.resolverUrl) {
        resolverUrl = result.resolverUrl;
        if (resolverUrl.slice(-1) != '/') {
          resolverUrl += '/';
        }
        browser.tabs.create({ url: resolverUrl + doi });
      }
    });
  }
});
