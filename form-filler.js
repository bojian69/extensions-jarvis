// 表单填充中间件
class FormFiller {
  constructor(supplierJob, userInfo) {
    this.supplierJob = supplierJob;
    this.userInfo = userInfo;
    this.config = null;
    this.loadConfig();
  }
  
  async loadConfig() {
    try {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL(`form-configs/${this.supplierJob}.js`);
      
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = () => {
          // 加载默认配置
          const defaultScript = document.createElement('script');
          defaultScript.src = chrome.runtime.getURL('form-configs/default.js');
          defaultScript.onload = resolve;
          defaultScript.onerror = reject;
          document.head.appendChild(defaultScript);
        };
        document.head.appendChild(script);
      });
      
      // 获取配置
      this.config = window[`${this.supplierJob}Config`] || window.defaultConfig;
    } catch (error) {
      console.error('加载配置失败:', error);
    }
  }
  
  async fillForm() {
    if (!this.config) {
      await this.loadConfig();
    }
    
    setTimeout(() => {
      if (!this.config) return;
      
      Object.entries(this.config.selectors).forEach(([field, selector]) => {
        const element = document.querySelector(selector);
        if (element && this.config.actions[`fill${this.capitalize(field)}`]) {
          this.config.actions[`fill${this.capitalize(field)}`](element, this.userInfo);
          
          // 触发change事件
          element.dispatchEvent(new Event('change', { bubbles: true }));
          element.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
    }, 1000);
  }
  
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// 添加到content.js中
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FormFiller;
}