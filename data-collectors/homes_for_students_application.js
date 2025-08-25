window.homes_for_students_applicationDataCollector = {
  // 从API响应中提取用户信息
  extractUserInfo: (apiResponse) => {
    return {
      email: apiResponse.email,
      firstName: apiResponse.first_name || apiResponse.firstName,
      lastName: apiResponse.last_name || apiResponse.lastName,
      city: apiResponse.city,
      country: apiResponse.country,
      phone: apiResponse.phone || apiResponse.mobile,
      address: apiResponse.address,
      zipCode: apiResponse.zip_code || apiResponse.zipCode
    };
  },
  
  // 生成状态窗口显示信息
  getDisplayInfo: (apiResponse) => {
    return {
      '邮箱': apiResponse.email,
      '姓名': `${apiResponse.first_name || ''} ${apiResponse.last_name || ''}`.trim(),
      '城市': apiResponse.city,
      '国家': apiResponse.country,
      '电话': apiResponse.phone || apiResponse.mobile || '未提供',
      'Supplier Job': 'homes_for_students_application'
    };
  }
};