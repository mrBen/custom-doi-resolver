// SPDX-FileCopyrightText: 2022 Benjamin Collet <benjamin.collet@protonmail.ch>
//
// SPDX-License-Identifier: CECILL-2.1

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['resolverUrl', 'autoRedirect'], (value) => {
    document.getElementById('resolver-url').value = value.resolverUrl || 'https://doi.org/';
    document.getElementById('auto-redirect').checked = value.autoRedirect;
  });
});

document.querySelector('form').addEventListener('change', () => {
  chrome.storage.sync.set({
    resolverUrl: document.getElementById('resolver-url').value,
    autoRedirect: document.getElementById('auto-redirect').checked,
  });
});
