// srcs/utils/jwt.utils.js
import jwt from 'jsonwebtoken';

const extractTokenFromHeader = (req) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Authorization header missing or invalid');
    }
    return authHeader.split(' ')[1];
};

function generateTokens(user_id, email) {
    const accessToken = jwt.sign({ user_id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const refreshToken = jwt.sign({ user_id, email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

    return { accessToken, refreshToken };
}

export { extractTokenFromHeader, generateTokens };
