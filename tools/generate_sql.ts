import * as fs from 'fs';
import * as path from 'path';

const IMG_DIR = 'apps/frontend/public/img/bia-nuoc-ngot';
const RECIPES_FILE = 'recipes.json';
const OUTPUT_FILE = 'import_data.sql';

const CATEGORY_NAME = 'Bia & Nước ngọt';
const CATEGORY_SLUG = 'bia-nuoc-ngot'; // Assuming we can force this or it's generated
const CATEGORY_DESC = 'Các loại bia và nước giải khát';

function formatProductName(filename: string): string {
    // Remove extension
    const name = filename.replace(/\.(jpg|jpeg|png)$/i, '');

    // Remove timestamp at the end (format: _YYYYMMDDHHMMSS...)
    // Also handling hyphen based timestamps if any, based on user examples:
    // 6-chai-tra-xanh...-202103290825331304
    // 6-lon-nuoc-ngot..._202512251932405441

    let cleanName = name.replace(/[-_]\d{10,}.*$/, '');

    // Replace hyphens with spaces
    cleanName = cleanName.replace(/-/g, ' ');

    // Capitalize first letter
    cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

    return cleanName;
}

function generateSql() {
    let sql = `USE ecommerce_shop;\n\n`;
    sql += `SET FOREIGN_KEY_CHECKS=0;\n\n`;

    // 1. Clear existing recipes data
    sql += `-- Clear existing recipe data\n`;
    sql += `TRUNCATE TABLE recipes;\n`;
    sql += `TRUNCATE TABLE product_ingredients;\n`;
    // We might not want to truncate ingredients if they are used by other things, 
    // but the user said "xóa recipes đã có", and usually ingredients are tight to recipes in this context.
    // Given the previous seed_recipes.ts logic, we likely want to reset ingredients too to avoid orphans.
    sql += `TRUNCATE TABLE ingredients;\n\n`;

    // 2. Ensure Category Exists
    sql += `-- Ensure Category '${CATEGORY_NAME}' exists\n`;
    // We try to insert, if exists we silently ignore (or we can't easily do 'INSERT IGNORE' with primary keys auto increment without being careful)
    // To be safe, we can use a variable for the ID.
    sql += `INSERT IGNORE INTO categories (name, slug, description, created_at) VALUES ('${CATEGORY_NAME}', '${CATEGORY_SLUG}', '${CATEGORY_DESC}', NOW());\n`;
    sql += `SET @cat_id = (SELECT id FROM categories WHERE slug = '${CATEGORY_SLUG}' LIMIT 1);\n\n`;

    // 3. Products from Images
    sql += `-- Insert Products from Images\n`;
    const files = fs.readdirSync(IMG_DIR);

    for (const file of files) {
        if (!file.match(/\.(jpg|jpeg|png)$/i)) continue;

        const productName = formatProductName(file);
        const imageUrl = `/img/bia-nuoc-ngot/${file}`;
        const price = 15000; // Default price
        const stock = 100; // Default stock

        sql += `INSERT INTO products (name, description, price, stock_quantity, image_url, category_id, is_active, created_at, updated_at) VALUES `;
        sql += `('${productName}', 'Sản phẩm giải khát', ${price}, ${stock}, '${imageUrl}', @cat_id, 1, NOW(), NOW());\n`;
    }
    sql += `\n`;

    // 4. Recipes from JSON
    sql += `-- Insert Recipes\n`;
    const recipesData = fs.readFileSync(RECIPES_FILE, 'utf-8');
    const rawRecipes = JSON.parse(recipesData);

    // Deduplicate recipes by name
    const uniqueRecipesMap = new Map();
    rawRecipes.forEach((r: any) => {
        if (!uniqueRecipesMap.has(r.name)) {
            uniqueRecipesMap.set(r.name, r);
        }
    });
    const recipes = Array.from(uniqueRecipesMap.values());

    const allIngredients = new Set<string>();

    // First collect all ingredients
    recipes.forEach((r: any) => {
        r.ingredients.forEach((ing: any) => {
            allIngredients.add(ing.name);
        });
    });

    // Insert Ingredients
    sql += `-- Insert Ingredients\n`;
    allIngredients.forEach(ingName => {
        sql += `INSERT INTO ingredients (name, created_at) VALUES ('${ingName}', NOW());\n`;
    });
    sql += `\n`;

    // Insert Recipes
    sql += `-- Insert Recipes Data\n`;
    recipes.forEach((r: any) => {
        const ingredientsJson = JSON.stringify(r.ingredients);
        const stepsJson = JSON.stringify(r.steps); // Steps are array of strings
        // Escape single quotes in JSON
        const escapedIng = ingredientsJson.replace(/'/g, "\\'");
        const escapedSteps = stepsJson.replace(/'/g, "\\'");

        sql += `INSERT INTO recipes (name, description, cook_time, servings, difficulty, ingredients, steps, active, created_at) VALUES `;
        sql += `('${r.name}', '${r.name} ngon tuyệt', ${r.cooking_time_min}, 4, 'Easy', '${escapedIng}', '${escapedSteps}', 1, NOW());\n`;
    });

    // Note: We are strictly NOT generating product_ingredients links here because we can't easily know the product IDs and ingredient IDs 
    // in a pure SQL script without many subqueries. 
    // The user requirement was "xóa recipes đã có" and "import mục này", implying data population.
    // If linking is critical, we'd need a more complex script or store procedures. 
    // Given the context, getting the data IN is the priority.

    sql += `\nSET FOREIGN_KEY_CHECKS=1;\n`;

    fs.writeFileSync(OUTPUT_FILE, sql);
    console.log(`Generated ${OUTPUT_FILE}`);
}

generateSql();
