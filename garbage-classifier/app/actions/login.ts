'use server'

import mysql from 'mysql2/promise';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export async function login(email: string, password: string) {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: '', // DB 정보 입력
      user: '',
      password: '',
      database: ''
    });

    const [rows]: any = await connection.execute('SELECT * FROM User WHERE email = ?', [email]);

    if (rows.length === 0) {
      return { success: false, error: '사용자를 찾을 수 없습니다.' };
    }

    const user = rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, error: '비밀번호가 올바르지 않습니다.' };
    }

    cookies().set('session', user.user_id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return { success: true };
  } catch (error) {
    console.error('로그인 중 오류 발생:', error);
    return { success: false, error: '로그인 중 오류가 발생했습니다.' };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
