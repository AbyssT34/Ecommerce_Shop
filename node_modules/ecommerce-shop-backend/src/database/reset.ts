import { DataSource } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'ecommerce_shop',
    multipleStatements: true,
});

async function reset() {
    try {
        await dataSource.initialize();
        console.log('✅ Database connected');

        const resetSql = fs.readFileSync(path.join(__dirname, '../../../../reset_db.sql'), 'utf8');
        await dataSource.query(resetSql);

        console.log('🗑️ Database truncated successfully!');
        await dataSource.destroy();
    } catch (error) {
        console.error('❌ Error resetting database:', error);
        process.exit(1);
    }
}

reset();
