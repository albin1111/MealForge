import { handleError } from "@/utils/errorHandler";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";
import { Alert } from "react-native";
import { TRecipe } from "@/utils/types/recipe";

type generateProps = {
	ingredients: string[];
	user_preference: string;
};

export const handleLGenerate = createAsyncThunk(
	"recipe/handleLGenerate",
	async (data: generateProps, { rejectWithValue, dispatch }) => {
		try {
			const res = await axios.post("/test", {
				ingredients: data.ingredients,
				user_preference: "",
			});
			console.log(res.data);
			return res.data;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError:", resError);
			return rejectWithValue(resError);
		}
	}
);

type handleSaveRecipeProps = {
	userId: string | undefined;
	recipe: {
		name: string;
		ingredients: [
			{
				name: string;
				measurement: string;
			}
		];
		instructions: [string];
		type_of_cuisine: string;
		nutrient_counts: [
			{
				name: string;
				measurement: string;
			}
		];
		serve_hot_or_cold: string;
		cooking_time: string;
		benefits: string;
		serve_for: string;
		tags: string;
		allergens: string;
		leftover_recommendations: string;
	};
};

export const handleSaveRecipe = createAsyncThunk(
	"recipe/handleSaveRecipe",
	async (data: handleSaveRecipeProps, { rejectWithValue }) => {
		try {
			const { userId, recipe } = data;
			const res = await axios.post(`/create_recipe/${userId}`, { recipe });

			console.log("Recipe saved:", res.data);
			Alert.alert(res.data.message);
			return res.data;
		} catch (error) {
			// Handle and log the error
			const resError = handleError(error);
			console.log("resError:", resError);
			return rejectWithValue(resError);
		}
	}
);

export const handleGetUserRecipes = createAsyncThunk(
	"recipe/handleGetUserRecipes",
	async (userId: string | undefined, { rejectWithValue }) => {
		try {
			const res = await axios.get(`/user/${userId}/recipes`);
			return res.data.recipes;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError:", resError);
			return rejectWithValue(resError);
		}
	}
);

export const getUserRecipe = createAsyncThunk(
	"recipe/getUserRecipe",
	async (recipeId: string | string[], { rejectWithValue }) => {
		try {
			const res = await axios.get(`/user/recipe/${recipeId}`);
			return res.data.recipe;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError:", resError);
			return rejectWithValue(resError);
		}
	}
);

export const deleteRecipe = createAsyncThunk(
	"recipe/deleteRecipe",
	async (recipeId: string | string[], { rejectWithValue }) => {
		try {
			const res = await axios.delete(`/user/recipe/${recipeId}`);
			return res.data;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError:", resError);
			return rejectWithValue(resError);
		}
	}
);
