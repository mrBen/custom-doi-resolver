function saveOptions() {
  browser.storage.sync.set({
    resolverUrl: document.querySelector('#resolver-url').value
  });
}

function restoreOptions() {
  browser.storage.sync.get('resolverUrl').then((result) => {
    document.querySelector('#resolver-url').value = result.resolverUrl || "https://doi.org/";
  })
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form').addEventListener('submit', saveOptions);
