document.addEventListener('DOMContentLoaded', async () => {
  const loginForm = document.getElementById('loginForm');
  const loggedIn = document.getElementById('loggedIn');
  const status = document.getElementById('status');
  
  // 检查登录状态
  const token = await chrome.storage.local.get(['token', 'userEmail']);
  console.log('[初始化] 检查存储的token:', token);
  if (token.token) {
    console.log('[初始化] 发现已登录token，显示已登录状态');
    showLoggedIn(token.userEmail);
  } else {
    console.log('[初始化] 未发现token，显示登录表单');
  }
  
  // 登录
  document.getElementById('loginBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
      showStatus('请填写邮箱和密码', 'error');
      return;
    }
    
    try {
      console.log('[登录] 开始登录请求:', { email, url: API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.LOGIN });
      
      const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      console.log('[登录] 响应状态:', response.status, response.statusText);
      
      const data = await response.json();
      console.log('[登录] 响应数据:', data);
      const message = data.message || '未知错误';
      if (data.error_code !== 0) {
        console.log('[登录] 登录失败:', message);
        showStatus('登录失败: ' + (message|| '未知错误'), 'error');
        return;
      }

      // 解析登录内容
      
      if (data.data.token) {
        console.log('[登录] 登录成功，保存token');
        await chrome.storage.local.set({ token: data.data.token, userEmail: email });
        showLoggedIn(email);
        showStatus('登录成功', 'success');
      } else {
        console.log('[登录] 登录失败，未获取到token:', data);
        showStatus('登录失败: ' + (message|| '未知错误'), 'error');
      }
    } catch (error) {
      console.error('[登录] 网络错误:', error);
      showStatus('网络错误: ' + error.message, 'error');
    }
  });
  
  // 退出登录
  document.getElementById('logoutBtn').addEventListener('click', async () => {
    console.log('[退出] 开始退出登录');
    await chrome.storage.local.remove(['token', 'userEmail']);
    console.log('[退出] 已清除token');
    showLoginForm();
    showStatus('已退出登录', 'success');
  });
  
  function showLoggedIn(email) {
    console.log('[显示] 显示已登录状态:', email);
    loginForm.style.display = 'none';
    loggedIn.style.display = 'block';
    document.getElementById('userEmail').textContent = email;
  }
  
  function showLoginForm() {
    loginForm.style.display = 'block';
    loggedIn.style.display = 'none';
  }
  
  function showStatus(message, type) {
    status.textContent = message;
    status.className = `status ${type}`;
    setTimeout(() => status.textContent = '', 3000);
  }
});