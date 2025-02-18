import { handleRefresh } from "@/redux/actions/authActions";
import { axiosPrivate } from "@/redux/api/axios";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useAxiosPrivate = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { accessToken } = useSelector((state: RootState) => state.auth);

	useEffect(() => {
		const requestInterceptors = axiosPrivate.interceptors.request.use(
			(config) => {
				if (!config.headers["Authorization"]) {
					config.headers["Authorization"] = `Bearer ${accessToken}`;
				}
				return config;
			},
			(err) => Promise.reject(err)
		);

		const responseInterceptors = axiosPrivate.interceptors.response.use(
			(response) => response,
			async (err) => {
				const prevRequest = err?.config;
				if (err.response.status === 403 && !prevRequest?.send) {
					prevRequest.sent = true;
					const newAccessToken = await dispatch(handleRefresh(accessToken));
					prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
					return axiosPrivate(prevRequest);
				}
				return Promise.reject(err);
			}
		);

		return () => {
			axiosPrivate.interceptors.request.eject(requestInterceptors);
			axiosPrivate.interceptors.response.eject(responseInterceptors);
		};
	}, [handleRefresh, accessToken]);
	return axiosPrivate;
};

export default useAxiosPrivate;
