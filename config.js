// API配置文件
const API_CONFIG = {
  BASE_URL: 'http://api-service.xyz:8888',
  ENDPOINTS: {
    LOGIN: '/partner/automaApply/login',
    CHECK_PAGE: '/partner/automaApply/checkApplyWizard',
    APPLY: '/partner/automaApply/checkApplyItem',
  }
};

// 使用示例:
// const loginUrl = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.LOGIN;