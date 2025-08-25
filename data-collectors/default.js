window.defaultDataCollector = {
  // 从API响应中提取用户信息
  extractUserInfo: (apiResponse) => {
    return {
      email: apiResponse.email,
      city: apiResponse.city,
      country: apiResponse.country,
      name: apiResponse.name || apiResponse.full_name,
      phone: apiResponse.phone
    };
  },
  
  // 生成状态窗口显示信息
  getDisplayInfo: (apiResponse) => {
    return {
      '邮箱': apiResponse.email,
      '城市': apiResponse.city,
      '国家': apiResponse.country,
      '姓名': apiResponse.name || apiResponse.full_name || '未提供',
      'Supplier Job': 'default'
    };
  }
};