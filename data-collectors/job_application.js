window.job_applicationDataCollector = {
  // 从API响应中提取用户信息
  extractUserInfo: (apiResponse) => {
    return {
      email: apiResponse.email,
      fullName: apiResponse.full_name || apiResponse.fullName,
      city: apiResponse.city,
      country: apiResponse.country,
      experience: apiResponse.experience_years || apiResponse.experience,
      skills: apiResponse.skills,
      resume: apiResponse.resume_url || apiResponse.resumeUrl
    };
  },
  
  // 生成状态窗口显示信息
  getDisplayInfo: (apiResponse) => {
    return {
      '邮箱': apiResponse.email,
      '姓名': apiResponse.full_name || apiResponse.fullName || '未提供',
      '位置': `${apiResponse.city}, ${apiResponse.country}`,
      '经验': `${apiResponse.experience_years || apiResponse.experience || 0}年`,
      '技能': apiResponse.skills || '未提供',
      'Supplier Job': 'job_application'
    };
  }
};