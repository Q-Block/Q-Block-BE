import { pool } from '../../config/db.js';
import { 
  GET_USER_INFO_QUERY, 
  UPDATE_USER_NICKNAME_QUERY,
  DELETE_USER_REFRESH_TOKEN_QUERY,
  GET_USER_BY_REFRESH_TOKEN_QUERY
} from './user.sql.js';

export async function getUserInfo(userId) {
  const [rows] = await pool.query(GET_USER_INFO_QUERY, [userId]);
  return rows[0];
}

export async function getUserByNickname(nickname) {
  const [rows] = await pool.query('SELECT * FROM USER WHERE nickname = ?', [nickname]);
  return rows[0];
}

export async function updateUserNickname(userId, newNickname) {
  const [result] = await pool.query(UPDATE_USER_NICKNAME_QUERY, [newNickname, userId]);
  return result;
}

export async function deleteUserRefreshToken(userId) {
  try {
    const [result] = await pool.query(DELETE_USER_REFRESH_TOKEN_QUERY, [userId]);
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getUserByRefreshToken(refreshToken) {
  const [rows] = await pool.query(GET_USER_BY_REFRESH_TOKEN_QUERY, [refreshToken]);
  return rows[0];
}
