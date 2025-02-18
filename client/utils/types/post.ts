export type RecipePost = {
	id: string;
	user_id: string;
	posted_at: Date;
	recipe_post_image: string | null;
	recipe: {
		id: string;
		name: string;
		ingredients: string;
		instruction: string;
		type_of_cuisine: string;
		nutrient_counts: string;
		serve_hot_or_cold: string;
		cooking_time: string | number;
		benefits: string;
		serve_for: string | number;
		difficulty: string;
		tags: string;
		allergens: string;
	};
	author: string;
	is_bookmarked: boolean;
	is_liked: boolean;
	total_likes: number;
	is_disliked: boolean;
	total_dislikes: number;
	avg_rating: string;
};
