// 后台脚本处理页面跳转
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openApplyPage') {
    chrome.tabs.create({ url: message.url }, (tab) => {
      // 等待页面加载完成后填充表单
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (tabId === tab.id && info.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          
          // 向新页面发送填充表单的消息
          chrome.tabs.sendMessage(tabId, {
            action: 'fillForm',
            supplierJob: message.supplierJob,
            userInfo: message.userInfo
          });
        }
      });
    });
  } else if (message.action === 'apiRequest') {
    // 处理API请求
    fetch(message.url, {
      method: message.method,
      headers: message.headers,
      body: message.body
    })
    .then(response => response.json())
    .then(data => {
      sendResponse({ success: true, data });
    })
    .catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    
    return true; // 保持消息通道开放
  }
});