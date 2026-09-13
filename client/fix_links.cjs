const fs = require('fs');
const path = require('path');

const homeFile = path.join(__dirname, 'src/pages/Home.tsx');
let content = fs.readFileSync(homeFile, 'utf-8');

// Replace Main Hero
content = content.replace(
    /<div className="md:col-span-2 md:row-span-2 relative overflow-hidden group cursor-pointer">([\s\S]*?<span[^>]*>Main\s+Residence<\/span>\s*)<\/div>/,
    '<Link to="/photo-tour" className="block md:col-span-2 md:row-span-2 relative overflow-hidden group cursor-pointer">$1</Link>'
);

// Replace Thumbnail 1
content = content.replace(
    /<div className="hidden md:block relative overflow-hidden group cursor-pointer">([\s\S]*?Thumbnail 2:)/,
    '<Link to="/photo-tour" className="hidden md:block relative overflow-hidden group cursor-pointer block">$1</Link>'
);
// Note the above regex matched up to Thumbnail 2:, which means it matched the closing </div> of Thumbnail 1.
// Let's use a better regex: replace the div wrapper based on the img tag.
// Actually, it's easier to just match:
content = content.replace(
    /<div className="hidden md:block relative overflow-hidden group cursor-pointer">([\s\S]*?<\/div>)\s*\{\/\*\s*Thumbnail 2:/,
    '<Link to="/photo-tour" className="hidden md:block relative overflow-hidden group cursor-pointer block">$1</Link>\n                        {/*  Thumbnail 2:'
);

content = content.replace(
    /<div className="hidden md:block relative overflow-hidden group cursor-pointer">([\s\S]*?<\/div>)\s*\{\/\*\s*Thumbnail 3:/,
    '<Link to="/photo-tour" className="hidden md:block relative overflow-hidden group cursor-pointer block">$1</Link>\n                        {/*  Thumbnail 3:'
);

content = content.replace(
    /<div className="hidden md:block relative overflow-hidden group cursor-pointer">([\s\S]*?<\/div>)\s*\{\/\*\s*Thumbnail 4:/,
    '<Link to="/photo-tour" className="hidden md:block relative overflow-hidden group cursor-pointer block">$1</Link>\n                        {/*  Thumbnail 4:'
);

content = content.replace(
    /<div className="hidden md:block relative overflow-hidden group cursor-pointer">([\s\S]*?<\/div>)\s*<\/div>/,
    '<Link to="/photo-tour" className="hidden md:block relative overflow-hidden group cursor-pointer block">$1</Link>\n                    </div>'
);

// Cleanup: I might have captured the </div> inside the group, replacing it incorrectly.
// Let's re-read the file and use a precise approach.
