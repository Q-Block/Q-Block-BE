import bcrypt from 'bcryptjs';
import { generateTokens } from '../utils/jwt.utils.js';
import * as AuthModel  from './auth.model.js'; 


export async function createUser(userDTO) {
    const { email, nickname, password } = userDTO;
    const hashedPassword = await bcrypt.hash(password, 10);
    return AuthModel.createUser({ ...userDTO, password: hashedPassword });  // AuthModel을 통해 호출
}

export async function authenticateUser(email, password) {
    console.log(`인증 시도: ${email}`);
    const user = await AuthModel.getUserByEmail(email); // AuthModel에서 가져오기
    console.log(`가져온 사용자: ${user ? JSON.stringify(user) : '사용자 없음'}`);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('이메일 또는 비밀번호가 잘못되었습니다.');
    }

    const { accessToken, refreshToken } = generateTokens(user.user_id, email);
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
