import { AxiosError, isAxiosError } from "axios";

interface ErrorResponse {
	error?: string; // The error message from the server
}

export const handleError = (error: unknown): string => {
	if (isAxiosError(error)) {
		const axiosError = error as AxiosError<ErrorResponse>;
		if (axiosError.response?.data) {
			if (typeof axiosError.response?.data === "string") {
				return axiosError.response?.data;
			}

			if (axiosError.response?.data.error) {
				return axiosError.response?.data.error;
			}
		}

		return axiosError.message;
	}

	return "An unknown error occurred";
};
