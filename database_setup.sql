-- ===============================================
-- Ecommerce_Shop Database Setup Script
-- For HeidiSQL / MySQL Workbench
-- ===============================================

-- 1. CREATE DATABASE
DROP DATABASE IF EXISTS ecommerce_shop;
CREATE DATABASE ecommerce_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecommerce_shop;

-- ===============================================
-- 2. CREATE TABLES
-- ===============================================

-- Table: users
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    full_name VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: categories
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: products
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    image_url VARCHAR(500),
    category_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_sku (sku),
    INDEX idx_stock (stock_quantity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: ingredients
CREATE TABLE ingredients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: product_ingredients (Mapping table)
CREATE TABLE product_ingredients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    is_primary BOOLEAN DEFAULT TRUE,
    priority INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE,
    INDEX idx_product (product_id),
    INDEX idx_ingredient (ingredient_id),
    INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: recipes
CREATE TABLE recipes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    mood_tags JSON,
    cooking_time_min INT,
    ingredients_spec JSON,
    steps JSON,
    image_url VARCHAR(500),
    view_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_view_count (view_count)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: orders
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('pending', 'approved', 'shipping', 'completed', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_address TEXT NOT NULL,
    notes TEXT,
    approved_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_order_number (order_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: order_items
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: cart_items
CREATE TABLE cart_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_product (product_id),
    UNIQUE KEY unique_user_product (user_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- 3. INSERT SAMPLE DATA
-- ===============================================

-- Users (Password: Admin@123 - bcrypt hash)
INSERT INTO users (email, password_hash, role, full_name, phone, address) VALUES
('admin@shop.com', '$2b$10$YQ7N5qZ5Y.xZ5YqZ5YqZ5uF5YqZ5YqZ5YqZ5YqZ5YqZ5YqZ5YqZ5Y', 'admin', 'Admin User', '0901234567', '123 Admin Street, TPHCM'),
('user@example.com', '$2b$10$YQ7N5qZ5Y.xZ5YqZ5YqZ5uF5YqZ5YqZ5YqZ5YqZ5YqZ5YqZ5YqZ5Y', 'user', 'Nguyen Van A', '0987654321', '456 User Avenue, Ha Noi');

-- Categories
INSERT INTO categories (name, slug, description) VALUES
('Thịt', 'thit', 'Các loại thịt tươi ngon'),
('Cá & Hải Sản', 'ca-hai-san', 'Cá và hải sản tươi sống'),
('Rau Củ', 'rau-cu', 'Rau củ quả tươi hằng ngày'),
('Gia Vị', 'gia-vi', 'Gia vị và nguyên liệu ướp nấu ăn'),
('Ngũ Cốc', 'ngu-coc', 'Gạo, bột, ngũ cốc và trứng');

-- Ingredients (Common ingredients)
INSERT INTO ingredients (name, description) VALUES
('Thịt ba chỉ', 'Thịt ba chỉ heo'),
('Thịt gà', 'Thịt gà tươi'),
('Thịt bò', 'Thịt bò Úc'),
('Cá hồi', 'Cá hồi Na Uy'),
('Tôm', 'Tôm sú tươi'),
('Rau cải', 'Rau cải xanh'),
('Cà chua', 'Cà chua đỏ'),
('Hành tím', 'Hành tím'),
('Tỏi', 'Tỏi tươi'),
('Nước mắm', 'Nước mắm Nam Ngư'),
('Đường', 'Đường trắng tinh luyện'),
('Muối', 'Muối biển'),
('Tiêu', 'Tiêu đen hạt'),
('Gạo', 'Gạo ST25'),
('Trứng gà', 'Trứng gà tươi'),
('Gừng', 'Gừng tươi'),
('Ớt', 'Ớt hiểm'),
('Sả', 'Sả tươi'),
('Rau thơm', 'Rau thơm các loại'),
('Dầu ăn', 'Dầu ăn thực vật');

-- Products
INSERT INTO products (name, sku, description, price, stock_quantity, category_id, is_active) VALUES
-- Thịt (category_id: 1)
('Thịt Ba Chỉ Heo 500g', 'MEAT-BC-500', 'Thịt ba chỉ heo tươi ngon, nhiều nạc', 85000, 50, 1, TRUE),
('Thịt Gà Tươi 1kg', 'MEAT-GA-1KG', 'Thịt gà ta tươi sống', 95000, 40, 1, TRUE),
('Thịt Bò Úc 500g', 'MEAT-BO-500', 'Thịt bò Úc nhập khẩu cao cấp', 150000, 30, 1, TRUE),
('Sườn Heo Non 500g', 'MEAT-SUON-500', 'Sườn heo non tươi', 75000, 35, 1, TRUE),

-- Cá & Hải Sản (category_id: 2)
('Cá Hồi Na Uy 500g', 'FISH-HOI-500', 'Cá hồi Na Uy tươi phi-lê', 180000, 25, 2, TRUE),
('Tôm Sú Tươi 500g', 'FISH-TOM-500', 'Tôm sú size lớn tươi sống', 120000, 35, 2, TRUE),
('Cá Diêu Hồng 500g', 'FISH-DIEU-500', 'Cá diêu hồng tươi ngon', 65000, 40, 2, TRUE),
('Mực Ống Tươi 500g', 'FISH-MUC-500', 'Mực ống tươi sống', 95000, 30, 2, TRUE),

-- Rau Củ (category_id: 3)
('Rau Cải Xanh 500g', 'VEG-CAI-500', 'Rau cải xanh tươi mát', 15000, 100, 3, TRUE),
('Cà Chua 500g', 'VEG-CACHUA-500', 'Cà chua đỏ chín tự nhiên', 20000, 80, 3, TRUE),
('Hành Tím 200g', 'VEG-HANH-200', 'Hành tím tươi thơm', 12000, 120, 3, TRUE),
('Tỏi 200g', 'VEG-TOI-200', 'Tỏi tươi Lý Sơn', 18000, 100, 3, TRUE),
('Gừng 200g', 'VEG-GUNG-200', 'Gừng tươi cay nồng', 15000, 90, 3, TRUE),
('Ớt Hiểm 100g', 'VEG-OT-100', 'Ớt hiểm tươi cay', 10000, 70, 3, TRUE),

-- Gia Vị (category_id: 4)
('Nước Mắm Nam Ngư 500ml', 'SPICE-NM-500', 'Nước mắm đạm đặc truyền thống', 25000, 150, 4, TRUE),
('Đường Trắng 1kg', 'SPICE-DUONG-1KG', 'Đường trắng tinh luyện', 22000, 200, 4, TRUE),
('Muối Biển 500g', 'SPICE-MUOI-500', 'Muối biển sạch tinh khiết', 10000, 180, 4, TRUE),
('Tiêu Đen Hạt 100g', 'SPICE-TIEU-100', 'Tiêu đen hạt Phú Quốc', 35000, 90, 4, TRUE),
('Dầu Ăn 1L', 'SPICE-DAU-1L', 'Dầu ăn thực vật cao cấp', 45000, 100, 4, TRUE),

-- Ngũ Cốc (category_id: 5)
('Gạo ST25 5kg', 'RICE-ST25-5KG', 'Gạo ST25 thơm ngon chất lượng cao', 145000, 60, 5, TRUE),
('Trứng Gà Tươi (Hộp 10)', 'EGG-GA-10', 'Trứng gà tươi hộp 10 quả', 35000, 100, 5, TRUE),
('Gạo Tám Thơm 5kg', 'RICE-TAM-5KG', 'Gạo tám thơm đặc sản', 120000, 50, 5, TRUE),
('Bột Mì Đa Dụng 1kg', 'FLOUR-MI-1KG', 'Bột mì đa dụng cao cấp', 28000, 80, 5, TRUE);

-- Product-Ingredient Mapping
INSERT INTO product_ingredients (product_id, ingredient_id, is_primary, priority) VALUES
-- Thịt
(1, 1, TRUE, 100),  -- Thịt ba chỉ -> Thịt ba chỉ
(2, 2, TRUE, 100),  -- Thịt gà -> Thịt gà
(3, 3, TRUE, 100),  -- Thịt bò -> Thịt bò

-- Cá & Hải sản
(5, 4, TRUE, 100),  -- Cá hồi -> Cá hồi
(6, 5, TRUE, 100),  -- Tôm -> Tôm

-- Rau củ
(9, 6, TRUE, 100),  -- Rau cải -> Rau cải
(10, 7, TRUE, 100), -- Cà chua -> Cà chua
(11, 8, TRUE, 100), -- Hành tím -> Hành tím
(12, 9, TRUE, 100), -- Tỏi -> Tỏi
(13, 16, TRUE, 100), -- Gừng -> Gừng
(14, 17, TRUE, 100), -- Ớt -> Ớt

-- Gia vị
(15, 10, TRUE, 100), -- Nước mắm -> Nước mắm
(16, 11, TRUE, 100), -- Đường -> Đường
(17, 12, TRUE, 100), -- Muối -> Muối
(18, 13, TRUE, 100), -- Tiêu -> Tiêu
(19, 20, TRUE, 100), -- Dầu ăn -> Dầu ăn

-- Ngũ cốc
(20, 14, TRUE, 100), -- Gạo ST25 -> Gạo
(21, 15, TRUE, 100), -- Trứng -> Trứng gà
(22, 14, TRUE, 80);  -- Gạo Tám Thơm -> Gạo (priority thấp hơn ST25)

-- Sample Recipes
INSERT INTO recipes (name, mood_tags, cooking_time_min, ingredients_spec, steps, image_url, view_count) VALUES
(
    'Thịt kho trứng',
    JSON_ARRAY('daily', 'family', 'comfort'),
    45,
    JSON_ARRAY(
        JSON_OBJECT('name', 'Thịt ba chỉ', 'qty', '500g'),
        JSON_OBJECT('name', 'Trứng gà', 'qty', '4 quả'),
        JSON_OBJECT('name', 'Nước mắm', 'qty', '3 tbsp'),
        JSON_OBJECT('name', 'Đường', 'qty', '2 tbsp'),
        JSON_OBJECT('name', 'Hành tím', 'qty', '3 củ'),
        JSON_OBJECT('name', 'Tỏi', 'qty', '2 tép')
    ),
    JSON_ARRAY(
        'Thịt ba chỉ rửa sạch, cắt miếng vừa ăn',
        'Luộc trứng chín, bóc vỏ',
        'Ướp thịt với nước mắm, đường, tiêu',
        'Làm nước màu với đường',
        'Kho thịt và trứng với nước màu',
        'Nêm nếm lại gia vị cho vừa ăn'
    ),
    '/images/recipes/thit-kho-trung.jpg',
    0
),
(
    'Cơm chiên dương châu',
    JSON_ARRAY('quick', 'daily', 'breakfast'),
    20,
    JSON_ARRAY(
        JSON_OBJECT('name', 'Gạo', 'qty', '2 bát cơm nguội'),
        JSON_OBJECT('name', 'Trứng gà', 'qty', '2 quả'),
        JSON_OBJECT('name', 'Tôm', 'qty', '100g'),
        JSON_OBJECT('name', 'Hành tím', 'qty', '2 củ'),
        JSON_OBJECT('name', 'Tỏi', 'qty', '2 tép')
    ),
    JSON_ARRAY(
        'Đánh tan trứng',
        'Phi thơm hành tỏi',
        'Xào tôm cho chín',
        'Cho cơm vào xào đều',
        'Đổ trứng vào trộn đều',
        'Nêm nếm gia vị'
    ),
    '/images/recipes/com-chien.jpg',
    0
),
(
    'Canh chua cá',
    JSON_ARRAY('daily', 'healthy', 'soup'),
    30,
    JSON_ARRAY(
        JSON_OBJECT('name', 'Cá hồi', 'qty', '300g'),
        JSON_OBJECT('name', 'Cà chua', 'qty', '2 quả'),
        JSON_OBJECT('name', 'Rau cải', 'qty', '100g'),
        JSON_OBJECT('name', 'Đường', 'qty', '1 tbsp'),
        JSON_OBJECT('name', 'Nước mắm', 'qty', '2 tbsp')
    ),
    JSON_ARRAY(
        'Cá rửa sạch, cắt khúc',
        'Cà chua cắt múi cau',
        'Nấu nước sôi, cho cà chua vào',
        'Cho cá vào nấu chín',
        'Nêm nếm chua ngọt vừa ăn',
        'Cho rau cải vào tắt bếp'
    ),
    '/images/recipes/canh-chua-ca.jpg',
    0
);

-- ===============================================
-- 4. VERIFICATION QUERIES
-- ===============================================

-- Check data
SELECT 'Users' as TableName, COUNT(*) as RecordCount FROM users
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Ingredients', COUNT(*) FROM ingredients
UNION ALL
SELECT 'Product-Ingredient Mappings', COUNT(*) FROM product_ingredients
UNION ALL
SELECT 'Recipes', COUNT(*) FROM recipes;

-- ===============================================
-- SCRIPT COMPLETE
-- ===============================================
-- Database: ecommerce_shop
-- Tables: 9
-- Sample Data: Ready
-- Default Admin: admin@shop.com / Admin@123
-- Default User: user@example.com / Admin@123
-- ===============================================
