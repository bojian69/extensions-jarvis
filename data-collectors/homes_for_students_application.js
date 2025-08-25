window.homes_for_students_applicationDataCollector = {
  // 从API响应中提取用户信息
  extractUserInfo: (apiResponse) => {
    return {
      email: apiResponse.email,
      city_name: apiResponse.city_name,
      country_name: apiResponse.country_name
    };
  },
  
  getDisplayInfo: (apiResponse) => {
    return {
      '邮箱': apiResponse.email,
      '城市': apiResponse.city_name,
      '国家': apiResponse.country_name,
      'Supplier Job': 'homes_for_students_application'
    };
  }
};