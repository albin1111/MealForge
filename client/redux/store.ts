import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer, persistStore, createTransform } from "redux-persist";
import authSlice, { resetPageLoading, TInitialState } from "./slices/authSlice";
import ingredientSlice from "./slices/ingredientsSlice";
import recipeSlice from "./slices/recipeSlice";
import postSlice from "./slices/postSlice";

const authTransform = createTransform<TInitialState, TInitialState>(
	(inboundState) => inboundState, // No changes during persistence
	(outboundState) => {
		return { ...outboundState, pageLoading: false }; // Reset only on rehydration
	},
	{ whitelist: ["auth"] }
);

const persistConfig = {
	key: "root",
	storage: AsyncStorage,
	transforms: [authTransform],
};

const persistedAuthReducer = persistReducer(persistConfig, authSlice);

export const store = configureStore({
	reducer: {
		auth: persistedAuthReducer,
		user: userSlice,
		ingredients: ingredientSlice,
		recipe: recipeSlice,
		post: postSlice,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

const initializeStore = () => {
	const state = store.getState();
	if (state.auth.pageLoading) {
		store.dispatch(resetPageLoading());
	}
};

initializeStore();

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
