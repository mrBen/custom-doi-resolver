// SPDX-FileCopyrightText: 2022 Benjamin Collet <benjamin.collet@protonmail.ch>
//
// SPDX-License-Identifier: CECILL-2.1

//              _        ____          _ _               _
//   __ _ _   _| |_ ___ |  _ \ ___  __| (_)_ __ ___  ___| |_
//  / _` | | | | __/ _ \| |_) / _ \/ _` | | '__/ _ \/ __| __|
// | (_| | |_| | || (_) |  _ <  __/ (_| | | | |  __/ (__| |_
//  \__,_|\__,_|\__\___/|_| \_\___|\__,_|_|_|  \___|\___|\__|
//

function displayAutoRedirect(isEnable) {
  const button = document.getElementById('auto-redirect');
  const text = document.querySelector('#auto-redirect>span');
  if (isEnable) {
    button.classList.add('default');
    text.innerHTML = 'On';
  } else {
    button.classList.remove('default');
    text.innerHTML = 'Off';
  }
}

function setAutoRedirect(isEnable) {
  browser.storage.sync.set({ autoRedirect: isEnable });
  displayAutoRedirect(isEnable);
}

function initAutoRedirect(isEnable) {
  if (isEnable === undefined) {
    setAutoRedirect(true);
  } else {
    displayAutoRedirect(isEnable);
  }
}

//                      _
//  _ __ ___  ___  ___ | |_   _____ _ __ ___
// | '__/ _ \/ __|/ _ \| \ \ / / _ \ '__/ __|
// | | |  __/\__ \ (_) | |\ V /  __/ |  \__ \
// |_|  \___||___/\___/|_| \_/ \___|_|  |___/
//

function setRadioVisibility(areVisible) {
  document.querySelectorAll('input[type="radio"]').forEach((el) => {
    document.getElementById(el.id)
      .style.visibility = areVisible ? 'visible' : 'hidden';
  });
}

function saveResolvers() {
  let oneEmpty = false;

  const resolverList = { urls: {} };
  const itemList = document.getElementById('resolver-list').children;
  for (let i = 0; i < itemList.length; i += 1) {
    if (itemList[i].id !== 'new-item') {
      const url = document.getElementById(`url-${itemList[i].id}`).value;
      resolverList.urls[itemList[i].id] = url;
      if (url === '') {
        oneEmpty = true;
      }
    }
  }
  const selected = document.querySelector('input[name="resolver-url"]:checked');
  if (selected) {
    resolverList.selected = selected.value;
  } else {
    resolverList.selected = 0;
    document.getElementById('radio-0').checked = true;
  }

  browser.storage.sync.set({
    resolvers: resolverList,
    resolverUrl: resolverList.urls[resolverList.selected],
  });

  document.getElementById('new-item').style.display = oneEmpty ? 'none' : 'unset';
  setRadioVisibility(Object.keys(resolverList.urls).length > 1);
}

function removeResolver(id) {
  return () => {
    document.getElementById('resolver-list')
      .removeChild(document.getElementById(`${id}`));
    saveResolvers();
  };
}

function addResolver(id) {
  const radio = document.createElement('input');
  radio.type = 'radio';
  radio.name = 'resolver-url';
  radio.value = id;
  radio.id = `radio-${id}`;

  const url = document.createElement('input');
  url.type = 'url';
  url.id = `url-${id}`;
  if (id === '0') {
    url.placeholder = 'https://doi.org';
  }

  const button = document.createElement('button');
  if (id !== '0') {
    const icon = document.createElement('img');
    icon.src = '../icons/Photon/Delete.svg';
    button.appendChild(icon);
    button.addEventListener('click', removeResolver(id));
  } else {
    button.style.visibility = 'hidden';
  }

  const item = document.createElement('div');
  item.classList.add('browser-style', 'panel-formElements-item');
  item.id = `${id}`;
  item.appendChild(radio);
  item.appendChild(url);
  item.appendChild(button);

  const resolverList = document.getElementById('resolver-list');
  resolverList.insertBefore(item, document.getElementById('new-item'));
}

function buildResolver(resolvers) {
  Object.keys(resolvers.urls).forEach((id) => {
    const url = resolvers.urls[id];
    addResolver(id);
    document.getElementById(`url-${id}`).value = url;
  });

  document.getElementById(`radio-${resolvers.selected}`).checked = true;

  if (Object.keys(resolvers.urls).length <= 1) {
    setRadioVisibility(false);
  }
}

function initResolvers(storedValue) {
  let resolvers;
  if (storedValue === undefined) {
    resolvers = {
      selected: 0,
      urls: {
        0: '',
      },
    };
    document.getElementById('new-item').style.display = 'none';
  } else {
    resolvers = storedValue;
  }
  buildResolver(resolvers);
}

//                       _
//   _____   _____ _ __ | |_ ___
//  / _ \ \ / / _ \ '_ \| __/ __|
// |  __/\ V /  __/ | | | |_\__ \
//  \___| \_/ \___|_| |_|\__|___/
//

document.addEventListener('DOMContentLoaded', () => {
  browser.storage.sync.get(['resolvers', 'autoRedirect']).then((value) => {
    initAutoRedirect(value.autoRedirect);
    initResolvers(value.resolvers);
  });
});

document.querySelector('#new-item>button').addEventListener('click', () => {
  addResolver(Math.random());
  saveResolvers();
});

document.getElementById('auto-redirect').addEventListener('click', () => {
  browser.storage.sync.get(['autoRedirect']).then((value) => {
    setAutoRedirect(!value.autoRedirect);
  });
});

document.getElementById('resolver-list').addEventListener('input', () => {
  saveResolvers();
});
