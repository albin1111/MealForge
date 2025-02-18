import { TRecipe } from "@/utils/types/recipe";
import { createSlice } from "@reduxjs/toolkit";
import { getUserRecipe, handleGetUserRecipes } from "../actions/recipeAction";

type TInitialState = {
	recipe: TRecipe[];
	status: "idle" | "pending" | "completed" | "failed";
	pageLoading: boolean;
	error: any | null;
};

const initialState: TInitialState = {
	recipe: [],
	status: "idle",
	pageLoading: false,
	error: null,
};

const recipeSlice = createSlice({
	name: "recipe",
	initialState,
	reducers: {
		setRecipe: (state, action) => {
			state.recipe = action.payload.recipe;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(handleGetUserRecipes.pending, (state, action) => {
				state.status = "pending";
			})
			.addCase(handleGetUserRecipes.fulfilled, (state, action) => {
				state.status = "completed";
				state.recipe = action.payload;
			})
			.addCase(handleGetUserRecipes.rejected, (state, action) => {
				state.status = "failed";
			})
			.addCase(getUserRecipe.pending, (state) => {
				state.status = "pending";
			})
			.addCase(getUserRecipe.fulfilled, (state) => {
				state.status = "completed";
			})
			.addCase(getUserRecipe.rejected, (state) => {
				state.status = "failed";
			});
	},
});

export const { setRecipe } = recipeSlice.actions;
export default recipeSlice.reducer;
