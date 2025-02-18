import Spin from "@/components/animations/Spin";
import Loading from "@/components/Loading";
import StyledPressable from "@/components/StyledPressable";
import StyledText from "@/components/StyledText";
import { icons } from "@/constants";
import { deleteRecipe, getUserRecipe } from "@/redux/actions/recipeAction";
import { AppDispatch, RootState } from "@/redux/store";
import { TRecipe } from "@/utils/types/recipe";
import { router, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { Alert, Image } from "react-native";
import { ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const RecipePostPage = () => {
	const { id } = useLocalSearchParams();
	const { colorScheme } = useColorScheme();

	const [loading, setLoading] = useState(false);
	const [recipe, setRecipe] = useState<TRecipe | null>(null);

	const dispatch = useDispatch<AppDispatch>();
	const { status } = useSelector((state: RootState) => state.recipe);

	useEffect(() => {
		dispatch(getUserRecipe(id)).then((res) => {
			if (res.meta.requestStatus === "fulfilled") {
				setRecipe(res.payload);
			}
		});
	}, []);

	const handleDeleteRecipe = () => {
		setLoading(true);
		dispatch(deleteRecipe(id))
			.then((res) => {
				if (res.meta.requestStatus === "fulfilled") {
					Alert.alert(res.payload.message);
					router.back();
				}
			})
			.finally(() => {
				setLoading(false);
			});
	};

	if (status === "pending") return <Loading />;

	return (
		<ScrollView className="w-full p-4 bg-light dark:bg-dark">
			<View className="mb-8">
				{/* Header */}
				<View className="mx-2 mb-4">
					<View className="flex-row justify-between flex-1 w-full">
						<StyledText type="heading-4" className="flex-1 text-2xl font-chunk">
							{recipe?.name}
						</StyledText>
					</View>
				</View>

				{/* Separator */}
				<View className="flex-1 h-px mx-2 mb-6 rounded-full bg-light-border dark:bg-dark-border"></View>

				{/* Infos */}
				<View className="mb-4">
					<StyledText type="subheading" className="px-2 mb-2 font-chunk">
						Recipe Information:
					</StyledText>

					<View className="flex-col flex-1 w-full px-4 py-4 bg-white border rounded-xl border-light-border dark:border-dark-border dark:bg-dark-light">
						<View className="flex-row flex-1">
							<View className="flex-col justify-between flex-1 space-y-4">
								{/* Servings */}
								<View className="flex-row w-full">
									<Image
										source={
											colorScheme === "light"
												? icons.usersDark
												: icons.usersLight
										}
										resizeMode="contain"
										className="mt-1 w-7 h-7"
									/>
									<View className="flex-1 w-full ml-3">
										<StyledText type="xs">Serve for: </StyledText>
										<StyledText type="paragraph" className="">
											{recipe?.serve_for}
											{recipe?.serve_for === 1 ? " person" : " people"}
										</StyledText>
									</View>
								</View>

								{/* Cooking time */}
								<View className="flex-row w-full">
									<Image
										source={
											colorScheme === "light" ? icons.timeDark : icons.timeLight
										}
										resizeMode="contain"
										className="mt-1 w-7 h-7"
									/>
									<View className="flex-1 w-full ml-3">
										<StyledText type="xs">Cooking time: </StyledText>
										<StyledText type="paragraph" className="">
											{recipe?.cooking_time}
											{recipe?.cooking_time === 1 ? " minute" : " minutes"}
										</StyledText>
									</View>
								</View>
							</View>

							<View className="flex-col justify-between flex-1 space-y-4">
								{/* Serve hot or cold */}
								<View className="flex-row w-full">
									<Image
										source={
											colorScheme === "light" ? icons.tempDark : icons.tempLight
										}
										resizeMode="contain"
										className="mt-1 w-7 h-7"
									/>
									<View className="flex-1 w-full ml-3">
										<StyledText type="xs">Serve in: </StyledText>
										<StyledText type="paragraph" className="">
											{recipe?.serve_hot_or_cold}{" "}
										</StyledText>
									</View>
								</View>

								{/* Cuisine type */}
								<View className="flex-row w-full">
									<Image
										source={
											colorScheme === "light"
												? icons.cuisineTypeDark
												: icons.cuisineTypeLight
										}
										resizeMode="contain"
										className="mt-1 w-7 h-7"
									/>
									<View className="flex-1 w-full ml-3">
										<StyledText type="xs">Cuisine type: </StyledText>
										<StyledText type="paragraph" className="">
											{recipe?.type_of_cuisine}
										</StyledText>
									</View>
								</View>
							</View>
						</View>

						{/* Difficulty */}
						<View className="flex-row flex-1 w-full pt-4">
							<Image
								source={
									colorScheme === "light" ? icons.diffDark : icons.diffLight
								}
								resizeMode="contain"
								className="w-5 h-5 mx-1 mt-1"
							/>
							<View className="flex-1 w-full ml-3">
								<StyledText type="xs">Difficulty: </StyledText>
								<StyledText type="paragraph" className="">
									{recipe?.difficulty}{" "}
								</StyledText>
							</View>
						</View>
					</View>
				</View>

				{/* Tags */}
				<View className="mb-4">
					<StyledText type="subheading" className="px-2 mb-2 font-chunk">
						Tags:
					</StyledText>
					<View className="flex-row flex-wrap w-full p-2 bg-white border rounded-xl border-light-border dark:border-dark-border dark:bg-dark-light">
						{recipe?.tags.split(",").map((itemIngredients, i) => (
							<StyledText
								key={i}
								type="xs"
								className="px-3 bg-light border border-light-border dark:border-dark-border dark:bg-dark py-1.5 rounded-full m-1">
								{itemIngredients}
							</StyledText>
						))}
					</View>
				</View>

				{/* Ingredients */}
				<View className="mb-4">
					<StyledText type="subheading" className="px-2 mb-2 font-chunk">
						Ingredients:
					</StyledText>
					<View className="w-full px-6 py-4 space-y-2 bg-white border rounded-xl border-light-border dark:border-dark-border dark:bg-dark-light">
						{recipe?.ingredients.split(",").map((item, i) => (
							<StyledText key={i} type="paragraph" className="">
								• {item.split("|")[0]} {item.split("|")[1]}
							</StyledText>
						))}
					</View>
				</View>

				{/* Instructions */}
				<View className="mb-4">
					<StyledText type="subheading" className="px-2 mb-2 font-chunk">
						Instructions:
					</StyledText>
					<View className="w-full px-6 py-4 space-y-6 bg-white border rounded-xl border-light-border dark:border-dark-border dark:bg-dark-light">
						{recipe?.instruction.split("|").map(
							(item, i) =>
								item && ( // Check to ignore any empty strings from the split
									<StyledText key={i} type="paragraph">
										• {item.trim()}
									</StyledText>
								)
						)}
					</View>
				</View>

				{/* Nutrients */}
				<View className="mb-4">
					<StyledText type="subheading" className="px-2 mb-2 font-chunk">
						Nutrients:
					</StyledText>
					<View className="w-full px-6 py-4 space-y-2 bg-white border rounded-xl border-light-border dark:border-dark-border dark:bg-dark-light">
						{recipe?.nutrient_counts.split(",").map((item, i) => (
							<StyledText key={i} type="paragraph" className="">
								• {item}
							</StyledText>
						))}
					</View>
				</View>

				{/* Allergens */}
				<View className="mb-4">
					<StyledText type="subheading" className="px-2 mb-2 font-chunk">
						Allergens:
					</StyledText>
					<View className="w-full px-6 py-4 space-y-2 bg-white border rounded-xl border-light-border dark:border-dark-border dark:bg-dark-light">
						{recipe?.allergens.split(",").map((item, i) => (
							<StyledText key={i} type="paragraph" className="">
								• {item}
							</StyledText>
						))}
					</View>
				</View>

				{/* Leftover Recommendations */}
				<View>
					<StyledText type="subheading" className="px-2 mb-2 font-chunk">
						Leftover Recommendations:
					</StyledText>
					<View className="w-full px-6 py-4 space-y-2 bg-white border rounded-xl border-light-border dark:border-dark-border dark:bg-dark-light">
						{recipe?.leftover_recommendations.split("|").map((item, i) => (
							<StyledText key={i} type="paragraph" className="">
								• {item}
							</StyledText>
						))}
					</View>
				</View>

				<StyledPressable
					disabled={loading}
					size="xl"
					className="w-full mt-4 bg-red-500"
					onPress={handleDeleteRecipe}>
					{loading ? (
						<Spin size="sm" loading={loading} />
					) : (
						<StyledText className="text-white">Delete Recipe</StyledText>
					)}
				</StyledPressable>
			</View>
		</ScrollView>
	);
};

export default RecipePostPage;
