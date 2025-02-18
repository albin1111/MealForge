import { TIngredients } from "@/utils/types/ingredients";
import { createSlice } from "@reduxjs/toolkit";
import {
	addIngredients,
	deleteIngredients,
	getIngredients,
} from "../actions/ingredientsAction";

type TInitialState = {
	ingredients: TIngredients[];
	status: "idle" | "pending" | "completed" | "failed";
	error: any | null;
	pageLoading: boolean;
};

const initialState: TInitialState = {
	ingredients: [],
	status: "idle",
	pageLoading: false,
	error: null,
};

const ingredientSlice = createSlice({
	name: "ingredients",
	initialState,
	reducers: {
		setIngredients: (state, action) => {
			state.ingredients = action.payload;
		},
		clearIngredients: (state) => {
			state.ingredients = [];
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getIngredients.pending, (state, action) => {
				state.pageLoading = true;
			})
			.addCase(getIngredients.fulfilled, (state, action) => {
				state.pageLoading = false;
				state.ingredients = action.payload.ingredients;
			})
			.addCase(getIngredients.rejected, (state, action) => {
				state.pageLoading = false;
				state.error = action.error.message;
			})
			.addCase(addIngredients.pending, (state, action) => {
				state.status = "pending";
			})
			.addCase(addIngredients.fulfilled, (state, action) => {
				state.status = "completed";
				state.ingredients.push(action.payload.ingredient);
			})
			.addCase(addIngredients.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(deleteIngredients.pending, (state, action) => {
				state.status = "pending";
			})
			.addCase(deleteIngredients.fulfilled, (state, action) => {
				state.status = "completed";
				state.ingredients = state.ingredients.filter(
					(item) => item.id !== action.payload.id
				);
			})
			.addCase(deleteIngredients.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			});
	},
});

export const { clearIngredients, setIngredients } = ingredientSlice.actions;
export default ingredientSlice.reducer;
