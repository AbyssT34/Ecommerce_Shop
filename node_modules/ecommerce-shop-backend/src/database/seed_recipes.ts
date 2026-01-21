import { DataSource } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Load env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'ecommerce_shop',
    entities: [path.join(__dirname, '../**/*.entity.{ts,js}')],
});

async function seedRecipes() {
    try {
        await dataSource.initialize();
        console.log('✅ Database connected');

        // 1. Load recipes JSON
        const recipesPath = path.join(__dirname, '../../../../recipes.json');
        if (!fs.existsSync(recipesPath)) {
            throw new Error(`Recipes file not found at ${recipesPath}`);
        }
        const recipesData = JSON.parse(fs.readFileSync(recipesPath, 'utf8'));
        console.log(`📖 Loaded ${recipesData.length} recipes from JSON`);

        // 2. Clear old recipe/ingredient data (Optional: user asked to clear old recipes)
        console.log('🧹 Clearing old recipes and ingredients links...');
        await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');
        await dataSource.query('TRUNCATE TABLE recipes');
        await dataSource.query('TRUNCATE TABLE product_ingredients');
        await dataSource.query('TRUNCATE TABLE ingredients');
        await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');

        // 3. Extract and Insert Ingredients
        console.log('🥕 Processing ingredients...');
        const uniqueIngredients = new Set<string>();

        // Collect all ingredient names
        recipesData.forEach((recipe: any) => {
            recipe.ingredients.forEach((ing: any) => {
                uniqueIngredients.add(ing.name.trim());
            });
        });

        const ingredientMap: Record<string, number> = {}; // Name -> ID

        for (const ingName of uniqueIngredients) {
            const result = await dataSource.query(
                'INSERT INTO ingredients (name, description, created_at) VALUES (?, ?, NOW())',
                [ingName, `Nguyên liệu: ${ingName}`]
            );
            ingredientMap[ingName] = result.insertId;
        }
        console.log(`  ✓ Created ${uniqueIngredients.size} unique ingredients`);

        // 4. Link Products to Ingredients (Fuzzy Matching)
        console.log('🔗 Linking products to ingredients...');
        const products = await dataSource.query('SELECT id, name FROM products');
        let linkCount = 0;

        for (const product of products) {
            const pName = product.name.toLowerCase();

            // Find matching ingredients
            for (const [ingName, ingId] of Object.entries(ingredientMap)) {
                const iName = ingName.toLowerCase();

                // Simple heuristic: If product name contains ingredient name or vice versa
                // e.g., Product "Thịt ba chỉ heo túi 500g" contains "Thịt ba chỉ" -> Match
                if (pName.includes(iName) || iName.includes(pName)) {
                    await dataSource.query(
                        'INSERT INTO product_ingredients (product_id, ingredient_id, is_primary) VALUES (?, ?, ?)',
                        [product.id, ingId, true]
                    );
                    linkCount++;
                    // console.log(`    Linked "${product.name}" -> "${ingName}"`);
                }
            }
        }
        console.log(`  ✓ Established ${linkCount} product-ingredient links`);

        // 5. Insert Recipes
        console.log('🍳 Inserting recipes...');
        for (const recipe of recipesData) {
            // Map JSON ingredients to schema structure with IDs
            const mappedIngredients = recipe.ingredients.map((ing: any) => ({
                ingredient_id: ingredientMap[ing.name.trim()] || null,
                ingredient_name: ing.name,
                quantity: ing.qty,
                note: ing.note
            }));

            await dataSource.query(
                `INSERT INTO recipes (name, description, ingredients, steps, cook_time, servings, image_url, active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
                [
                    recipe.name,
                    `Món ngon: ${recipe.name}`, // Simple description
                    JSON.stringify(mappedIngredients),
                    JSON.stringify(recipe.steps),
                    recipe.cooking_time_min,
                    4, // Default servings
                    // Generate image URL with manual override support
                    (() => {
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
                            // New fixes
                            'Đậu hũ sốt cà chua': 'dau-hu-xot-ca-chua.jpg',
                            'Mực xào cần tỏi': 'muc-xao-can-tay.jpg',
                            'Bò xào cần tỏi': 'bo-xao-can-tay.jpg',
                            'Canh bí đỏ nấu thịt': 'canh-bi-do.jpg',
                            'Đậu hũ chiên sả ớt': 'dau-hu-chien-xa-ot.jpg',
                            'Canh trứng rong biển': 'canh-rong-bien-trung.jpg',
                            'Tôm hấp sả': 'tom-hap-xa.jpg'
                        };

                        const slug = toSlug(recipe.name);
                        const manualImage = manualImageMap[recipe.name];

                        return `/img/cong-thuc/${manualImage || slug + '.jpg'}`;
                    })(),
                    true
                ]
            );
        }
        console.log(`  ✓ Inserted ${recipesData.length} recipes`);

        console.log('\n✅ Recipe seeding completed!');
        await dataSource.destroy();

    } catch (error) {
        console.error('❌ Error seeding recipes:', error);
        process.exit(1);
    }
}

seedRecipes();
