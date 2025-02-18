import { handleError } from "@/utils/errorHandler";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";
import { clearIngredients } from "../slices/ingredientsSlice";

type addIngredientsProps = {
	userId: string;
	name: string;
	type: string; // main ingredient || seasoning
	measurements: string;
	expirationDate: Date | null | undefined;
};

export const addIngredients = createAsyncThunk(
	"user/addIngredients",
	async (props: addIngredientsProps, { rejectWithValue }) => {
		try {
			const res = await axios.post(`/user/add_ingredients/${props.userId}`, {
				name: props.name,
				type: props.type,
				measurements: props.measurements,
				expirationDate: props.expirationDate,
			});
			return res.data;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError:");
			console.log(resError);
			return rejectWithValue(resError);
		}
	}
);

export const getIngredients = createAsyncThunk(
	"user/getIngredients",
	async (userId: string, { rejectWithValue }) => {
		try {
			const res = await axios.get(`/user/${userId}/ingredients`);
			return res.data;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError");
			console.log(resError);
			return rejectWithValue(error);
		}
	}
);

export const deleteIngredients = createAsyncThunk(
	"user/deleteIngredients",
	async (ingredientId: string, { rejectWithValue }) => {
		try {
			const res = await axios.delete(
				`/user/delete_ingredients/${ingredientId}`
			);
			return {
				message: res.data.message,
				id: ingredientId,
			};
		} catch (error) {
			const resError = handleError(error);
			console.log("resError");
			console.log(resError);
			return rejectWithValue(resError);
		}
	}
);
