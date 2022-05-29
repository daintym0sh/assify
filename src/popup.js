'use strict';

import './popup.css';

(function() {

  const counterStorage = {
    get: cb => {
      chrome.storage.sync.get(['count'], result => {
        cb(result.count);
      });
    },
    set: (value, cb) => {
      chrome.storage.sync.set(
        {
          count: value,
        },
        () => {
          cb();
        }
      );
    },
  };

  function setupCounter(initialValue = 0) {

    document.getElementById('counter').innerHTML = initialValue;

    document.getElementById('incrementBtn').addEventListener('click', () => {
      updateCounter({
        type: 'INCREMENT',
      });
    });

    document.getElementById('decrementBtn').addEventListener('click', () => {
      updateCounter({
        type: 'DECREMENT',
      });
    });
  }

  function updateCounter({ type }) {

    counterStorage.get(count => {

      let newCount;

      if (type === 'INCREMENT') {
        newCount = count + 1;
      } else if (type === 'DECREMENT') {
        newCount = count - 1;
      } else {
        newCount = count;
      }

      counterStorage.set(newCount, () => {
        document.getElementById('counter').innerHTML = newCount;
        sendCountMessage("COUNT", newCount);
      });
    });
  }

  function initialize() {
    
    document.getElementById('assifyBtn').addEventListener('click', () => {
      assify();
    });

    let onLoadCheckbox = document.getElementById('onLoad');

    chrome.storage.sync.get(['onLoad'], result => {
      onLoadCheckbox.checked = result.onLoad;
    })

    onLoadCheckbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        chrome.storage.sync.set({"onLoad": true})
      } else {
        chrome.storage.sync.set({"onLoad": false})
      }
    });

    counterStorage.get(count => {
      if (typeof count === 'undefined') {
        counterStorage.set(0, () => {
          setupCounter(0);
        });
      } else {
        setupCounter(count);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', initialize);

  function assify() {

    counterStorage.get(count => {
      sendCountMessage("ASSIFY", count);
    });
  }

  function sendCountMessage(type, count) {
    
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const tab = tabs[0];

      chrome.tabs.sendMessage(
        tab.id,
        {
          type: type,
          payload: {
            count: count,
          },
        },
        response => {
          console.log('Current count value passed to contentScript file');
        }
      );
    });
  }

})();
