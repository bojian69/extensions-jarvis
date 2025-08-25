# Chrome浏览器插件 - AI申请助手

## 功能特性

1. **用户登录**: 邮箱密码登录，TOKEN本地存储
2. **智能检测**: 根据页面标记自动显示"一键AI申请"按钮
3. **API集成**: 调用后端API获取申请信息
4. **自动填表**: 根据web_key配置自动填充不同表单

## 文件结构

```
extensions-jarvis/
├── manifest.json          # 插件配置文件
├── popup.html            # 登录界面
├── popup.js              # 登录逻辑
├── content.js            # 内容脚本
├── background.js         # 后台脚本
├── form-filler.js        # 表单填充中间件
├── config.js             # API配置
└── README.md             # 说明文档
```

## 使用方法

1. 修改 `config.js` 中的API地址
2. 在Chrome中加载插件
3. 点击插件图标登录
4. 访问支持的页面会自动显示申请按钮

## 中间件配置

在 `form-configs/` 文件夹中可以添加新的supplier_job配置:

```javascript
window.your_supplier_jobConfig = {
  selectors: {
    field_name: 'css_selector'
  },
  actions: {
    fillFieldName: (element, userInfo) => element.value = userInfo.field
  }
}
```

## API接口

需要后端提供以下接口:
- POST /api/auth/login - 用户登录
- POST /api/page/check - 检查页面是否支持
- POST /api/apply/submit - 提交申请获取填表信息