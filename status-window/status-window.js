class StatusWindow {
  constructor() {
    this.steps = ['step1', 'step2', 'step3', 'step4'];
    this.init();
  }
  
  init() {
    document.getElementById('closeBtn').addEventListener('click', () => {
      this.close();
    });
    
    // 监听来自content script的消息
    window.addEventListener('message', (event) => {
      if (event.data.type === 'STATUS_UPDATE') {
        this.updateStatus(event.data.step, event.data.status, event.data.message);
      }
      if (event.data.type === 'SHOW_INFO') {
        this.showInfo(event.data.info);
      }
    });
  }
  
  updateStatus(stepNumber, status, message) {
    const stepElement = document.getElementById(`step${stepNumber}`);
    const statusElement = document.getElementById(`status${stepNumber}`);
    
    // 清除之前的状态
    stepElement.classList.remove('processing', 'completed', 'error');
    
    // 添加新状态
    stepElement.classList.add(status);
    statusElement.textContent = message;
  }
  
  showInfo(info) {
    const infoPanel = document.getElementById('infoPanel');
    const infoContent = document.getElementById('infoContent');
    
    let content = '';
    Object.entries(info).forEach(([key, value]) => {
      content += `<div><strong>${key}:</strong> ${value}</div>`;
    });
    
    infoContent.innerHTML = content;
    infoPanel.style.display = 'block';
  }
  
  close() {
    window.close();
  }
}

new StatusWindow();