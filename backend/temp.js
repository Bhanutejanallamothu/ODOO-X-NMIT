const fs = require('fs');
const path = require('path');
const cDir = path.join(process.cwd(), 'src/controllers');
fs.readdirSync(cDir).forEach(f => {
  if (f.endsWith('.js')) {
    let cont = fs.readFileSync(path.join(cDir, f), 'utf8');
    cont = cont.replace(/\\$\d+/g, '?');
    cont = cont.replace(/RETURNING\s+.*?`/g, '`');
    fs.writeFileSync(path.join(cDir, f), cont);
  }
});