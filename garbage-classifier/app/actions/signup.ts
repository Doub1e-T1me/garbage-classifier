'use server'

import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

export async function signup(username: string, email: string, password: string) {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: '', // DB 정보 입력
      user: '',
      password: '',
      database: ''
    });

    const [rows]: any = await connection.execute('SELECT * FROM User WHERE email = ?', [email]);
    if (rows.length > 0) {
      return { success: false, error: '이미 존재하는 이메일입니다.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.execute(
      'INSERT INTO User (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    return { success: true };
  } catch (error) {
    console.error('회원가입 중 오류 발생:', error);
    return { success: false, error: '회원가입 중 오류가 발생했습니다.' };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
