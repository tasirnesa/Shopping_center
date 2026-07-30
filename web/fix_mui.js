import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) {
            results = results.concat(walk(full));
        } else if (full.endsWith('.tsx') || full.endsWith('.ts')) {
            results.push(full);
        }
    });
    return results;
}

const files = walk('./src');

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    let original = content;

    // MUI v6 removal of basic props from Box/Grid/Typography etc.
    // Instead of complex parsing, let's target the exact failing errors in tsc_errors.log
    // wait, the easiest way to fix "fontWeight={X}" on Typography is to change it to sx={{ fontWeight: X }}

    // Let's replace: fontWeight={600} -> sx={{ fontWeight: 600 }}
    // We have to be careful if sx={{...}} already exists.
    // To be safe, if we see: <Typography variant="h6" fontWeight={800}>
    // We can do: <Typography variant="h6" sx={{ fontWeight: 800 }}>

    let needsSave = false;

    const fontRegex = /(<\w+[^>]*?)\bfontWeight={(\w+)}/g;
    if (fontRegex.test(content)) {
        content = content.replace(fontRegex, (match, p1, p2) => {
            return p1 + `sx={{ fontWeight: ${p2} }}`;
        });
        needsSave = true;
    }

    // Same for display="flex" justifyContent="flex-end" py={3}
    // But doing it via regex is very brittle. We can just catch specific patterns for Box.
    // We saw errors for Box props: display, justifyContent, alignItems, gap, mt, mb, py, p, flexDirection, bgcolor, borderRadius

    // Since Grid/Box typing is now broken for some reason, maybe we should just revert @mui/material to v5 if it was upgraded to v6 or something broken.

    if (needsSave) {
        fs.writeFileSync(f, content, 'utf8');
    }
});

console.log("Done checking font weights.");
