
const fs = require('fs');
const path = require('path');

function toSlug(str) {
    return str
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

const manualImageMap = {
    'Gà rang sả ớt': 'ga-chien-xa-ot.jpg',
    'Canh mồng tơi nấu thịt': 'canh-mong-toi.jpg',
    'Canh rong biển thịt băm': 'canh-rong-bien.jpg',
    'Cá hấp sả': 'ca-hap-xa.jpg',
    'Trứng hấp': 'trung-hap.jpg',
    'Canh chua cá': 'canh-chua-ca.jpg',
    'Canh chua tôm': 'canh-chua-tom.jpg',
    // New fixes
    'Đậu hũ sốt cà chua': 'dau-hu-xot-ca-chua.jpg',
    'Mực xào cần tỏi': 'muc-xao-can-tay.jpg',
    'Bò xào cần tỏi': 'bo-xao-can-tay.jpg',
    'Canh bí đỏ nấu thịt': 'canh-bi-do.jpg',
    'Đậu hũ chiên sả ớt': 'dau-hu-chien-xa-ot.jpg',
    'Canh trứng rong biển': 'canh-rong-bien-trung.jpg',
    'Tôm hấp sả': 'tom-hap-xa.jpg'
};

const recipesPath = path.join(__dirname, '../recipes.json');
const imagesDir = path.join(__dirname, '../apps/frontend/public/img/cong-thuc');

try {
    const recipesData = JSON.parse(fs.readFileSync(recipesPath, 'utf8'));
    const imageFiles = new Set(fs.readdirSync(imagesDir));
    const logStream = fs.createWriteStream('missing_images.txt');

    console.log(`Checking ${recipesData.length} recipes against ${imageFiles.size} images...`);

    let missingCount = 0;

    recipesData.forEach((recipe) => {
        const slug = toSlug(recipe.name);
        let expectedImage = `${slug}.jpg`;

        // Check manual map
        if (manualImageMap[recipe.name]) {
            expectedImage = manualImageMap[recipe.name];
        }

        if (!imageFiles.has(expectedImage)) {
            const msg = `[MISSING] "${recipe.name}" -> Expect: "${expectedImage}"\n`;
            logStream.write(msg);
            console.log(msg.trim());
            missingCount++;
        }
    });

    logStream.end();

    if (missingCount === 0) {
        console.log('✅ All recipes have matching images!');
    } else {
        console.log(`❌ Found ${missingCount} recipes without images.`);
    }

} catch (err) {
    console.error('Error:', err);
}
