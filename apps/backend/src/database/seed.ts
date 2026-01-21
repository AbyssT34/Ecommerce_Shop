import { DataSource } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'ecommerce_shop',
});

// Product data with image mapping
const productsData = [
  /* DANH MỤC 1: GIA VỊ (Category ID: 1) */
  { name: "Hạt nêm Knorr thịt thăn xương ống 400g", sku: "GV-001", description: "Chiết xuất từ xương thịt tươi cho vị ngọt thanh.", price: 42000, stock_quantity: 100, image_url: "/img/gia-vi/hat-nem-knorr.jpg", category_id: 1, is_active: true },
  { name: "Nước mắm Nam Ngư chai 500ml", sku: "GV-002", description: "Nước mắm cá cơm thơm ngon đậm đà.", price: 45000, stock_quantity: 150, image_url: "/img/gia-vi/nuoc-nam-nam-ngu.jpg", category_id: 1, is_active: true },
  { name: "Bột ngọt Ajinomoto gói 454g", sku: "GV-003", description: "Gia vị tăng vị umami cho món ăn.", price: 34000, stock_quantity: 120, image_url: "/img/gia-vi/bot-ngot-ajnomoto.jpg", category_id: 1, is_active: true },
  { name: "Tương ớt Cholimex chai 270g", sku: "GV-004", description: "Vị cay nồng hấp dẫn cho các món chiên.", price: 12000, stock_quantity: 200, image_url: "/img/gia-vi/tuong-ot-cholimex.jpg", category_id: 1, is_active: true },
  { name: "Dầu ăn Simply đậu nành chai 1L", sku: "GV-005", description: "Giàu Omega 3-6-9 tốt cho tim mạch.", price: 58000, stock_quantity: 80, image_url: "/img/gia-vi/dau-an-simply.jpg", category_id: 1, is_active: true },
  { name: "Nước tương Maggi thanh dịu chai 300ml", sku: "GV-006", description: "Lên men tự nhiên, vị thanh dịu.", price: 18000, stock_quantity: 140, image_url: "/img/gia-vi/nuoc-tuong-maggi.jpg", category_id: 1, is_active: true },
  { name: "Dầu hào Maggi chai 350g", sku: "GV-007", description: "Giúp món xào sáng bóng, đậm đà.", price: 31000, stock_quantity: 90, image_url: "/img/gia-vi/dau-hao-maggi.jpg", category_id: 1, is_active: true },
  { name: "Muối sấy Ngọc Yến gói 100g", sku: "GV-008", description: "Muối sấy đặc sản, chấm trái cây cực ngon.", price: 15000, stock_quantity: 300, image_url: "/img/gia-vi/muoi-iot.jpg", category_id: 1, is_active: true },
  { name: "Đường mía Biên Hòa gói 1kg", sku: "GV-009", description: "Đường tinh luyện trắng sạch từ mía.", price: 28000, stock_quantity: 110, image_url: "/img/gia-vi/duong.jpg", category_id: 1, is_active: true },
  { name: "Sốt gia vị Barona sườn xào chua ngọt", sku: "GV-010", description: "Gia vị hoàn chỉnh chiết xuất rau củ quả tươi.", price: 12500, stock_quantity: 130, image_url: "/img/gia-vi/sot-barona.jpg", category_id: 1, is_active: true },

  /* DANH MỤC 2: HẢI SẢN (Category ID: 2) */
  { name: "Tôm thẻ tươi hộp 500g", sku: "HS-001", description: "Tôm thẻ thịt chắc, ngọt, size vừa.", price: 115000, stock_quantity: 30, image_url: "/img/hai-san/tom-the-cp.jpg", category_id: 2, is_active: true },
  { name: "Cá nục làm sạch túi 500g", sku: "HS-002", description: "Cá nục tươi đã làm sạch, tiện lợi nấu ngay.", price: 38000, stock_quantity: 40, image_url: "/img/hai-san/ca-nuc-lam-sach.jpg", category_id: 2, is_active: true },
  { name: "Mực ống tươi túi 300g", sku: "HS-003", description: "Mực ống giòn ngọt, thích hợp hấp gừng.", price: 98000, stock_quantity: 20, image_url: "/img/hai-san/muc-ong-nguyen-con-dong-lanh-ao-ao-goi-300g_202504251006476615.jpg", category_id: 2, is_active: true },
  { name: "Cá hồi phi lê Na Uy 200g", sku: "HS-004", description: "Cá hồi nhập khẩu, giàu Omega 3.", price: 175000, stock_quantity: 15, image_url: "/img/hai-san/ca-hoi-phi-le-sg-food-khay-200g-202403111604230127.jpg", category_id: 2, is_active: true },
  { name: "Cá điêu hồng làm sạch con 800g", sku: "HS-005", description: "Thịt cá trắng, ngọt, không tanh.", price: 55000, stock_quantity: 25, image_url: "/img/hai-san/ca-dieu-hong-lam-sach-nguyen-con_202505151838315969.jpg", category_id: 2, is_active: true },
  { name: "Nghêu lụa sạch túi 500g", sku: "HS-006", description: "Nghêu đã sạch cát, thịt béo ngậy.", price: 42000, stock_quantity: 50, image_url: "/img/hai-san/ngheu-lua-sach.jpg", category_id: 2, is_active: true },
  { name: "Cá thu cắt khúc túi 300g", sku: "HS-007", description: "Cá thu đại dương thịt chắc, bùi.", price: 85000, stock_quantity: 22, image_url: "/img/hai-san/ca-thu-cat-khuc.jpg", category_id: 2, is_active: true },
  { name: "Cua biển Cà Mau con 400g", sku: "HS-008", description: "Cua thịt chắc, đảm bảo tươi sống.", price: 190000, stock_quantity: 10, image_url: "/img/hai-san/cua-bien-ca-mau.jpg", category_id: 2, is_active: true },
  { name: "Sò huyết túi 500g", sku: "HS-009", description: "Sò huyết tươi, bổ máu, béo ngọt.", price: 95000, stock_quantity: 18, image_url: "/img/hai-san/so-huyet.jpg", category_id: 2, is_active: true },
  { name: "Cá cam làm sạch túi 500g", sku: "HS-010", description: "Cá cam thịt dày, thích hợp kho hoặc nướng.", price: 45000, stock_quantity: 30, image_url: "/img/hai-san/ca-cam.jpg", category_id: 2, is_active: true },

  /* DANH MỤC 3: NGŨ CỐC (Category ID: 3) */
  { name: "Gạo ST25 túi 5kg", sku: "NC-001", description: "Gạo ngon nhất thế giới, thơm lá dứa.", price: 190000, stock_quantity: 100, image_url: "/img/ngu-coc/gao-st25.jpg", category_id: 3, is_active: true },
  { name: "Yến mạch Quaker Oats thùng 4.5kg", sku: "NC-002", description: "Yến mạch cán vỡ nhập khẩu từ Mỹ.", price: 345000, stock_quantity: 20, image_url: "/img/ngu-coc/quaker-oats-old-fashioned-oatmeal.jpg", category_id: 3, is_active: true },
  { name: "Gạo lứt đỏ túi 2kg", sku: "NC-003", description: "Gạo lứt giàu chất xơ, tốt cho sức khỏe.", price: 65000, stock_quantity: 60, image_url: "/img/ngu-coc/gao-lut-do.jpg", category_id: 3, is_active: true },
  { name: "Ngũ cốc Nesvita túi 400g", sku: "NC-004", description: "Bổ sung canxi và chất xơ từ ngũ cốc nguyên cám.", price: 75000, stock_quantity: 80, image_url: "/img/ngu-coc/ngu-coc-nesvita.jpg", category_id: 3, is_active: true },
  { name: "Bột đậu nành nguyên chất túi 500g", sku: "NC-005", description: "Bột đậu nành thơm ngon, giàu đạm thực vật.", price: 48000, stock_quantity: 50, image_url: "/img/ngu-coc/bot-dau-nanh.jpg", category_id: 3, is_active: true },
  { name: "Gạo nếp cái hoa vàng túi 2kg", sku: "NC-006", description: "Nếp dẻo thơm, chuyên dùng nấu xôi, gói bánh.", price: 55000, stock_quantity: 40, image_url: "/img/ngu-coc/nep-cai-hoa-vang-vinh-hien-tui-1kg-202008150913276084.jpg", category_id: 3, is_active: true },
  { name: "Hạt chia hữu cơ gói 200g", sku: "NC-007", description: "Siêu thực phẩm giàu Omega 3 và chất xơ.", price: 120000, stock_quantity: 35, image_url: "/img/ngu-coc/hat-chia-sunrise-goi-300g-202102051608220656.jpg", category_id: 3, is_active: true },
  { name: "Đậu xanh nguyên hạt túi 500g", sku: "NC-008", description: "Đậu xanh sạch, hạt đều, không mốc.", price: 28000, stock_quantity: 90, image_url: "/img/ngu-coc/dau-xanh-hat-cao-cap-vietfresh-150g-202012092307422357.jpg", category_id: 3, is_active: true },
  { name: "Bột mì đa năng Meizan gói 1kg", sku: "NC-009", description: "Dùng làm bánh hoặc chế biến món ăn.", price: 24500, stock_quantity: 110, image_url: "/img/ngu-coc/bot-mi-meizan-500g.jpg", category_id: 3, is_active: true },
  { name: "Bắp nếp Đà Lạt túi 3 trái", sku: "NC-010", description: "Bắp nếp dẻo, ngọt, thu hoạch trong ngày.", price: 21000, stock_quantity: 100, image_url: "/img/ngu-coc/bap-nep-cap-202207161543295487.jpg", category_id: 3, is_active: true },

  /* DANH MỤC 4: RAU CỦ (Category ID: 4) */
  { name: "Cà chua VietGAP túi 500g", sku: "RC-001", description: "Cà chua tươi sạch, mọng nước.", price: 16000, stock_quantity: 70, image_url: "/img/rau-cu/ca-chua-202312251318033167.jpg", category_id: 4, is_active: true },
  { name: "Bông cải xanh túi 500g", sku: "RC-002", description: "Rau sạch Đà Lạt, giòn ngọt.", price: 32000, stock_quantity: 45, image_url: "/img/rau-cu/bong-cai-xanh.jpg", category_id: 4, is_active: true },
  { name: "Cà rốt túi 500g", sku: "RC-003", description: "Cà rốt củ đều, không bị dập.", price: 14000, stock_quantity: 85, image_url: "/img/rau-cu/ca-rot-trai-tu-150g-tro-len-clone_202507300953258733.jpg", category_id: 4, is_active: true },
  { name: "Khoai tây túi 1kg", sku: "RC-004", description: "Khoai tây bở, thích hợp làm khoai chiên.", price: 26000, stock_quantity: 65, image_url: "/img/rau-cu/khoai-tay-202312260932491620.jpg", category_id: 4, is_active: true },
  { name: "Bắp cải thảo túi 1kg", sku: "RC-005", description: "Cải thảo tươi, thích hợp nấu canh hoặc kim chi.", price: 19000, stock_quantity: 55, image_url: "/img/rau-cu/bap-cai-thao-202312271131129709.jpg", category_id: 4, is_active: true },
  { name: "Dưa leo giống Nhật túi 500g", sku: "RC-006", description: "Dưa leo ít hạt, giòn tan.", price: 15000, stock_quantity: 95, image_url: "/img/rau-cu/dua-leo-202312281026050444.jpg", category_id: 4, is_active: true },
  { name: "Hành tây túi 500g", sku: "RC-007", description: "Hành tây trắng, củ chắc.", price: 13000, stock_quantity: 100, image_url: "/img/rau-cu/hanh-tay-tui-1kg_202505211039247088.jpg", category_id: 4, is_active: true },
  { name: "Xà lách thủy canh 250g", sku: "RC-008", description: "Xà lách sạch, không thuốc trừ sâu.", price: 22000, stock_quantity: 30, image_url: "/img/rau-cu/xa-lach-thuy-tinh-thuy-canh-cay-tu-230g_202506090948310961.jpg", category_id: 4, is_active: true },
  { name: "Bí đỏ hồ lô kg", sku: "RC-009", description: "Bí dẻo, ngọt, giàu vitamin A.", price: 24000, stock_quantity: 40, image_url: "/img/rau-cu/bi-do-non-trai-250g-350g-202310170842420628.jpg", category_id: 4, is_active: true },
  { name: "Nấm kim châm gói 150g", sku: "RC-010", description: "Nấm tươi trắng, dai giòn.", price: 12000, stock_quantity: 120, image_url: "/img/rau-cu/nam-kim-cham-han-quoc-goi-150g-202205181701291485.jpg", category_id: 4, is_active: true },

  /* DANH MỤC 5: THỊT (Category ID: 5) */
  { name: "Thịt ba rọi heo túi 500g", sku: "TH-001", description: "Thịt sạch, tỷ lệ nạc mỡ cân đối.", price: 85000, stock_quantity: 40, image_url: "/img/thit/ba-roi-heo_202601080921555420.jpg", category_id: 5, is_active: true },
  { name: "Thịt bò phi lê nội túi 250g", sku: "TH-002", description: "Thịt bò mềm, không gân.", price: 95000, stock_quantity: 25, image_url: "/img/thit/bo-phi-le.jpg", category_id: 5, is_active: true },
  { name: "Đùi gà tỏi CP túi 500g", sku: "TH-003", description: "Gà sạch đạt chuẩn, thịt chắc.", price: 42000, stock_quantity: 55, image_url: "/img/thit/dui-toi-ga-1kg_202601081049421310.jpg", category_id: 5, is_active: true },
  { name: "Nạc dăm heo túi 500g", sku: "TH-004", description: "Nạc dăm mềm, có ít vân mỡ.", price: 72000, stock_quantity: 45, image_url: "/img/thit/thit-nac-heo-300g_202601080947467806.jpg", category_id: 5, is_active: true },
  { name: "Sườn non heo túi 500g", sku: "TH-005", description: "Sườn non tươi ngon, thích hợp nướng hoặc ram.", price: 110000, stock_quantity: 20, image_url: "/img/thit/suon-non-heo-1kg_202601080959514244.jpg", category_id: 5, is_active: true },
  { name: "Cánh gà tươi túi 1kg", sku: "TH-006", description: "Cánh gà chiên nước mắm siêu ngon.", price: 68000, stock_quantity: 30, image_url: "/img/thit/canh-ga-500g_202601081052487956.jpg", category_id: 5, is_active: true },
  { name: "Thịt heo xay túi 500g", sku: "TH-007", description: "Thịt tươi xay mới mỗi ngày.", price: 65000, stock_quantity: 60, image_url: "/img/thit/thit-heo-xay-cp-100g_202601080924314325.jpg", category_id: 5, is_active: true },
  { name: "Chân giò heo kg", sku: "TH-008", description: "Giò heo tươi, thích hợp nấu bún bò.", price: 92000, stock_quantity: 15, image_url: "/img/thit/chan-gio-heo-cp-500g-hang-dan-tem-vang-giam-gia_202601100016288920.jpg", category_id: 5, is_active: true },
  { name: "Thịt vai heo túi 500g", sku: "TH-009", description: "Thịt vai nạc, ít mỡ.", price: 69000, stock_quantity: 50, image_url: "/img/thit/thit-vai-heo.jpg", category_id: 5, is_active: true },
  { name: "Lòng heo làm sạch túi 300g", sku: "TH-010", description: "Lòng sạch sẽ, không mùi hôi.", price: 48000, stock_quantity: 20, image_url: "/img/thit/long-non-heo-nong-san-dung-ha.jpg", category_id: 5, is_active: true },

  /* DANH MỤC 6: TRỨNG & SỮA (Category ID: 6) */
  { name: "Trứng gà ta Ba Huân hộp 10 quả", sku: "TS-001", description: "Trứng gà tươi từ trang trại hiện đại.", price: 31000, stock_quantity: 100, image_url: "/img/trung-sua/Trung-Ga-Thao-Duoc_hop-10_07102024.jpg", category_id: 6, is_active: true },
  { name: "Sữa tươi TH True Milk ít đường 1L", sku: "TS-002", description: "Sữa tươi nguyên chất 100% sạch.", price: 36000, stock_quantity: 150, image_url: "/img/trung-sua/sua-tiet-trung-th-it-duong-1l-3-700x467.jpg", category_id: 6, is_active: true },
  { name: "Sữa chua Vinamilk có đường lốc 4", sku: "TS-003", description: "Sữa chua lên men tự nhiên.", price: 26000, stock_quantity: 200, image_url: "/img/trung-sua/loc-4-hu-sua-chua-co-duong-vinamilk-len-men-tu-nhien-100g_202508281518442130.jpg", category_id: 6, is_active: true },
  { name: "Sữa đặc Ông Thọ đỏ lon 380g", sku: "TS-004", description: "Sữa đặc có đường huyền thoại.", price: 24000, stock_quantity: 300, image_url: "/img/trung-sua/sua-dac-co-duong-ong-tho-trang-nhan-vang-lon-380g-202306141608258891.jpg", category_id: 6, is_active: true },
  { name: "Trứng vịt Ba Huân hộp 10 quả", sku: "TS-005", description: "Trứng vịt lớn, lòng đỏ đậm.", price: 38000, stock_quantity: 80, image_url: "/img/trung-sua/trung-vit-hop-10.jpg", category_id: 6, is_active: true },
  { name: "Sữa tươi Vinamilk có đường 180ml", sku: "TS-006", description: "Lốc 4 hộp sữa tiệt trùng.", price: 31000, stock_quantity: 250, image_url: "/img/trung-sua/loc-4-hop-sua-tuoi-tiet-trung-co-duong-vinamilk-100-sua-tuoi-180ml-202403281331556972.jpg", category_id: 6, is_active: true },
  { name: "Phô mai con bò cười hộp 8 miếng", sku: "TS-007", description: "Phô mai giàu canxi và dinh dưỡng.", price: 38000, stock_quantity: 70, image_url: "/img/trung-sua/pho-mai-con-bo-cuoi-hop-120g-8-mieng_202507081433598988.jpg", category_id: 6, is_active: true },
  { name: "Sữa hạt Milo lốc 4 hộp 180ml", sku: "TS-008", description: "Thức uống lúa mạch thơm ngon.", price: 29000, stock_quantity: 180, image_url: "/img/trung-sua/thuc-uong-dd-milo-180ml-loc_202511201416590267.jpg", category_id: 6, is_active: true },
  { name: "Sữa đậu nành Fami lốc 6 bịch", sku: "TS-009", description: "Làm từ đậu nành chọn lọc không biến đổi gen.", price: 28000, stock_quantity: 140, image_url: "/img/trung-sua/loc-6-hop-sua-dau-nanh-nguyen-chat-fami-200ml-202407161358005598.jpg", category_id: 6, is_active: true },
  { name: "Bơ lạt Anchor khối 227g", sku: "TS-010", description: "Bơ nhập khẩu cao cấp dùng làm bánh.", price: 85000, stock_quantity: 40, image_url: "/img/trung-sua/bo-lat-anchor-227g-202201022308318607.jpg", category_id: 6, is_active: true }
];

async function seed() {
  try {
    await dataSource.initialize();
    console.log('✅ Database connected');

    // 0. Clean database
    console.log('🧹 Cleaning database...');
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');
    await dataSource.query('TRUNCATE TABLE product_ingredients');
    await dataSource.query('TRUNCATE TABLE order_items');
    await dataSource.query('TRUNCATE TABLE cart_items');
    await dataSource.query('TRUNCATE TABLE products');
    // await dataSource.query('TRUNCATE TABLE recipes'); // Keep recipes if possible or seed them too
    // For now, let's keep recipes/ingredients if not in seed list, but to be clean:
    await dataSource.query('TRUNCATE TABLE categories');
    // Keep users to avoid logout? Or reset too. Let's reset for consistency.
    // await dataSource.query('TRUNCATE TABLE users'); 
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✨ Database cleaned');

    // 1. Create categories
    console.log('\n📦 Creating categories...');
    const categories = [
      { name: 'Gia vị', slug: 'gia-vi', description: 'Các loại gia vị nấu ăn' },
      { name: 'Hải sản', slug: 'hai-san', description: 'Hải sản tươi ngon' },
      { name: 'Ngũ cốc', slug: 'ngu-coc', description: 'Ngũ cốc và thực phẩm dinh dưỡng' },
      { name: 'Rau củ quả', slug: 'rau-cu-qua', description: 'Rau củ quả tươi sạch' },
      { name: 'Thịt', slug: 'thit', description: 'Các loại thịt tươi' },
      { name: 'Trứng & Sữa', slug: 'trung-sua', description: 'Trứng và sản phẩm từ sữa' },
    ];

    // Get or create categories
    const categoryIdMap: Record<number, number> = {}; // old ID -> new ID
    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      const [existing] = await dataSource.query(
        'SELECT id FROM categories WHERE slug = ?',
        [cat.slug]
      );

      if (existing) {
        // Update existing category
        await dataSource.query(
          'UPDATE categories SET name = ?, description = ? WHERE slug = ?',
          [cat.name, cat.description, cat.slug]
        );
        categoryIdMap[i + 1] = existing.id;
        console.log(`  ✓ Updated: ${cat.name} (ID: ${existing.id})`);
      } else {
        // Insert new category
        const result = await dataSource.query(
          'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
          [cat.name, cat.slug, cat.description]
        );
        categoryIdMap[i + 1] = result.insertId;
        console.log(`  ✓ Created: ${cat.name} (ID: ${result.insertId})`);
      }
    }
    console.log(`✓ Processed ${categories.length} categories`);

    // 2. Create products
    console.log('\n🛒 Creating products...');
    let productCount = 0;

    for (const product of productsData) {
      // Map old category_id to actual database ID
      const actualCategoryId = categoryIdMap[product.category_id];

      if (!actualCategoryId) {
        console.log(`  ⚠ Skipping ${product.name}: category not found`);
        continue;
      }

      const [existingProduct] = await dataSource.query(
        'SELECT id FROM products WHERE sku = ?',
        [product.sku]
      );

      if (existingProduct) {
        // Update existing product
        await dataSource.query(
          `UPDATE products SET 
            name = ?, 
            description = ?, 
            price = ?, 
            stock_quantity = ?, 
            image_url = ?, 
            category_id = ?, 
            is_active = ?
          WHERE sku = ?`,
          [
            product.name,
            product.description,
            product.price,
            product.stock_quantity,
            product.image_url,
            actualCategoryId,
            product.is_active,
            product.sku
          ]
        );
        console.log(`  ✓ Updated: ${product.name}`);
      } else {
        // Insert new product
        await dataSource.query(
          `INSERT INTO products (name, sku, description, price, stock_quantity, image_url, category_id, is_active, unit)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            product.name,
            product.sku,
            product.description,
            product.price,
            product.stock_quantity,
            product.image_url,
            actualCategoryId,
            product.is_active,
            'kg'
          ]
        );
        console.log(`  ✓ Created: ${product.name}`);
      }
      productCount++;
    }
    console.log(`✓ Processed ${productCount} products`);

    // 3. Create test users
    console.log('\n👥 Creating test users...');
    const testUsers = [
      { email: 'admin@shop.com', password: 'admin123', fullName: 'Admin User', role: 'admin' },
      { email: 'user@shop.com', password: 'user123', fullName: 'Test User', role: 'user' },
      { email: 'demo@shop.com', password: 'demo123', fullName: 'Demo Customer', role: 'user' },
    ];

    for (const userData of testUsers) {
      const [existingUser] = await dataSource.query(
        'SELECT id FROM users WHERE email = ?',
        [userData.email]
      );

      const passwordHash = await bcrypt.hash(userData.password, 10);

      if (!existingUser) {
        await dataSource.query(
          `INSERT INTO users (email, password_hash, full_name, role, created_at, updated_at)
           VALUES (?, ?, ?, ?, NOW(), NOW())`,
          [userData.email, passwordHash, userData.fullName, userData.role]
        );
        console.log(`  ✓ Created user: ${userData.email} (password: ${userData.password})`);
      } else {
        // Update password for existing user
        await dataSource.query(
          `UPDATE users SET password_hash = ?, updated_at = NOW() WHERE email = ?`,
          [passwordHash, userData.email]
        );
        console.log(`  ✓ Updated password for: ${userData.email} (password: ${userData.password})`);
      }
    }

    console.log('\n✅ Seed data completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Products: ${productCount}`);
    console.log(`   Users: ${testUsers.length}`);
    console.log('\n📋 Test Accounts:');
    console.log('   Admin: admin@shop.com / admin123');
    console.log('   User:  user@shop.com / user123');
    console.log('   Demo:  demo@shop.com / demo123');

    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
