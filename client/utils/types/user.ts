import z from "zod";

export const UserLoginSchema = z.object({
	email: z.string().email(),
	password: z
		.string()
		.min(6, "Password should atleast more than 6 characters."),
});

export const UserSignupSchema = z.object({
	userName: z.string().min(2, "Required"),
	firstName: z.string().min(2, "Required"),
	lastName: z.string().min(2, "Required"),
	email: z.string().email(),
	password: z
		.string()
		.min(6, "Password should atleast more than 6 characters."),
});

export const EditInfoSchema = z.object({
	userName: z.string().min(2, "Required"),
	firstName: z.string().min(2, "Required"),
	lastName: z.string().min(2, "Required"),
	email: z.string().email({ message: "Required" }),
});

export const ChangePasswordSchema = z
	.object({
		currentPassword: z.string(),
		retypeCurrentPassword: z.string(),
		newPassword: z
			.string()
			.min(6, "Password should atleast more than 6 characters."),
	})
	.refine((data) => data.currentPassword === data.retypeCurrentPassword, {
		message: "Password doesn't match!",
		path: ["retypeCurrentPassword"],
	});

export const UserSpecificationSchema = z.object({
	height: z.string().min(1, "Required"),
	weight: z.string().min(1, "Required"),
	age: z.string().min(1, "Required"),
	gender: z.string().min(1, "Required"),
});

export type TUserLogin = z.infer<typeof UserLoginSchema>;
export type TUserSignup = z.infer<typeof UserSignupSchema>;
export type TEditUser = z.infer<typeof EditInfoSchema>;
export type TChangePassword = z.infer<typeof ChangePasswordSchema>;
export type TUserSpecification = z.infer<typeof UserSpecificationSchema>;

export type TUser = {
	id: string;
	firstName: string;
	lastName: string;
	userName: string;
	email: string;
	allergies: string;
	height: string;
	weight: string;
	age: string;
	gender: string;
	profile_picture_url: string | null;

	ingredients: {
		id: string;
		name: string;
		measurements: string;
		expirationDate: string | null;
		date_added: string | null;
	}[];

	recipes: {
		id: string;
		name: string;
		instruction: string;
		type_of_cuisine: string;
		nutrient_counts: string;
		serve_hot_or_cold: string;
		cooking_time: string;
		benefits: string | null;
		serve_for: string;
		user_id: string;
		ingredients: string;
	}[];

	recipePosts: {
		id: string;
		recipe_id: string;
		user_id: string;
		posted_at: string;
		recipe: {
			id: string;
			name: string;
			instruction: string;
			type_of_cuisine: string;
			nutrient_counts: string;
			serve_hot_or_cold: string;
			cooking_time: string;
			benefits: string | null;
			serve_for: string;
			user_id: string;
			ingredients: string;
		};
		likes: TLike[];
	}[];
} | null;

export type TLike = {
	id: string;
	user_id: string;
	post_id: string;
	liked_at: string;
};
