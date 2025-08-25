# 状态展示窗口

独立的状态展示模块，显示AI申请助手的执行步骤。

## 文件结构

- `status-window.html` - 状态窗口界面
- `status-window.css` - 样式文件
- `status-window.js` - 窗口逻辑
- `status-manager.js` - 状态管理器

## 使用方法

```javascript
const statusManager = new StatusManager();

// 打开状态窗口
statusManager.openStatusWindow();

// 更新步骤状态
statusManager.updateStatus(1, 'processing', '检测中...');
statusManager.updateStatus(1, 'completed', '检测完成');

// 显示信息
statusManager.showInfo({
  '邮箱': 'user@example.com',
  '城市': '北京'
});
```

## 状态类型

- `processing` - 进行中
- `completed` - 已完成  
- `error` - 错误