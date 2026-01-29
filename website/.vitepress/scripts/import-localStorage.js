// .vitepress/scripts/import-localStorage.js
// 创建文件选择器
function createFileInput() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.style.display = 'none';
  
  return input;
}

// 读取文件内容
function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const data = JSON.parse(content);
        resolve(data);
      } catch (error) {
        reject(new Error('文件解析失败，请确保文件是有效的JSON格式'));
      }
    };
    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
    reader.readAsText(file);
  });
}

// 导入数据到localStorage
function importToLocalStorage(data) {
  const importedKeys = [];
  const failedKeys = [];
  
  // 清空现有的localStorage数据
  const clearExisting = confirm('是否清空现有的localStorage数据？\n\n点击"确定"清空现有数据，点击"取消"保留现有数据并只添加新数据。');
  
  if (clearExisting) {
    localStorage.clear();
    console.log('已清空现有localStorage数据');
  }
  
  // 导入数据
  for (const [key, value] of Object.entries(data)) {
    try {
      localStorage.setItem(key, value);
      importedKeys.push(key);
    } catch (error) {
      failedKeys.push(key);
      console.error(`导入键 "${key}" 失败:`, error);
    }
  }
  
  return { importedKeys, failedKeys };
}

// 显示导入结果
function showImportResult(result) {
  const { importedKeys, failedKeys } = result;
  
  console.log('====================================');
  console.log('LocalStorage 导入结果');
  console.log('====================================');
  console.log(`成功导入: ${importedKeys.length} 个键`);
  console.log(`失败: ${failedKeys.length} 个键`);
  
  if (importedKeys.length > 0) {
    console.log('成功导入的键:');
    importedKeys.forEach(key => console.log(`- ${key}`));
  }
  
  if (failedKeys.length > 0) {
    console.log('失败的键:');
    failedKeys.forEach(key => console.log(`- ${key}`));
  }
  
  console.log('====================================');
  console.log('导入完成！');
  console.log('====================================');
  
  // 显示成功提示
  alert(`导入完成！\n\n成功导入: ${importedKeys.length} 个键\n失败: ${failedKeys.length} 个键\n\n详细信息请查看控制台。`);
}

// 执行导入
async function importLocalStorageData() {
  try {
    console.log('====================================');
    console.log('LocalStorage 导入工具');
    console.log('====================================');
    console.log('请选择要导入的localStorage备份文件（.json格式）');
    
    // 创建文件输入
    const fileInput = createFileInput();
    document.body.appendChild(fileInput);
    
    // 等待用户选择文件
    const file = await new Promise((resolve) => {
      fileInput.onchange = (e) => {
        const selectedFile = e.target.files[0];
        resolve(selectedFile);
      };
      fileInput.click();
    });
    
    if (!file) {
      console.log('未选择文件，导入取消');
      return;
    }
    
    console.log(`正在读取文件: ${file.name}`);
    
    // 读取文件内容
    const data = await readFile(file);
    console.log('文件读取成功，正在导入数据...');
    
    // 导入数据
    const result = importToLocalStorage(data);
    
    // 显示结果
    showImportResult(result);
    
    // 清理
    document.body.removeChild(fileInput);
    
    return result;
  } catch (error) {
    console.error('导入失败:', error);
    alert(`导入失败: ${error.message}`);
  }
}

// 执行导入
try {
  importLocalStorageData();
} catch (error) {
  console.error('导入过程发生错误:', error);
  alert(`导入过程发生错误: ${error.message}`);
}

console.log('LocalStorage 导入工具已启动，请选择要导入的备份文件');
