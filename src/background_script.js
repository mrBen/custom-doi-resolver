// SPDX-FileCopyrightText: 2022 Benjamin Collet <benjamin.collet@protonmail.ch>
//
// SPDX-License-Identifier: CECILL-2.1

// https://www.crossref.org/blog/dois-and-matching-regular-expressions/
const re = /10\.\d{4,9}\/[-._;()/:A-Z0-9]+/i;

async function resolve(doi) {
  let url = 'https://doi.org/';
  const value = await browser.storage.sync.get('resolverUrl');
  if (value.resolverUrl) {
    url = value.resolverUrl;
  }
  if (url.slice(-1) !== '/') {
    url += '/';
  }
  return url + doi;
}

browser.contextMenus.create({
  id: 'menuLink',
  title: 'Open Link as DOI',
  contexts: ['link'],
});

browser.contextMenus.create({
  id: 'menuSelection',
  title: 'Open Selection as DOI',
  contexts: ['selection'],
});

browser.contextMenus.onClicked.addListener((info) => {
  let input;
  if (info.linkUrl) {
    input = decodeURIComponent(info.linkUrl);
  } else if (info.selectionText) {
    input = info.selectionText;
  }
  const doi = input.match(re);
  if (doi) {
    resolve(doi[0]).then((value) => browser.tabs.create({ url: value }));
  }
});

browser.omnibox.onInputEntered.addListener((text, disposition) => {
  const doi = text.match(re);
  if (doi) {
    resolve(doi[0]).then((value) => {
      switch (disposition) {
        case 'currentTab':
          browser.tabs.update({ url: value });
          break;
        case 'newForegroundTab':
          browser.tabs.create({ url: value });
          break;
        case 'newBackgroundTab':
          browser.tabs.create({ url: value, active: false });
          break;
        default:
          break;
      }
    });
  }
});

browser.webRequest.onBeforeRequest.addListener(
  async (details) => {
    // Wikipedia generate URI encoded links (e.g. https://doi.org/10.2307%2F2312726)
    const doi = decodeURIComponent(details.url).match(re);
    if (doi) {
      const value = await browser.storage.sync.get(['resolverUrl', 'autoRedirect']);
      if (value.autoRedirect && !value.resolverUrl.includes('doi.org')) {
        const url = await resolve(doi[0]);
        return { redirectUrl: url };
      }
    }
    return {};
  },
  { urls: ['*://*.doi.org/*'], types: ['main_frame'] },
  ['blocking'],
);
