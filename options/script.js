document.addEventListener('DOMContentLoaded', function() {
  browser.storage.sync.get(['resolverUrl', 'autoRedirect']).then((value) => {
    document.querySelector('#resolver-url').value = value.resolverUrl || "https://doi.org/";
    document.querySelector('#auto-redirect').checked = value.autoRedirect;
  })
});

document.querySelector('form').addEventListener('change', function() {
  browser.storage.sync.set({
    resolverUrl: document.querySelector('#resolver-url').value,
    autoRedirect: document.querySelector('#auto-redirect').checked
  });
});
