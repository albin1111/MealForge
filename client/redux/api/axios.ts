import axios from "axios";

const LocalUrl = process.env.EXPO_PUBLIC_IP_URL;

export default axios.create({
	baseURL: LocalUrl,
});

export const axiosPrivate = axios.create({
	baseURL: LocalUrl,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});
