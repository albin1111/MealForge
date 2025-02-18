import { RootState } from "@/redux/store";
import { Image, ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import StyledText from "../StyledText";
import StyledPressable from "../StyledPressable";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColors } from "@/constants/colors";
import { useColorScheme } from "nativewind";

const Posts = () => {
	const { colorScheme } = useColorScheme();
	const { NewGradientColor } = useThemeColors();
	const { post } = useSelector((state: RootState) => state.post);
	const { user } = useSelector((state: RootState) => state.user);

	if (!user) {
		return <StyledText>User is not found!</StyledText>;
	}

	return (
		<View className="flex-col w-full h-full p-2">
			{post.length > 0 ? (
				post.map(
					(item, i) =>
						item.user_id === user.id && (
							// Fix this
							<View
								key={i}
								className="w-full py-4 my-2 overflow-hidden bg-white border border-light-border dark:bg-dark-light dark:border-dark-border rounded-xl"
							>
								{item.recipe_post_image && (
									<View className="absolute top-0 left-0 w-full h-full">
										<Image
											source={{ uri: item.recipe_post_image }}
											resizeMode="cover"
											className="absolute w-full aspect-square"
											style={{ opacity: colorScheme === "dark" ? 0.4 : 0.4 }}
										/>
										<LinearGradient
											start={{ x: 0.3, y: 1 }}
											end={{ x: 1.5, y: 1 }}
											colors={NewGradientColor}
											className="absolute top-0 left-0 w-full aspect-square"
										/>
									</View>
								)}

								<StyledPressable
									size="link"
									className="px-4"
									onPress={() =>
										router.push(`/(home_screen)/user_post/${item.id}`)
									}>
									<StyledText type="heading-4" className="font-chunk">
										{item.recipe.name}
									</StyledText>
								</StyledPressable>

								<ScrollView
									horizontal
									showsHorizontalScrollIndicator={false}
									className="w-full">
									<View className="flex-row items-start justify-center px-4 w-full mt-2 space-x-1.5">
										{item.recipe.ingredients.split(",").map((ingredient, i) => (
											<StyledText
												key={i}
												className="px-3 py-1 text-sm border rounded-full bg-light border-light-border dark:border-dark-border dark:bg-dark w-max">
												{ingredient}
											</StyledText>
										))}
									</View>
								</ScrollView>

								<View className="flex-row items-center w-full px-4 mt-2">
									<View className="flex-row items-center">
										<StyledText className="flex font-psemibold">
											{item.total_likes}
										</StyledText>
										<StyledText
											className="flex ml-1"
											type="xs"
											fontStyle="light">
											Likes
										</StyledText>

										<StyledText className="mx-2 text-2xl">•</StyledText>

										<StyledText className="font-psemibold">0</StyledText>
										<StyledText className="ml-1" type="xs" fontStyle="light">
											Dislike
										</StyledText>
									</View>
								</View>
							</View>
						)
				)
			) : (
				<StyledText className="mx-auto my-4">No recipes added yet!</StyledText>
			)}
		</View>
	);
};
export default Posts;
