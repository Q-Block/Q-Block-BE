export const GET_USER_INFO_QUERY = `
  SELECT user_id, nickname, email, refreshtoken
  FROM USER 
  WHERE user_id = ?
`;

export const UPDATE_USER_NICKNAME_QUERY = `
  UPDATE USER
  SET nickname = ?
  WHERE user_id = ?
`;

export const DELETE_USER_REFRESH_TOKEN_QUERY = `
  UPDATE USER 
  SET refreshtoken = NULL 
  WHERE user_id = ?
`;

export const GET_USER_BY_REFRESH_TOKEN_QUERY = `
  SELECT * 
  FROM USER 
  WHERE refreshtoken = ?
`;
