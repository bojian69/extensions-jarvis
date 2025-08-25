// 数据收集器管理器
class DataCollectorManager {
  constructor() {
    this.collectors = {};
  }
  
  async loadCollector(supplierJob) {
    if (this.collectors[supplierJob]) {
      return this.collectors[supplierJob];
    }
    
    try {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL(`data-collectors/${supplierJob}.js`);
      
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = () => {
          // 加载默认收集器
          const defaultScript = document.createElement('script');
          defaultScript.src = chrome.runtime.getURL('data-collectors/default.js');
          defaultScript.onload = resolve;
          defaultScript.onerror = reject;
          document.head.appendChild(defaultScript);
        };
        document.head.appendChild(script);
      });
      
      // 获取收集器
      const collector = window[`${supplierJob}DataCollector`] || window.defaultDataCollector;
      this.collectors[supplierJob] = collector;
      return collector;
    } catch (error) {
      console.error('加载数据收集器失败:', error);
      return window.defaultDataCollector;
    }
  }
  
  async processApiResponse(supplierJob, apiResponse) {
    const collector = await this.loadCollector(supplierJob);
    
    return {
      userInfo: collector.extractUserInfo(apiResponse),
      displayInfo: collector.getDisplayInfo(apiResponse)
    };
  }
}