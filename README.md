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
├── form-configs/         # 表单配置文件夹
├── data-collectors/      # 数据收集器文件夹
├── status-window/        # 状态展示窗口
├── logging/              # 日志系统
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

## Chrome插件调试方法

### 1. 安装和重新加载插件

1. 打开 `chrome://extensions/`
2. 开启"开发者模式"
3. 点击"加载已解压的扩展程序"，选择 `extensions-jarvis` 文件夹
4. 每次修改代码后，点击插件卡片上的"刷新"按钮

### 2. 查看日志

**日志位置：**
- **content.js** - 在网页的开发者工具Console中查看
- **background.js** - 在插件管理页面点击"检查视图 service worker"
- **popup.js** - 右键插件图标选择"检查弹出内容"

### 3. 测试步骤

1. **测试登录功能**
   - 点击插件图标
   - 输入测试邮箱密码
   - 查看Console是否有错误

2. **测试页面检测**
   - 访问任意网页
   - 按F12打开开发者工具
   - 查看Console中的日志信息

3. **测试API调用**
   - 在Network标签页查看API请求
   - 检查请求头和响应数据

4. **测试表单填充**
   - 打开目标表单页面
   - 在Console中手动测试：
   ```javascript
   // 测试选择器是否正确
   document.querySelector('input[name="email"]')
   
   // 测试填充功能
   const element = document.querySelector('input[name="email"]');
   element.value = 'test@example.com';
   ```

### 4. 常见问题排查

- **按钮不显示** - 检查API返回的`is_apply_wizard`字段
- **表单不填充** - 检查CSS选择器是否正确
- **API调用失败** - 检查网络请求和TOKEN
- **配置文件加载失败** - 检查文件路径和权限设置

### 5. 日志系统

插件内置完整的日志记录系统，存储在Chrome本地存储中：

**查看日志：**
```javascript
// 在网页Console中执行（需要先点击一键AI申请按钮加载日志系统）

// 查看所有操作日志
if (window.RuntimeLogger) {
  RuntimeLogger.getLogs().then(logs => console.table(logs));
} else {
  console.log('日志系统未加载，请先点击一键AI申请按钮');
}

// 查看操作跟踪记录
if (window.OperationTracker) {
  console.table(OperationTracker.getOperations());
}

// 查看最后一次操作
if (window.OperationTracker) {
  console.log(OperationTracker.getLastOperation());
}

// 清除日志
if (window.RuntimeLogger) {
  RuntimeLogger.clearLogs();
}
```

**重要说明：**
- 日志系统只在点击“一键AI申请”按钮后才会加载
- 在此之前查看日志会显示“日志系统未加载”
- 日志信息主要在Console中查看，使用`[INIT]`、`[APPLY]`等标签

**日志存储位置：**
- Chrome本地存储键：`extensionLogs`
- 自动保存最近50条日志记录
- 包含时间戳、模块、消息和数据

### 6. 实时调试技巧

在浏览器Console中直接测试：
```javascript
// 查看当前页面的表单元素
document.querySelectorAll('input, select, textarea');

// 测试数据收集器
window.homes_for_students_applicationDataCollector?.extractUserInfo({email: 'test@test.com'});

// 手动触发填充
new FormFiller('homes_for_students_application', {email: 'test@test.com'}).fillForm();
```