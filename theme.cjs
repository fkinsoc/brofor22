const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
      filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = walkSync('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/bg-\[#0A0A0A\]/g, 'bg-background-primary dark:bg-[#0A0A0A]');
  content = content.replace(/bg-\[#111111\]/g, 'bg-background-secondary dark:bg-[#111111]');
  content = content.replace(/bg-\[#111\]/g, 'bg-background-secondary dark:bg-[#111]');
  content = content.replace(/border-zinc-800/g, 'border-border-subtle dark:border-zinc-800');
  content = content.replace(/text-white/g, 'text-text-primary dark:text-white');
  content = content.replace(/text-zinc-500/g, 'text-text-secondary dark:text-zinc-500');
  content = content.replace(/text-zinc-400/g, 'text-zinc-500 dark:text-zinc-400');
  content = content.replace(/text-zinc-300/g, 'text-zinc-600 dark:text-zinc-300');
  fs.writeFileSync(file, content);
});
console.log('done');
