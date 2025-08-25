window.visa_applicationDataCollector = {
  // 从API响应中提取用户信息
  extractUserInfo: (apiResponse) => {
    return {
      email: apiResponse.email,
      city: apiResponse.city,
      country: apiResponse.country,
      passportNumber: apiResponse.passport_number || apiResponse.passportNumber,
      nationality: apiResponse.nationality,
      birthDate: apiResponse.birth_date || apiResponse.birthDate
    };
  },
  
  // 生成状态窗口显示信息
  getDisplayInfo: (apiResponse) => {
    return {
      '邮箱': apiResponse.email,
      '城市': apiResponse.city,
      '国家': apiResponse.country,
      '国籍': apiResponse.nationality || '未提供',
      '护照号': apiResponse.passport_number || apiResponse.passportNumber || '未提供',
      'Supplier Job': 'visa_application'
    };
  }
};