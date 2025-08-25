// 状态管理器 - 在content.js中使用
class StatusManager {
  constructor() {
    this.statusWindow = null;
  }
  
  openStatusWindow() {
    if (this.statusWindow && !this.statusWindow.closed) {
      this.statusWindow.focus();
      return;
    }
    
    const url = chrome.runtime.getURL('status-window/status-window.html');
    this.statusWindow = window.open(url, 'statusWindow', 
      'width=370,height=500,resizable=no,scrollbars=no,status=no,toolbar=no,menubar=no'
    );
  }
  
  updateStatus(step, status, message) {
    if (this.statusWindow && !this.statusWindow.closed) {
      this.statusWindow.postMessage({
        type: 'STATUS_UPDATE',
        step: step,
        status: status,
        message: message
      }, '*');
    }
  }
  
  showInfo(info) {
    if (this.statusWindow && !this.statusWindow.closed) {
      this.statusWindow.postMessage({
        type: 'SHOW_INFO',
        info: info
      }, '*');
    }
  }
  
  closeStatusWindow() {
    if (this.statusWindow && !this.statusWindow.closed) {
      this.statusWindow.close();
    }
  }
}