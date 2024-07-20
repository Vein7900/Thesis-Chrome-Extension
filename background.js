let currentRequestDetails = null;
let popupOpened = false;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && changeInfo.status === 'loading' && !popupOpened && changeInfo.url !== "chrome://newtab/") {
    currentRequestDetails = { tabId, url: changeInfo.url };
    chrome.storage.local.set({ currentURL: changeInfo.url });
    popupOpened = true; // Set the flag to indicate the popup is open
    chrome.tabs.create({ url: "popup.html" });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "continue" && currentRequestDetails) {
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [2],
      addRules: [
        {
          id: 2,
          priority: 1,
          action: {
            type: "allow"
          },
          condition: {
            urlFilter: currentRequestDetails.url,
            resourceTypes: ["main_frame"]
          }
        }
      ]
    }, () => {
      chrome.tabs.reload(currentRequestDetails.tabId); // Automatically refresh the tab
      currentRequestDetails = null;
      popupOpened = false; // Reset the flag
    });
  } else if (message.action === "cancel") {
    currentRequestDetails = null;
    popupOpened = false; // Reset the flag
  }
});
