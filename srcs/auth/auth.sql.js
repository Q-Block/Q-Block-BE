export const GET_USER_BY_EMAIL_QUERY = `
  SELECT * 
  FROM USER 
  WHERE email = ?
`;

export const GET_USER_BY_NICKNAME_QUERY = `
  SELECT * 
  FROM USER 
  WHERE nickname = ?
`;

export const CREATE_USER_QUERY = `
  INSERT INTO USER (status, email, password, nickname) 
  VALUES ('active', ?, ?, ?)
`;

export const UPDATE_USER_REFRESH_TOKEN_QUERY = `
  UPDATE USER 
  SET refreshtoken = ? 
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
