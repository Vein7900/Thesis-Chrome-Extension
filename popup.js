document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get('currentURL', (data) => {
    document.getElementById('url-display').innerText = `Do you want to continue to ${data.currentURL}?`;
  });

  document.getElementById('yes-button').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "continue" });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.remove(tabs[0].id); // Close the popup tab
    });
  });

  document.getElementById('no-button').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "cancel" });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.remove(tabs[0].id); // Close the popup tab
    });
  });
});
