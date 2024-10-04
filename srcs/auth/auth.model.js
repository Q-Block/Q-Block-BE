import { pool } from '../../config/db.js'; // named import
import {
    GET_USER_BY_EMAIL_QUERY,
    GET_USER_BY_NICKNAME_QUERY,
    CREATE_USER_QUERY,
    UPDATE_USER_REFRESH_TOKEN_QUERY,
    DELETE_USER_REFRESH_TOKEN_QUERY,
    GET_USER_BY_REFRESH_TOKEN_QUERY
} from './auth.sql.js';

export async function getUserByEmail(email) {
    try {
        console.log(`Fetching user by email: ${email}`);
        const [rows] = await pool.query(GET_USER_BY_EMAIL_QUERY, [email]);
        console.log(`Fetched user: ${JSON.stringify(rows[0])}`);
        return rows[0];
    } catch (error) {
        console.error(`Error fetching user by email: ${error.message}`);
        throw error; // 필요에 따라 에러를 다시 던질 수 있습니다.
    }
}


export async function getUserByNickname(nickname) {
    const [rows] = await pool.query(GET_USER_BY_NICKNAME_QUERY, [nickname]);
    return rows[0];
}

export async function createUser(userDTO) {
    const { email, password, nickname } = userDTO;
    const [result] = await pool.query(CREATE_USER_QUERY, [email, password, nickname]);
    return result;
}

export async function updateUserRefreshToken(userId, refreshToken) {
    console.log(`Updating refresh token for userId: ${userId} with token: ${refreshToken}`);
    try {
        const [result] = await pool.query(UPDATE_USER_REFRESH_TOKEN_QUERY, [refreshToken, userId]);
        console.log('Update result:', result);
        return result;
    } catch (error) {
        console.error('Error updating refresh token:', error);
        throw error;
    }
}

export async function deleteUserRefreshToken(userId) {
    try {
        const [result] = await pool.query(DELETE_USER_REFRESH_TOKEN_QUERY, [userId]);
        return result;
    } catch (error) {
        console.error('Error deleting refresh token:', error);
        throw error;
    }
}

export async function getUserByRefreshToken(refreshToken) {
    const [rows] = await pool.query(GET_USER_BY_REFRESH_TOKEN_QUERY, [refreshToken]);
    return rows[0];
}

