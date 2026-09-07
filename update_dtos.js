const fs = require('fs');
const path = require('path');

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.dto.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      const targetFields = ['minStock', 'reorderLevel', 'currentStock', 'quantity', 'returnQty'];

      for (const field of targetFields) {
        // Find the index of the field
        // Then walk backwards to replace the first @IsInt() we find with @IsNumber()
        // if it's within a reasonable distance (say 150 chars).
        
        let fieldIdx = content.indexOf(field + '?: number') !== -1 
                     ? content.indexOf(field + '?: number') 
                     : content.indexOf(field + ': number');
                     
        if (fieldIdx !== -1) {
           let substring = content.substring(Math.max(0, fieldIdx - 150), fieldIdx);
           if (substring.includes('@IsInt()')) {
             substring = substring.replace('@IsInt()', '@IsNumber()');
             content = content.substring(0, Math.max(0, fieldIdx - 150)) + substring + content.substring(fieldIdx);
           }
        }
      }

      if (content !== originalContent) {
        if (!content.includes('IsNumber')) {
          content = content.replace(/import\s+{([^}]+)}\s+from\s+'class-validator'/, (match, p1) => {
            return `import { IsNumber, ${p1} } from 'class-validator'`;
          });
        }
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated DTO: ' + fullPath);
      }
    }
  }
}

console.log('Processing NJ Fresh DTOs...');
processDir('d:\\NJ fresh_Pos\\backend\\src');
console.log('Processing NASA Fresh DTOs...');
processDir('d:\\Pos-Nasa Fresh Mart\\backend\\src');
