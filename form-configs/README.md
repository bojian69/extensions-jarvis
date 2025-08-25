# 表单配置文件夹

每个web_key对应一个独立的配置文件。

## 添加新配置

创建新文件 `your_supplier_job.js`:

```javascript
window.your_supplier_jobConfig = {
  selectors: {
    email: 'input[name="email"]',
    name: 'input[name="name"]'
  },
  actions: {
    fillEmail: (element, userInfo) => element.value = userInfo.email,
    fillName: (element, userInfo) => element.value = userInfo.name
  }
};
```

## 现有配置

- `homes_for_students_application.js` - HomesForStudents申请表单
- `visa_application.js` - 签证申请表单
- `job_application.js` - 工作申请表单  
- `default.js` - 默认配置