import { View, ScrollView, TouchableOpacity, Image } from "react-native";
import StyledText from "./StyledText";
import { Link } from "expo-router";
import { RecipePost } from "@/utils/types/post";
import BookmarkButton from "./BookmarkButton";
import LikeButton from "./LikeButton";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColors } from "@/constants/colors";
import { useColorScheme } from "nativewind";
import { icons } from "@/constants";

type TRecipePostCard = {
	recipe: RecipePost;
};
const RecipePostCard: React.FC<TRecipePostCard> = ({ recipe }) => {
	const { colorScheme } = useColorScheme();
	const { NewGradientColor } = useThemeColors();

	return (
		<View className="flex-1 w-full mt-4 overflow-hidden bg-white border border-light-border dark:bg-dark-light dark:border-dark-border rounded-xl">
			{recipe.recipe_post_image && (
				<View className="absolute top-0 left-0 w-full h-full">
					<Image
						source={{ uri: recipe.recipe_post_image }}
						resizeMode="cover"
						className="absolute w-full h-full"
						style={{ opacity: colorScheme === "dark" ? 0.4 : 0.4 }}
					/>
					<LinearGradient
						start={{ x: 0.3, y: 1 }}
						end={{ x: 1.5, y: 1 }}
						colors={NewGradientColor}
						className="absolute top-0 left-0 w-full h-full"
					/>
				</View>
			)}

			{/* Header */}
			<Link href={`/(home_screen)/post/${recipe.id}`} asChild>
				<TouchableOpacity>
					<View className="flex-col px-4 pt-4 rounded-t-xl ">
						<View className="flex-row justify-between flex-1 w-full">
							<StyledText type="heading-4" className="flex-1 font-chunk">
								{recipe.recipe.name}
							</StyledText>
						</View>

						<StyledText type="label" className="text-main">
							@{recipe.author}
						</StyledText>
					</View>
				</TouchableOpacity>
			</Link>

			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				className="w-full mt-4">
				<View className="flex-row items-start justify-center w-full px-4 space-x-2">
					{recipe.recipe.ingredients.split(",").map((item, i) => (
						<StyledText
							key={i}
							type="label"
							className="px-3 bg-light border border-light-border dark:border-dark-border dark:bg-dark py-1.5 rounded-full">
							{item}
						</StyledText>
					))}
				</View>
			</ScrollView>

			{/* Ratings */}
			<View className="flex-row items-center px-4 mt-4">
				{Array(5)
					.fill(parseFloat(parseFloat(recipe.avg_rating).toFixed(1)))
					.map((item, i) => (
						<Image
							key={i}
							source={
								i >= item
									? colorScheme === "dark"
										? icons.starLight
										: icons.starDark
									: icons.starOrange
							}
							resizeMode="contain"
							className="w-4 h-4 mx-0.5"
						/>
					))}
				<StyledText className="ml-1" type="xs">
					{`(${recipe.avg_rating ? recipe.avg_rating : 0} ratings)`}
				</StyledText>
			</View>
			{/* Footer */}
			<View className="px-3 pb-3">
				<LikeButton recipe={recipe} />
			</View>
		</View>
	);
};

export default RecipePostCard;
