document.addEventListener('DOMContentLoaded', async () => {
  const loginForm = document.getElementById('loginForm');
  const loggedIn = document.getElementById('loggedIn');
  const status = document.getElementById('status');
  
  // 检查登录状态
  const token = await chrome.storage.local.get(['token', 'userEmail']);
  if (token.token) {
    showLoggedIn(token.userEmail);
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
      const response = await fetch('YOUR_LOGIN_API_URL', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      if (data.token) {
        await chrome.storage.local.set({ token: data.token, userEmail: email });
        showLoggedIn(email);
        showStatus('登录成功', 'success');
      } else {
        showStatus('登录失败', 'error');
      }
    } catch (error) {
      showStatus('网络错误', 'error');
    }
  });
  
  // 退出登录
  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await chrome.storage.local.remove(['token', 'userEmail']);
    showLoginForm();
    showStatus('已退出登录', 'success');
  });
  
  function showLoggedIn(email) {
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