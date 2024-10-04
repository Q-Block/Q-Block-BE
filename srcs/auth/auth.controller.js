import * as AuthService from './auth.service.js';
import { response } from '../../config/response.js';
import { 
    authResponseDTO, 
    tokenRefreshResponseDTO, 
    authErrorResponseDTO, 
    tokenRefreshErrorResponseDTO 
} from './auth.dto.js';

export async function signup(req, res) {
    try {
        const { email, password, nickname } = req.body;

        if (!email || !password || !nickname) {
            return res.status(400).json(response({
                isSuccess: false,
                code: 400,
                message: '모든 필드가 필요합니다.',
            }));
        }

        try {
            await AuthService.createUser({ email, password, nickname });
            res.status(201).json(response({
                isSuccess: true,
                code: 201,
                message: '사용자가 성공적으로 가입되었습니다.',
            }));
        } catch (error) {
            if (error.message.includes('이미 등록된 이메일') || 
                error.message.includes('이미 등록된 닉네임')) {
                return res.status(409).json(response({
                    isSuccess: false,
                    code: 409,
                    message: error.message,
                }));
            }
            throw error;
        }
    } catch (error) {
        console.error('가입 중 오류 발생:', error);
        res.status(500).json(response({
            isSuccess: false,
            code: 500,
            ...authErrorResponseDTO('서버 오류가 발생했습니다.'),
        }));
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        console.log('로그인 시도:', { email, password });

        if (!email || !password) {
            return res.status(400).json(response({
                isSuccess: false,
                code: 400,
                message: '이메일과 비밀번호는 필수입니다.',
            }));
        }

        try {
            const { accessToken, refreshToken } = await AuthService.authenticateUser(email, password);

            // 액세스 토큰을 응답 헤더에 설정
            res.setHeader('Authorization', `Bearer ${accessToken}`);

            res.status(200).json(response({
                isSuccess: true,
                code: 200,
                message: '로그인 성공'
            }, authResponseDTO(refreshToken)));
        } catch (error) {
            return res.status(401).json(response({
                isSuccess: false,
                code: 401,
                ...authErrorResponseDTO(error.message),
            }));
        }
    } catch (error) {
        console.error('로그인 중 오류 발생:', error);
        res.status(500).json(response({
            isSuccess: false,
            code: 500,
            ...authErrorResponseDTO('서버 오류가 발생했습니다.'),
        }));
    }
}

export async function refresh(req, res) {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json(response({
                isSuccess: false,
                code: 400,
                message: '리프레시 토큰이 필요합니다.',
            }));
        }

        try {
            const { accessToken, refreshToken: newRefreshToken } = await AuthService.refreshToken(refreshToken);

            // 새로운 액세스 토큰을 응답 헤더에 설정
            res.setHeader('Authorization', `Bearer ${accessToken}`);

            res.status(200).json(response({
                isSuccess: true,
                code: 200,
                message: '토큰 갱신 성공'
            }, tokenRefreshResponseDTO(newRefreshToken)));
        } catch (error) {
            return res.status(401).json(response({
                isSuccess: false,
                code: 401,
                ...tokenRefreshErrorResponseDTO(error.message),
            }));
        }
    } catch (error) {
        console.error('토큰 갱신 중 오류 발생:', error);
        res.status(500).json(response({
            isSuccess: false,
            code: 500,
            ...tokenRefreshErrorResponseDTO('서버 오류가 발생했습니다.'),
        }));
    }
}
