import { createSlice } from "@reduxjs/toolkit";
import {
	addAllergy,
	addSpecifications,
	changePassword,
	deleteAccount,
	deleteAllergy,
	editUser,
	getUser,
} from "../actions/userActions";
import { TUser } from "@/utils/types/user";

type TInitialState = {
	user: TUser | null;
	status: "idle" | "pending" | "completed" | "failed";
	pageLoading: boolean;
	error: any | null;
};

const initialState: TInitialState = {
	user: null,
	status: "idle",
	pageLoading: false,
	error: null,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
		},
		setLogout: (state) => {
			state.user = null;
			state.status = "idle";
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getUser.pending, (state) => {
				state.pageLoading = true;
			})
			.addCase(getUser.fulfilled, (state, action) => {
				state.pageLoading = false;
				state.user = action.payload;
			})
			.addCase(getUser.rejected, (state, action) => {
				state.pageLoading = false;
				state.error = action.error.message;
			})
			.addCase(editUser.pending, (state) => {
				state.status = "pending";
			})
			.addCase(editUser.fulfilled, (state) => {
				state.status = "completed";
			})
			.addCase(editUser.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(changePassword.pending, (state) => {
				state.status = "pending";
			})
			.addCase(changePassword.fulfilled, (state) => {
				state.status = "completed";
			})
			.addCase(changePassword.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(deleteAccount.pending, (state) => {
				state.status = "pending";
			})
			.addCase(deleteAccount.fulfilled, (state) => {
				state.status = "completed";
				state.user = null;
			})
			.addCase(deleteAccount.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(addAllergy.pending, (state) => {
				state.status = "pending";
			})
			.addCase(addAllergy.fulfilled, (state, action) => {
				state.status = "completed";
				if (state.user) {
					state.user = {
						...state.user,
						allergies: action.payload.allergies,
					};
				}
			})
			.addCase(addAllergy.rejected, (state, action) => {
				state.status = "failed";
			})
			.addCase(deleteAllergy.pending, (state) => {
				state.status = "pending";
			})
			.addCase(deleteAllergy.fulfilled, (state, action) => {
				state.status = "completed";
				if (state.user) {
					state.user = {
						...state.user,
						allergies: action.payload.allergies, // Update allergies after deletion
					};
				}
			})
			.addCase(deleteAllergy.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(addSpecifications.pending, (state) => {
				state.status = "pending";
			})
			.addCase(addSpecifications.fulfilled, (state) => {
				state.status = "completed";
				state.user = null;
			})
			.addCase(addSpecifications.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			});
	},
});

export const { setUser, setLogout } = userSlice.actions;
export default userSlice.reducer;
