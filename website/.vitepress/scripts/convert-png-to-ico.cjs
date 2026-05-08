const fs = require('fs');

async function pngToIco(inputPath, outputPath) {
  console.log(`正在转换 ${inputPath} -> ${outputPath}`);
  
  const pngBuffer = fs.readFileSync(inputPath);
  
  const pngHeader = pngBuffer.slice(0, 8);
  if (pngHeader.toString('hex') !== '89504e470d0a1a0a') {
    throw new Error('不是有效的PNG文件');
  }
  
  const ihdrData = pngBuffer.slice(16, 24);
  const width = ihdrData.readUInt32BE(0);
  const height = ihdrData.readUInt32BE(4);
  
  console.log(`PNG尺寸: ${width}x${height}`);
  
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  
  const dirEntry = Buffer.alloc(16);
  dirEntry.writeUInt8(width > 256 ? 0 : width, 0);
  dirEntry.writeUInt8(height > 256 ? 0 : height, 1);
  dirEntry.writeUInt8(0, 2);
  dirEntry.writeUInt8(0, 3);
  dirEntry.writeUInt16LE(1, 4);
  dirEntry.writeUInt16LE(32, 6);
  dirEntry.writeUInt32LE(pngBuffer.length, 8);
  dirEntry.writeUInt32LE(22, 12);
  
  const icoBuffer = Buffer.concat([header, dirEntry, pngBuffer]);
  
  fs.writeFileSync(outputPath, icoBuffer);
  
  const size = fs.statSync(outputPath).size;
  console.log(`✓ 转换完成！大小: ${(size / 1024).toFixed(2)}KB`);
}

if (process.argv.length < 4) {
  console.log('用法: node convert-png-to-ico.cjs <input.png> <output.ico>');
  console.log('示例: node convert-png-to-ico.cjs logo.png favicon.ico');
  process.exit(1);
}

const inputPath = process.argv[2];
const outputPath = process.argv[3];

pngToIco(inputPath, outputPath);

// node convert-png-to-ico.cjs input.png output.ico 2
