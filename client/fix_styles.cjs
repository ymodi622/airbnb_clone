const fs = require('fs');
const path = require('path');

const files = ['Home.tsx', 'PhotoTour.tsx', 'LightboxViewer.tsx', '../components/Header.tsx', '../components/Footer.tsx'];

for (const file of files) {
    const fullPath = path.join(__dirname, 'src/pages', file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf-8');
        content = content.replace(/style="font-variation-settings:\s*'FILL'\s*1;?"/g, `style={{ fontVariationSettings: "'FILL' 1" }}`);
        content = content.replace(/style="width:\s*100%;?"/g, `style={{ width: "100%" }}`);
        content = content.replace(/style="width:\s*98%;?"/g, `style={{ width: "98%" }}`);
        content = content.replace(/style="width:\s*99%;?"/g, `style={{ width: "99%" }}`);
        content = content.replace(/style="width:\s*97%;?"/g, `style={{ width: "97%" }}`);
        // any remaining style="..."
        content = content.replace(/style="([^"]*)"/g, (match, p1) => {
            console.log("Unreplaced style in " + file + ": " + match);
            return match;
        });
        fs.writeFileSync(fullPath, content);
    }
}
