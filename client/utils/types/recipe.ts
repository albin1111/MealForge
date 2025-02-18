import { z } from "zod";

export type TRecipe = {
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
	leftover_recommendations: string;
};

export const NewRecipeSchema = z.object({
	main_ingredients: z
		.array(z.string().min(1, "Ingredient name cannot be empty"))
		.min(1, "At least one main ingredient is required"),
	seasonings: z
		.array(z.string().min(1, "Seasoning name cannot be empty"))
		.min(2, "At least two seasonings are required"),
	serve_for: z.string().min(1, { message: "Server for cannot be empty" }),
});

export type TNewRecipe = z.infer<typeof NewRecipeSchema>;
