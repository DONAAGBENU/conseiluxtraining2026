const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname);
const replacements = [
  ['hover:text-primary', 'hover:text-orange-600'],
  ['hover:border-primary', 'hover:border-orange-600'],
  ['focus:ring-primary', 'focus:ring-orange-600'],
  ['focus:border-primary', 'focus:border-orange-600'],
  ['hover:bg-primary', 'hover:bg-orange-600'],
  ['border-primary/20', 'border-orange-600/20'],
  ['border-primary', 'border-orange-600'],
  ['hover:bg-dark', 'hover:bg-slate-900'],
  ['hover:text-dark', 'hover:text-slate-900'],
  ['bg-primary', 'bg-orange-600'],
  ['text-primary', 'text-orange-600'],
  ['bg-dark', 'bg-slate-900'],
  ['text-navy', 'text-slate-900'],
];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      walk(fullPath);
      continue;
    }
    if (!fullPath.endsWith('.tsx') && !fullPath.endsWith('.ts') && !fullPath.endsWith('.css')) continue;
    let content = fs.readFileSync(fullPath, 'utf8');
    let updated = content;
    for (const [from, to] of replacements) {
      updated = updated.split(from).join(to);
    }
    if (updated !== content) {
      fs.writeFileSync(fullPath, updated, 'utf8');
      console.log('Updated', fullPath);
    }
  }
}

walk(root);
console.log('Done');
