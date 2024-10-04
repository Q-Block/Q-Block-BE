import { 
  getUserInfo as getUserInfoFromModel, 
  updateUserNickname as updateUserNicknameInModel,
  deleteUserRefreshToken,
  getUserByRefreshToken 
} from './user.model.js';

export async function getUserInfo(userId) {
  const userInfo = await getUserInfoFromModel(userId);
  if (!userInfo) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }
  console.log('사용자 정보 조회됨:', userInfo);
  return userInfo;
}

export async function updateNickname(userId, newNickname) {
  await updateUserNicknameInModel(userId, newNickname);
  return { user_id: userId, nickname: newNickname };
}

export async function invalidateToken(refreshToken) {
  try {
    const user = await getUserByRefreshToken(refreshToken);
    if (user) {
      const result = await deleteUserRefreshToken(user.user_id);
      if (result.affectedRows === 0) {
        throw new Error('리프레시 토큰 무효화 실패');
      }
      const updatedUser = await getUserByRefreshToken(refreshToken);
      if (updatedUser) {
        throw new Error('리프레시 토큰 무효화 실패');
      }
    } else {
      throw new Error('리프레시 토큰이 유효하지 않습니다.');
    }
  } catch (error) {
    throw error;
  }
}
