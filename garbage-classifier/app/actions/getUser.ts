'use server'

import { cookies } from 'next/headers'
import mysql from 'mysql2/promise';

export async function getUser() {
  const sessionId = cookies().get('session')?.value;

  if (!sessionId) {
    return null;
  }

  let connection;

  try {
    connection = await mysql.createConnection({
      host: '', // DB 정보 입력
      user: '',
      password: '',
      database: ''
    });

    const [rows]: any = await connection.execute(`
      SELECT user_id, username, email
      FROM User
      WHERE user_id = ?
    `, [sessionId]);

    if (rows.length === 0) {
      return null;
    }

    const user = rows[0];
    return { id: user.user_id, name: user.username, email: user.email };
  } catch (error) {
    console.error('사용자 정보 조회 중 오류 발생:', error);
    return null;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
