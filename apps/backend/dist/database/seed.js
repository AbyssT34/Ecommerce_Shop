"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, '../../.env') });
const dataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'ecommerce_shop',
});
async function seed() {
    try {
        await dataSource.initialize();
        console.log('✅ Database connected');
        const recipesPath = path.join(__dirname, '../../../../recipes.json');
        const recipesData = JSON.parse(fs.readFileSync(recipesPath, 'utf-8'));
        console.log(`📖 Found ${recipesData.length} recipes`);
        console.log('\n📦 Creating categories...');
        const categories = [
            { name: 'Thịt & Hải sản', slug: 'thit-hai-san', description: 'Các sản phẩm thịt tươi và hải sản' },
            { name: 'Rau củ quả', slug: 'rau-cu-qua', description: 'Rau củ quả tươi ngon' },
            { name: 'Gia vị', slug: 'gia-vi', description: 'Gia vị nấu ăn' },
            { name: 'Trứng & Sữa', slug: 'trung-sua', description: 'Trứng và các sản phẩm từ sữa' },
        ];
        for (const cat of categories) {
            await dataSource.query('INSERT IGNORE INTO categories (name, slug, description) VALUES (?, ?, ?)', [cat.name, cat.slug, cat.description]);
        }
        console.log('\n🌿 Collecting ingredients from recipes...');
        const ingredientsSet = new Set();
        recipesData.forEach((recipe) => {
            recipe.ingredients.forEach((ing) => {
                ingredientsSet.add(ing.name);
            });
        });
        const ingredients = Array.from(ingredientsSet);
        console.log(`Found ${ingredients.length} unique ingredients`);
        console.log('\n🌿 Creating ingredients...');
        for (const ingredientName of ingredients) {
            await dataSource.query('INSERT IGNORE INTO ingredients (name, description) VALUES (?, ?)', [ingredientName, `Nguyên liệu ${ingredientName}`]);
        }
        console.log('\n🛒 Creating products...');
        const categoryMap = {
            'Thịt ba chỉ': 1,
            'Cá': 1,
            'Gà': 1,
            'Thịt bò': 1,
            'Tôm': 1,
            'Cua': 1,
            'Nghêu': 1,
            'Mực': 1,
            'Trứng gà': 4,
            'Trứng vịt': 4,
            'Sữa tươi': 4,
            'Hành tím': 2,
            'Hành lá': 2,
            'Tỏi': 2,
            'Gừng': 2,
            'Sả': 2,
            'Rau muống': 2,
            'Rau cải': 2,
            'Cà chua': 2,
            'Ớt': 2,
            'Nước mắm': 3,
            'Đường': 3,
            'Muối': 3,
            'Tiêu': 3,
            'Dầu ăn': 3,
            'Nước tương': 3,
        };
        for (const ingredientName of ingredients) {
            const [ingredient] = await dataSource.query('SELECT id FROM ingredients WHERE name = ?', [ingredientName]);
            if (!ingredient)
                continue;
            let categoryId = 3;
            for (const [key, value] of Object.entries(categoryMap)) {
                if (ingredientName.includes(key)) {
                    categoryId = value;
                    break;
                }
            }
            const price = Math.floor(Math.random() * 50000) + 10000;
            const stock = Math.floor(Math.random() * 100) + 10;
            const [existingProduct] = await dataSource.query('SELECT id FROM products WHERE name = ?', [ingredientName]);
            let productId;
            if (existingProduct) {
                productId = existingProduct.id;
            }
            else {
                const result = await dataSource.query(`INSERT INTO products (name, description, price, stock_quantity, category_id, is_active, unit)
           VALUES (?, ?, ?, ?, ?, ?, ?)`, [ingredientName, `Sản phẩm ${ingredientName} tươi ngon`, price, stock, categoryId, 1, 'kg']);
                productId = result.insertId;
            }
            await dataSource.query('INSERT IGNORE INTO product_ingredients (product_id, ingredient_id, is_primary, priority) VALUES (?, ?, ?, ?)', [productId, ingredient.id, true, 1]);
        }
        console.log('\n📝 Creating recipes...');
        for (const recipeData of recipesData) {
            const ingredients = recipeData.ingredients.map((ing) => ({
                ingredient_id: 0,
                ingredient_name: ing.name,
                quantity: ing.qty,
            }));
            for (const ing of ingredients) {
                const [result] = await dataSource.query('SELECT id FROM ingredients WHERE name = ?', [ing.ingredient_name]);
                if (result) {
                    ing.ingredient_id = result.id;
                }
            }
            const [existingRecipe] = await dataSource.query('SELECT id FROM recipes WHERE name = ?', [recipeData.name]);
            if (!existingRecipe) {
                await dataSource.query(`INSERT INTO recipes (name, description, ingredients, steps, prep_time, cook_time, servings, difficulty, active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                    recipeData.name,
                    `Công thức nấu ${recipeData.name} truyền thống`,
                    JSON.stringify(ingredients),
                    JSON.stringify(recipeData.steps),
                    10,
                    recipeData.cooking_time_min || 30,
                    4,
                    'Trung bình',
                    true
                ]);
            }
        }
        console.log('\n✅ Seed data completed successfully!');
        await dataSource.destroy();
    }
    catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}
seed();
//# sourceMappingURL=seed.js.map