import * as UserService from './user.service.js';
import { response } from '../../config/response.js';
import { userInfoDTO, updateNicknameResponseDTO, errorDTO } from './user.dto.js';

export async function getUserInfo(req, res) {
  try {
    const user_id = req.user_id;
    console.log('Requested User ID:', user_id);

    if (!user_id) {
      return res.status(400).json(response({
        isSuccess: false,
        code: 400,
        message: 'user_id가 필요합니다.',
      }));
    }

    const userInfo = await UserService.getUserInfo(user_id);

    if (!userInfo) {
      return res.status(404).json(response({
        isSuccess: false,
        code: 404,
        message: '사용자를 찾을 수 없습니다.',
      }));
    }

    const userInfoResponseDTO = userInfoDTO(userInfo);

    res.status(200).json(response({
      isSuccess: true,
      code: 200,
      message: '조회 성공',
    }, userInfoResponseDTO));

  } catch (error) {
    console.error('사용자 정보 조회 중 오류 발생:', error);
    res.status(500).json(response({
      isSuccess: false,
      code: 500,
      message: '서버 오류가 발생했습니다.',
    }, errorDTO('서버 오류가 발생했습니다.')));
  }
}

export async function updateNickname(req, res) {
  try {
    const user_id = req.user_id;
    const { nickname } = req.body;

    if (!user_id || !nickname) {
      return res.status(400).json(response({
        isSuccess: false,
        code: 400,
        message: 'user-id와 nickname이 필요합니다.',
      }));
    }

    await UserService.updateNickname(user_id, nickname);
    const nicknameResponseDTO = updateNicknameResponseDTO({ user_id, nickname });

    res.status(200).json(response({
      isSuccess: true,
      code: 200,
      message: '닉네임 수정 성공',
    }, nicknameResponseDTO));

  } catch (error) {
    console.error('닉네임 수정 중 오류 발생:', error);
    if (error.message.includes('이미 등록된 닉네임')) {
      return res.status(409).json(response({
        isSuccess: false,
        code: 409,
        message: error.message,
      }));
    }
    res.status(500).json(response({
      isSuccess: false,
      code: 500,
      message: '서버 오류가 발생했습니다.',
    }, errorDTO('서버 오류가 발생했습니다.')));
  }
}

export async function logout(req, res) {
  const user_id = req.user_id;

  if (!user_id) {
    return res.status(400).json(response({
      isSuccess: false,
      code: 400,
      message: '액세스 토큰이 유효하지 않습니다.',
    }));
  }

  try {
    console.log('로그아웃 시작');
    const user = await UserService.getUserInfo(user_id);
    if (user && user.refreshtoken) {
      await UserService.invalidateToken(user.refreshtoken);
    } else {
      console.log('사용자에게 리프레시 토큰이 없음');
    }

    res.status(200).json(response({
      isSuccess: true,
      code: 200,
      message: '로그아웃 성공',
    }));
  } catch (error) {
    console.error('로그아웃 중 오류 발생:', error);
    res.status(500).json(response({
      isSuccess: false,
      code: 500,
      message: '서버 오류가 발생했습니다.',
    }));
  }
}
