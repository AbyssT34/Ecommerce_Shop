
import * as fs from 'fs';
import * as path from 'path';

function toSlug(str: string): string {
    return str
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

const manualImageMap: Record<string, string> = {
    'Gà rang sả ớt': 'ga-chien-xa-ot.jpg',
    'Canh mồng tơi nấu thịt': 'canh-mong-toi.jpg',
    'Canh rong biển thịt băm': 'canh-rong-bien.jpg',
    'Cá hấp sả': 'ca-hap-xa.jpg',
    'Trứng hấp': 'trung-hap.jpg',
    'Canh chua cá': 'canh-chua-ca.jpg',
    'Canh chua tôm': 'canh-chua-tom.jpg',
};

const recipesPath = path.join(__dirname, '../recipes.json');
const imagesDir = path.join(__dirname, '../apps/frontend/public/img/cong-thuc');

try {
    const recipesData = JSON.parse(fs.readFileSync(recipesPath, 'utf8'));
    const imageFiles = new Set(fs.readdirSync(imagesDir));

    console.log(`Checking ${recipesData.length} recipes against ${imageFiles.size} images...`);
    console.log('---------------------------------------------------');

    let missingCount = 0;

    recipesData.forEach((recipe: any) => {
        const slug = toSlug(recipe.name);
        let expectedImage = `${slug}.jpg`;

        // Check manual map
        if (manualImageMap[recipe.name]) {
            expectedImage = manualImageMap[recipe.name];
        }

        if (!imageFiles.has(expectedImage)) {
            console.log(`[MISSING] Recipe: "${recipe.name}"`);
            console.log(`          Slug:   "${slug}"`);
            console.log(`          Expect: "${expectedImage}"`);
            missingCount++;
        }
    });

    console.log('---------------------------------------------------');
    if (missingCount === 0) {
        console.log('✅ All recipes have matching images!');
    } else {
        console.log(`❌ Found ${missingCount} recipes without images.`);
        console.log('Available images for reference:', Array.from(imageFiles).sort());
    }

} catch (err) {
    console.error('Error:', err);
}
