import bcrypt from 'bcryptjs';
import * as AuthModel from './auth.model.js';  
import { generateTokens } from '../utils/jwt.utils.js';

export async function createUser(userDTO) {
    const { email, nickname, password } = userDTO;

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    return AuthModel.createUser({ ...userDTO, password: hashedPassword });
}

export async function authenticateUser(email, password) {
    const user = await AuthModel.getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('이메일 또는 비밀번호가 잘못되었습니다.');
    }

    const { accessToken, refreshToken } = generateTokens(user.user_id, user.email);
    await AuthModel.updateUserRefreshToken(user.user_id, refreshToken);

    return { accessToken, refreshToken };
}

export async function refreshToken(refreshToken) {
    const user = await AuthModel.getUserByRefreshToken(refreshToken);

    if (!user || !refreshToken) {
        throw new Error('리프레시 토큰이 유효하지 않습니다.');
    }

    try {
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.user_id, user.email);
        await AuthModel.updateUserRefreshToken(user.user_id, newRefreshToken);

        return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
        console.error('Token verification failed:', error);
        throw new Error('리프레시 토큰이 만료되었습니다.');
    }
}
