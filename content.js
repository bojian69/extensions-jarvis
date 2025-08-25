// 页面检测和按钮注入
class AIApplyAssistant {
  constructor() {
    this.token = null;
    this.statusManager = new StatusManager();
    this.dataCollectorManager = new DataCollectorManager();
    this.init();
  }
  
  async init() {
    // 获取token
    const storage = await chrome.storage.local.get(['token']);
    this.token = storage.token;
    
    if (this.token) {
      this.checkPageAndInjectButton();
    }
  }
  
  async checkPageAndInjectButton() {
    try {
      // 检查页面是否有is_apply_wizard标记
      const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CHECK_PAGE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: window.location.href })
      });
      
      const data = await response.json();
      if (data.is_apply_wizard) {
        this.injectApplyButton();
      }
    } catch (error) {
      console.error('检查页面失败:', error);
    }
  }
  
  injectApplyButton() {
    // 避免重复注入
    if (document.getElementById('ai-apply-btn')) return;
    
    const button = document.createElement('button');
    button.id = 'ai-apply-btn';
    button.textContent = '一键AI申请';
    button.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      padding: 10px 20px;
      background: #4285f4;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    `;
    
    button.addEventListener('click', () => this.handleApplyClick());
    document.body.appendChild(button);
  }
  
  async handleApplyClick() {
    // 打开状态窗口
    this.statusManager.openStatusWindow();
    
    try {
      // 步骤1: 检测页面支持
      this.statusManager.updateStatus(1, 'processing', '检测中...');
      
      // 步骤2: 获取用户信息
      this.statusManager.updateStatus(1, 'completed', '检测完成');
      this.statusManager.updateStatus(2, 'processing', '获取中...');
      
      const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.APPLY, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: window.location.href })
      });
      
      const data = await response.json();
      if (data.supplier_url && data.supplier_job) {
        this.statusManager.updateStatus(2, 'completed', '获取成功');
        
        // 使用数据收集器处理API响应
        const processedData = await this.dataCollectorManager.processApiResponse(data.supplier_job, data);
        
        this.statusManager.showInfo(processedData.displayInfo);
        
        // 步骤3: 打开申请页面
        this.statusManager.updateStatus(3, 'processing', '打开中...');
        
        // 发送消息给background script打开新页面
        chrome.runtime.sendMessage({
          action: 'openApplyPage',
          url: data.supplier_url,
          supplierJob: data.supplier_job,
          userInfo: processedData.userInfo,
          statusManager: true
        });
      }
    } catch (error) {
      console.error('申请失败:', error);
      this.statusManager.updateStatus(2, 'error', '失败');
    }
  }
}

// 监听来自background的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fillForm') {
    // 动态加载FormFiller
    if (typeof FormFiller === 'undefined') {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('form-filler.js');
      script.onload = () => {
        const filler = new FormFiller(message.supplierJob, message.userInfo);
        filler.fillForm();
      };
      document.head.appendChild(script);
    } else {
      const filler = new FormFiller(message.supplierJob, message.userInfo);
      filler.fillForm();
    }
  }
});

// 加载配置文件
const configScript = document.createElement('script');
configScript.src = chrome.runtime.getURL('config.js');
configScript.onload = () => {
  // 加载状态管理器和数据收集器管理器
  const statusScript = document.createElement('script');
  statusScript.src = chrome.runtime.getURL('status-window/status-manager.js');
  statusScript.onload = () => {
    const dataScript = document.createElement('script');
    dataScript.src = chrome.runtime.getURL('data-collectors/data-collector-manager.js');
    dataScript.onload = () => {
      // 初始化
      new AIApplyAssistant();
    };
    document.head.appendChild(dataScript);
  };
  document.head.appendChild(statusScript);
};
document.head.appendChild(configScript);