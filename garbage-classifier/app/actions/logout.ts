'use server'

import { cookies } from 'next/headers'
import mysql from 'mysql2/promise';

export async function logout() {
  const sessionId = cookies().get('session')?.value;

  if (!sessionId) {
    return { success: false, message: '로그인된 사용자가 없습니다.' };
  }

  let connection;

  try {
    connection = await mysql.createConnection({
      host: '', // DB 정보 입력
      user: '',
      password: '',
      database: ''
    });

    cookies().delete('session');

    return { success: true, message: '로그아웃되었습니다.' };
  } catch (error) {
    console.error('로그아웃 처리 중 오류 발생:', error);
    return { success: false, message: '로그아웃 처리 중 오류가 발생했습니다.' };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
