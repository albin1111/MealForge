import { handleError } from "@/utils/errorHandler";
import { TUserLogin, TUserSignup } from "@/utils/types/user";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";
import { Alert } from "react-native";
import { router } from "expo-router";
import { setLogout, setUser } from "../slices/userSlice";
import { clearIngredients } from "../slices/ingredientsSlice";
import { setRecipe } from "../slices/recipeSlice";
import { setPost, setUserPost } from "../slices/postSlice";

export const handleLogin = createAsyncThunk(
	"auth/handleLogin",
	async (data: TUserLogin, { rejectWithValue, dispatch }) => {
		try {
			const res = await axios.post("/signin", data);
			dispatch(setUser(res.data.user));
			router.push("/(tabs)/home");
			return res.data;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError:", resError);
			return rejectWithValue(resError);
		}
	}
);

export const handleSignup = createAsyncThunk(
	"auth/handleSignup",
	async (data: TUserSignup, { rejectWithValue }) => {
		try {
			const res = await axios.post("/signup", data);
			return res.data;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError:", resError);
			return rejectWithValue(resError);
		}
	}
);

export const handleShowCookie = createAsyncThunk(
	"auth/handleShowCookie",
	async (_, { rejectWithValue }) => {
		try {
			const res = await axios.get("/showcookie");
			return res.data;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError:", resError);
			return rejectWithValue(resError);
		}
	}
);

export const handleLogout = createAsyncThunk(
	"auth/handleLogout",
	async (token: string | null, { rejectWithValue, dispatch }) => {
		try {
			const res = await axios.get("/logout", {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			console.log(res.data);
			dispatch(setLogout());
			return res.data;
		} catch (error) {
			const resError = handleError(error);
			console.log(resError);
			dispatch(setLogout());
			return rejectWithValue(resError);
		}
	}
);

export const handleRefresh = createAsyncThunk(
	"auth/handleRefresh",
	async (token: string | null, { rejectWithValue, dispatch }) => {
		try {
			const res = await axios.get("/refresh", {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			dispatch(setUser(res.data.user));
			return res.data;
		} catch (error) {
			dispatch(clearIngredients());
			dispatch(setRecipe([]));
			dispatch(setPost([]));
			dispatch(setUserPost([]));
			const resError = handleError(error);
			console.log(resError);
			return rejectWithValue(resError);
		}
	}
);
