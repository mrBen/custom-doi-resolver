document.addEventListener('DOMContentLoaded', function() {
  browser.storage.sync.get(['resolverUrl', 'autoRedirect']).then((value) => {
    document.getElementById('resolver-url').value = value.resolverUrl || "https://doi.org/";
    document.getElementById('auto-redirect').checked = value.autoRedirect;
  })
});

document.querySelector('form').addEventListener('change', function() {
  browser.storage.sync.set({
    resolverUrl: document.getElementById('resolver-url').value,
    autoRedirect: document.getElementById('auto-redirect').checked
  });
});
