import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  const conn = await mysql.createConnection({
    host: '', // DB 정보 입력
    user: '',
    password: '',
    database: ''
  });

  try {
    const [totalClassifiedRows] = await conn.query(`
      SELECT COUNT(*) as totalClassified FROM Classification_Log
    `);
    const totalClassified = totalClassifiedRows[0].totalClassified;

    const [categoryCountsRows] = await conn.query(`
      SELECT cc.name, COUNT(cl.log_id) as count
      FROM Classification_Log cl
      JOIN Waste_Item wi ON cl.item_id = wi.item_id
      JOIN Classification_Category cc ON wi.category_id = cc.category_id
      GROUP BY cc.name
    `);
    const categories = categoryCountsRows.reduce((acc, row) => {
      acc[row.name] = row.count;
      return acc;
    }, {});

    const [dailyClassificationsRows] = await conn.query(`
      SELECT DATE(cl.timestamp) as date, cc.name as category, COUNT(cl.log_id) as total
      FROM Classification_Log cl
      JOIN Waste_Item wi ON cl.item_id = wi.item_id
      JOIN Classification_Category cc ON wi.category_id = cc.category_id
      GROUP BY DATE(cl.timestamp), cc.name
      ORDER BY date ASC
    `);
    const dailyClassifications = dailyClassificationsRows.map((row) => ({
      date: row.date,
      category: row.category,
      total: row.total,
    }));

    const [photosRows] = await conn.query(`
      SELECT cl.log_id as id, cl.timestamp as date, cc.name as category, cl.image_url
      FROM Classification_Log cl
      JOIN Waste_Item wi ON cl.item_id = wi.item_id
      JOIN Classification_Category cc ON wi.category_id = cc.category_id
      WHERE cl.image_url IS NOT NULL
      ORDER BY cl.timestamp DESC
    `);

    const photos = photosRows.map((row) => ({
      id: row.id,
      date: row.date,
      category: row.category,
      image_url: row.image_url, 
    }));

    console.log('API Response:', { totalClassified, categories, dailyClassifications, photos });

    return NextResponse.json({
      totalClassified,
      categories,
      dailyClassifications,
      photos,
    });
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    conn.end();
  }
}
