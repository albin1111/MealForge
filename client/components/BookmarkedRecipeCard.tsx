import { Image, ScrollView, View } from "react-native";
import StyledText from "./StyledText";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import StyledPressable from "./StyledPressable";
import Spin from "./animations/Spin";
import { icons, images } from "@/constants";
import { RecipePost } from "@/utils/types/post";

type TRecipePostCard = {
	recipe: RecipePost;
};

const BookmarkedRecipeCard: React.FC<TRecipePostCard> = ({ recipe }) => {
	const { colorScheme } = useColorScheme();
	const [loading, setLoading] = useState(false);
	return (
		<View className="w-full p-4 mt-4 bg-white border border-light-border dark:bg-dark-light dark:border-dark-border rounded-xl">
			{/* Header */}
			<View className="flex-col">
				<View className="flex-row items-center justify-between w-full">
					<StyledText type="heading-4" className="font-chunk">
						{recipe.recipe.name}
					</StyledText>
					<StyledPressable onPress={() => setLoading(!loading)} size="icon">
						{loading ? (
							<Spin size="md" loading={loading} />
						) : (
							<Image
								source={
									colorScheme === "dark"
										? icons.bookmarkLightDark
										: icons.bookmarkDarkLight
								}
								resizeMode="contain"
								className="w-6 h-6"
							/>
						)}
					</StyledPressable>
				</View>
				<StyledText type="label" className="text-main">
					@{recipe.author}
				</StyledText>
			</View>

			{/* Body */}
			<View className="flex-col w-full mt-4 border rounded-xl border-dark-light/10 dark:border-dark-border">
				<Image
					source={images.adobo}
					resizeMode="cover"
					className="w-full h-[150px] rounded-t-xl object-center"
				/>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					className="w-full">
					<View className="flex-row items-start justify-center w-full px-1 pt-2 pb-1">
						{recipe.recipe.ingredients.split(",").map((item, i) => (
							<StyledText
								key={i}
								type="label"
								className="px-3 bg-light-dark dark:bg-dark py-1.5 mx-0.5 rounded-full w-max ">
								{item}
							</StyledText>
						))}
					</View>
				</ScrollView>

				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					className="w-full">
					<View className="flex-row items-start justify-center w-full px-1 pt-1 pb-2">
						{[recipe.recipe.nutrient_counts.split(",")].map((item, i) => (
							<StyledText
								key={i}
								type="label"
								className="w-max bg-light-dark dark:bg-dark px-3 py-1.5 rounded-full mx-0.5 ">
								{item}
							</StyledText>
						))}
					</View>
				</ScrollView>
			</View>

			{/* Footer */}
			<View className="flex-row items-center justify-between w-full px-2 pt-4 pb-0 ">
				<StyledPressable size="text" className="flex-row items-center">
					<StyledText className="flex font-psemibold">
						{recipe.total_likes}
					</StyledText>
					<StyledText className="flex ml-1" type="label" fontStyle="light">
						{recipe.total_likes === 1 ? "Like" : "Likes"}
					</StyledText>

					<StyledText className="mx-2 text-2xl ">•</StyledText>

					<StyledText className="font-psemibold">0</StyledText>
					<StyledText className="ml-1" type="label" fontStyle="light">
						{recipe.total_dislikes === 1 ? "Dislike" : "Dislikes"}
					</StyledText>
				</StyledPressable>

				<View className="flex-row items-center space-x-2">
					<StyledPressable size="icon">
						<Image
							source={
								colorScheme === "dark"
									? icons.likesLightDark
									: icons.likesDarkLight
							}
							resizeMode="contain"
							className="w-6 h-6"
						/>
					</StyledPressable>
					<StyledPressable size="icon">
						<Image
							source={
								colorScheme === "dark"
									? icons.unlikesLightDark
									: icons.unlikesDarkLight
							}
							resizeMode="contain"
							className="w-6 h-6"
						/>
					</StyledPressable>
				</View>
			</View>
		</View>
	);
};

export default BookmarkedRecipeCard;
