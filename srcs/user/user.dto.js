export const userInfoDTO = (userInfo) => ({
  user_id: userInfo.user_id,
  email: userInfo.email,
  nickname: userInfo.nickname,
});

export const updateNicknameResponseDTO = (user) => ({
  user_id: user.user_id,
  nickname: user.nickname
});

export const errorDTO = (message) => ({
  message
});
