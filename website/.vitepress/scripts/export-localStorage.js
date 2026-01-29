// .vitepress/scripts/export-localStorage.js
// 获取localStorage的所有内容
const localStorageData = {};
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  localStorageData[key] = localStorage.getItem(key);
}

// 将数据转换为JSON字符串
const localStorageJson = JSON.stringify(localStorageData, null, 2);

// 打印localStorage内容
console.log('LocalStorage内容:');
console.log(localStorageJson);

// 保存到本地文件
function saveToFile(data, filename) {
  // 创建Blob对象
  const blob = new Blob([data], { type: 'application/json' });
  
  // 创建下载链接
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  
  // 触发下载
  document.body.appendChild(a);
  a.click();
  
  // 清理
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

// 保存localStorage数据到本地文件
saveToFile(localStorageJson, 'localStorage_backup.json');
console.log('LocalStorage数据已保存到本地文件 localStorage_backup.json');

// 返回数据
localStorageData
