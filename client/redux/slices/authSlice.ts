import { createSlice } from "@reduxjs/toolkit";
import {
	handleLogin,
	handleSignup,
	handleRefresh,
	handleLogout,
} from "../actions/authActions";

export type TInitialState = {
	accessToken: string | null;
	refreshToken: string | null;
	status: "idle" | "pending" | "completed" | "failed";
	pageLoading: boolean;
	error: string | null;
};

const initialState: TInitialState = {
	accessToken: null,
	refreshToken: null,
	status: "idle",
	pageLoading: false,
	error: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setToken: (state, action) => {
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken;
		},
		clearToken: (state) => {
			state.accessToken = null;
			state.refreshToken = null;
			state.pageLoading = false;
			state.status = "idle";
			state.error = null;
		},
		resetPageLoading: (state) => {
			state.pageLoading = false;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(handleLogin.pending, (state) => {
				state.status = "pending";
				state.error = null;
			})
			.addCase(handleLogin.fulfilled, (state, action) => {
				state.accessToken = action.payload.accessToken;
				state.refreshToken = action.payload.refreshToken;
				state.status = "completed";
				state.error = null;
			})
			.addCase(handleLogin.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload as string;
			})
			.addCase(handleSignup.pending, (state) => {
				state.status = "pending";
			})
			.addCase(handleSignup.fulfilled, (state) => {
				state.status = "completed";
			})
			.addCase(handleSignup.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload as string;
			})
			.addCase(handleRefresh.pending, (state) => {
				state.pageLoading = true;
			})
			.addCase(handleRefresh.fulfilled, (state, action) => {
				state.accessToken = action.payload.accessToken;
				state.refreshToken = action.payload.refreshToken;
				state.pageLoading = false;
				state.error = null;
			})
			.addCase(handleRefresh.rejected, (state, action) => {
				state.accessToken = null;
				state.refreshToken = null;
				state.pageLoading = false;
				state.error = action.payload as string;
			})
			.addCase(handleLogout.pending, (state) => {
				state.status = "pending";
			})
			.addCase(handleLogout.fulfilled, (state) => {
				state.accessToken = null;
				state.refreshToken = null;
				state.status = "completed";
				state.error = null;
			})
			.addCase(handleLogout.rejected, (state, action) => {
				state.accessToken = null;
				state.refreshToken = null;
				state.status = "failed";
				state.error = action.payload as string;
			});
	},
});

export const { setToken, clearToken, resetPageLoading } = authSlice.actions;
export default authSlice.reducer;
