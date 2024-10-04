// config/response.status.js
import { StatusCodes } from "http-status-codes";

export const status = {

  SIGNUP_SUCCESS: {
    status: StatusCodes.OK,
    isSuccess: true,
    code: 200,
    message: "회원가입 성공"
  },
  LOGIN_SUCCESS: {
    status: StatusCodes.OK,
    isSuccess: true,
    code: 200,
    message: "로그인 성공",
  },
  //Problem
  UPLOAD_VIDEO_SUCCESS: {
    status: StatusCodes.OK,
    isSuccess: true,
    code: "200",
    message: "영상 업로드 성공"
  },

  DOWNLOAD_VIDEO_SUCCESS: {
    status: StatusCodes.OK,
    isSuccess: true,
    code: "200",
    message: "비디오 다운로드 성공."
  },
  VIDEO_INFO_SUCCESS: {
    status: StatusCodes.OK,
    isSuccess: true,
    code: "200",
    message: "영상 조회 성공."
  },
  GET_DETECTION_POINTS_SUCCESS: {
    status: 200,
    isSuccess: true,
    code: 200,
    message: "탐지 결과입니다."
  },
  GET_DETECTION_POINTS_NOT_FOUND: {
    status: 400,
    isSuccess: false,
    code: 400,
    message: "탐지 실패"
  }
};