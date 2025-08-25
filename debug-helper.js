// 调试助手
class DebugHelper {
  static log(message, data = null) {
    console.log(`[AI申请助手] ${message}`, data);
  }
  
  static error(message, error = null) {
    console.error(`[AI申请助手] ${message}`, error);
  }
  
  static showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: #333;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 99999;
      font-size: 14px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
  }
}