# 数据收集器

根据不同的supplier_job处理API返回的数据结构。

## 文件结构

- `data-collector-manager.js` - 数据收集器管理器
- `homes_for_students_application.js` - HomesForStudents申请数据收集器
- `visa_application.js` - 签证申请数据收集器
- `job_application.js` - 工作申请数据收集器
- `default.js` - 默认数据收集器

## 添加新的数据收集器

创建新文件 `your_supplier_job.js`:

```javascript
window.your_supplier_jobDataCollector = {
  // 从API响应中提取用户信息
  extractUserInfo: (apiResponse) => {
    return {
      email: apiResponse.email,
      name: apiResponse.name,
      // 其他字段...
    };
  },
  
  // 生成状态窗口显示信息
  getDisplayInfo: (apiResponse) => {
    return {
      '邮箱': apiResponse.email,
      '姓名': apiResponse.name,
      'Supplier Job': 'your_supplier_job'
    };
  }
};
```

## 功能

- 自动根据supplier_job加载对应的数据收集器
- 统一处理不同API响应格式
- 提取表单填充所需的用户信息
- 生成状态窗口显示信息