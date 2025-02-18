import { handleError } from "@/utils/errorHandler";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";
import { Alert } from "react-native";
import { uriToBlob } from "@/utils/blob";

type TCreatePostProps = {
	user_id: string;
	recipe_name: string;
	file: string | null;
	accessToken: string;
};

export const createPost = createAsyncThunk(
	"post/createPost",
	async (
		{ recipe_name, user_id, file, accessToken }: TCreatePostProps,
		{ rejectWithValue }
	) => {
		try {
			const formData = new FormData();
			formData.append("recipe_name", recipe_name);
			formData.append("user_id", user_id);

			if (file) {
				formData.append("recipe_image", {
					uri: file,
					name: "post_image.jpg",
					type: "image/jpeg",
				} as any);
			}

			const res = await axios.post(
				`/user/${user_id}/recipe/${recipe_name}/create_post`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			console.log(res.data);
			Alert.alert(res.data.message);
			return res.data;
		} catch (error) {
			console.log(error);
			const resError = handleError(error);
			console.log("resError:");
			console.log(resError);
			return rejectWithValue(resError);
		}
	}
);

export const deletePost = createAsyncThunk(
	"post/deletePost",
	async (post_id: string, { rejectWithValue }) => {
		try {
			const res = await axios.delete(`/post/${post_id}/delete`);
			Alert.alert(res.data.message);
			return res.data;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError:", resError);
			return rejectWithValue(resError);
		}
	}
);

export const getPostById = createAsyncThunk(
	"post/getPostById",
	async (
		{ postId, user_id }: { postId: string | string[]; user_id: string },
		{ rejectWithValue }
	) => {
		try {
			const res = await axios.get(`/post/${postId}?user_id=${user_id}`);
			return res.data.post;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError:", resError);
			return rejectWithValue(resError);
		}
	}
);

export const getPosts = createAsyncThunk(
	"post/getPosts",
	async (userId: string, { rejectWithValue }) => {
		try {
			const res = await axios.get(`/posts?user_id=${userId}&limit=5`);
			return res.data.posts;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError:", resError);
			return rejectWithValue(resError);
		}
	}
);

export const getFilteredPosts = createAsyncThunk(
	"post/getFilteredPosts",
	async (
		{ filter, userId }: { userId: string; filter: string },
		{ rejectWithValue }
	) => {
		try {
			const res = await axios.get(`/posts/filtered`, {
				params: { filter, user_id: userId },
			});

			return res.data.posts;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError:", resError);
			return rejectWithValue(resError);
		}
	}
);

export const getUserPosts = createAsyncThunk(
	"post/getUserPosts",
	async (userId: string, { rejectWithValue }) => {
		try {
			const res = await axios.get(`/user/${userId}/posts`);
			return res.data.user_posts;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError:", resError);
			return rejectWithValue(resError);
		}
	}
);

export const getBookmarks = createAsyncThunk(
	"post/getBookmarks",
	async (userId: string, { rejectWithValue }) => {
		try {
			const res = await axios.get(`/user/${userId}/bookmarked_posts`);
			return res.data.bookmarked_posts;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError:", resError);
			return rejectWithValue(resError);
		}
	}
);

export const BookmarkPost = createAsyncThunk(
	"post/BookmarkPost",
	async (
		{ post_id, user_id }: { user_id: string; post_id: string },
		{ rejectWithValue }
	) => {
		try {
			const res = await axios.post(`/post/${post_id}/bookmark`, { user_id });
			return res.data;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError:", resError);
			return rejectWithValue(resError);
		}
	}
);

export const likeorunlikePost = createAsyncThunk(
	"post/likeorunlikePost",
	async (
		{ post_id, user_id }: { post_id: string; user_id: string },
		{ rejectWithValue }
	) => {
		try {
			const res = await axios.post(`/post/${post_id}/like`, {
				user_id,
			});
			return res.data;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError:", resError);
			return rejectWithValue(resError);
		}
	}
);

export const dislikeorundislikePost = createAsyncThunk(
	"post/dislikeorundislikePost",
	async (
		{ post_id, user_id }: { post_id: string; user_id: string },
		{ rejectWithValue }
	) => {
		try {
			const res = await axios.post(`/post/${post_id}/dislike`, {
				user_id,
			});
			return res.data;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError:", resError);
			return rejectWithValue(resError);
		}
	}
);

export const searchPostRecipe = createAsyncThunk(
	"post/searchPostRecipe",
	async (query: string, { rejectWithValue }) => {
		try {
			const res = await axios.get(`/post/search?query=${query}`);
			return res.data.searchPost;
		} catch (error) {
			const resError = handleError(error);
			console.log("resError:", resError);
			return rejectWithValue(resError);
		}
	}
);
