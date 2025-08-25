// 精简版AI申请助手
class AIApplyAssistant {
  constructor() {
    this.token = null;
    this.baseUrl = 'http://api-service.xyz:8888';
    this.endpoints = {
      CHECK_WIZARD: '/partner/automaApply/checkApplyWizard'
    };
    this.init();
  }
  
  async init() {
    const storage = await chrome.storage.local.get(['token']);
    this.token = storage.token;
    
    if (this.token) {
      this.checkPageAndInjectButton();
    }
  }
  
  async checkPageAndInjectButton() {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'apiRequest',
        url: this.baseUrl + this.endpoints.CHECK_WIZARD,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: window.location.href })
      });
      
      if (response && response.data) {
        const data = response.data.data || response.data;
        if (data.is_apply_wizard) {
          this.injectApplyButton();
        }
      }
    } catch (error) {
      console.error('检查页面失败:', error);
    }
  }
  
  injectApplyButton() {
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
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'apiRequest',
        url: this.baseUrl + this.endpoints.CHECK_WIZARD,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: window.location.href })
      });
      
      if (!response || !response.success) {
        throw new Error(`API错误: ${response?.error || '未知错误'}`);
      }
      
      const data = response.data.data || response.data;
      
      if (data.supplier_url && data.supplier_job) {
        const processedData = await this.processApiResponse(data.supplier_job, data);
        
        chrome.runtime.sendMessage({
          action: 'openApplyPage',
          url: data.supplier_url,
          supplierJob: data.supplier_job,
          userInfo: processedData.userInfo
        });
      } else {
        alert('获取申请信息失败');
      }
    } catch (error) {
      console.error('申请失败:', error);
      alert('申请失败: ' + error.message);
    }
  }
  
  async processApiResponse(supplierJob, apiResponse) {
    try {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL(`data-collectors/${supplierJob}.js`);
      
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = () => {
          const defaultScript = document.createElement('script');
          defaultScript.src = chrome.runtime.getURL('data-collectors/default.js');
          defaultScript.onload = resolve;
          defaultScript.onerror = reject;
          document.head.appendChild(defaultScript);
        };
        document.head.appendChild(script);
      });
      
      const collector = window[`${supplierJob}DataCollector`] || window.defaultDataCollector;
      
      if (collector) {
        return {
          userInfo: collector.extractUserInfo(apiResponse),
          displayInfo: collector.getDisplayInfo(apiResponse)
        };
      }
    } catch (error) {
      console.error('数据收集器加载失败:', error);
    }
    
    return {
      userInfo: {
        email: apiResponse.email,
        city_name: apiResponse.city_name,
        country_name: apiResponse.country_name
      },
      displayInfo: {
        '邮箱': apiResponse.email,
        '城市': apiResponse.city_name,
        '国家': apiResponse.country_name
      }
    };
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fillForm') {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('form-filler.js');
    script.onload = () => {
      const filler = new FormFiller(message.supplierJob, message.userInfo);
      filler.fillForm();
    };
    document.head.appendChild(script);
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new AIApplyAssistant());
} else {
  new AIApplyAssistant();
}