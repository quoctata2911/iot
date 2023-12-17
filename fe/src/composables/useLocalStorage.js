// import { IDecodeToken } from "@/api/interface";
// import jwtDecode from "jwt-decode";

const accessToken = "id_token";

export const set = (key, value) => typeof window !== "undefined" && window.localStorage.setItem(key, JSON.stringify(value));
export const get = (key) => typeof window !== "undefined" && window.localStorage.getItem(key);
export const remove = (key) => typeof window !== "undefined" && window.localStorage.removeItem(key);
export const setAccessToken = (token) => typeof window !== "undefined" && window.localStorage.setItem(accessToken, token);
export const getAccessToken = () => (typeof window !== "undefined" ? localStorage.getItem(accessToken) || "" : "");
export const removeAccessToken = () => typeof window !== "undefined" && window.localStorage.removeItem(accessToken);
// export const decodeAccessToken = () => {
// 	const accessTokenReturn = localStorage.getItem(accessToken);
// 	if (accessTokenReturn) return jwtDecode(accessTokenReturn);
// 	return null;
// };