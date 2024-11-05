'use server'

import { cookies } from 'next/headers'
import mysql from 'mysql2/promise';

export async function deleteData() {
  const userId = cookies().get('session')?.value;

  if (!userId) {
    return { success: false, message: '인증되지 않은 사용자입니다.' };
  }

  let connection;

  try {
    connection = await mysql.createConnection({
      host: '', // DB 정보 입력
      user: '',
      password: '',
      database: ''
    });

    await connection.execute('DELETE FROM Classification_Log WHERE user_id = ?', [userId]);

    await connection.execute('DELETE FROM Waste_Item');

    return { success: true, message: '모든 분류 데이터와 Waste_Item 데이터가 성공적으로 삭제되었습니다.' };
  } catch (error) {
    console.error('데이터 삭제 중 오류 발생:', error);
    return { success: false, message: '데이터 삭제 중 오류가 발생했습니다.' };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
