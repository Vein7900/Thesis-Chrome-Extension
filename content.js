chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "checkURL") {
    chrome.storage.local.set({ currentURL: message.url });
    chrome.action.openPopup();
  }
});
