import DarkBgOverlay from "@/components/DarkBgOverlay";
import LikeButton from "@/components/LikeButton";
import Loading from "@/components/Loading";
import RateRecipe from "@/components/modals/RateRecipe";
import StyledPressable from "@/components/StyledPressable";
import StyledText from "@/components/StyledText";
import { icons } from "@/constants";
import { getPostById } from "@/redux/actions/postAction";
import { AppDispatch, RootState } from "@/redux/store";
import { RecipePost } from "@/utils/types/post";
import { router, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import { Fragment, useEffect, useState } from "react";
import { Alert, Image } from "react-native";
import { ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const RecipePostPage = () => {
	const { id } = useLocalSearchParams();
	const [post, setPost] = useState<RecipePost | null>(null);
	const [darkbg, setDarkbg] = useState<boolean>(false);
	const [showRate, setShowRate] = useState<boolean>(false);

	const dispatch = useDispatch<AppDispatch>();
	const { status } = useSelector((state: RootState) => state.post);
	const { user } = useSelector((state: RootState) => state.user);
	const { colorScheme } = useColorScheme();

	const handleShowRate = () => {
		setShowRate((prev) => !prev);
		setDarkbg(true);
	};

	const onClose = () => {
		setDarkbg(false);
		setShowRate(false);
	};

	useEffect(() => {
		if (!user) {
			Alert.alert("No user is found!");
			return router.back();
		}
		dispatch(getPostById({ postId: id, user_id: user.id })).then((res) => {
			if (res.meta.requestStatus === "fulfilled") {
				setPost(res.payload);
			}
		});
	}, []);

	if (status === "pending") return <Loading />;

	if (!post) {
		return (
			<ScrollView className="w-full p-4 bg-light dark:bg-dark">
				<View className="flex-col items-center">
					<StyledText className="text-red-500">No Post is found!</StyledText>
				</View>
			</ScrollView>
		);
	}
	return (
		<Fragment>
			<ScrollView className="w-full p-4 bg-light dark:bg-dark">
				<View className="mb-8">
					<View className="flex-row items-center justify-between mb-4 ">
						<View className="flex-row items-center ">
							{Array(5)
								.fill(parseFloat(parseFloat(post.avg_rating).toFixed(1)))
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
										className="w-5 h-5 mx-0.5"
									/>
								))}
							<StyledText className="ml-1" type="xs">
								{`(${post.avg_rating ? post.avg_rating : 0} ratings)`}
							</StyledText>
						</View>
						<StyledPressable size="icon" onPress={handleShowRate}>
							<StyledText className="ml-2">Rate</StyledText>
						</StyledPressable>
					</View>

					{post.recipe_post_image && (
						<View className="w-full h-[150px] mb-4">
							<Image
								source={{ uri: post.recipe_post_image }}
								resizeMode="cover"
								className="object-center w-full h-full rounded-xl"
							/>
						</View>
					)}

					{/* Recipe name */}
					<View className="mx-2">
						<View className="flex-row justify-between flex-1 w-full">
							<StyledText type="heading-4" className="flex-1 font-chunk">
								{post?.recipe.name}
							</StyledText>
						</View>

						<StyledText type="label" className="text-main">
							@{post?.author}
						</StyledText>
					</View>

					{/* like/dislike */}
					<View className="flex-row items-center mb-4">
						<LikeButton recipe={post} />
					</View>

					{/* Separator */}
					<View className="flex-1 h-px mx-2 mb-6 rounded-full bg-light-border dark:bg-dark-border"></View>

					{/* Recipe Information */}
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
												{post.recipe?.serve_for}
												{post.recipe?.serve_for === 1 ? " person" : " people"}
											</StyledText>
										</View>
									</View>

									{/* Cooking time */}
									<View className="flex-row w-full">
										<Image
											source={
												colorScheme === "light"
													? icons.timeDark
													: icons.timeLight
											}
											resizeMode="contain"
											className="mt-1 w-7 h-7"
										/>
										<View className="flex-1 w-full ml-3">
											<StyledText type="xs">Cooking time: </StyledText>
											<StyledText type="paragraph" className="">
												{post.recipe?.cooking_time}
												{post.recipe?.cooking_time === 1
													? " minute"
													: " minutes"}
											</StyledText>
										</View>
									</View>
								</View>

								<View className="flex-col justify-between flex-1 space-y-4">
									{/* Serve hot or cold */}
									<View className="flex-row w-full">
										<Image
											source={
												colorScheme === "light"
													? icons.tempDark
													: icons.tempLight
											}
											resizeMode="contain"
											className="mt-1 w-7 h-7"
										/>
										<View className="flex-1 w-full ml-3">
											<StyledText type="xs">Serve in: </StyledText>
											<StyledText type="paragraph" className="">
												{post?.recipe.serve_hot_or_cold}{" "}
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
												{post.recipe?.type_of_cuisine}
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
										{post.recipe?.difficulty}{" "}
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
							{post.recipe?.tags.split(",").map((itemIngredients, i) => (
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
							{post?.recipe.ingredients.split(",").map((item, i) => (
								<StyledText key={i} type="paragraph" className="">
									• {item}
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
							{post?.recipe.instruction.split("Step ").map(
								(item: string, i: number) =>
									item && ( // Check to ignore any empty strings from the split
										<StyledText key={i} type="paragraph">
											Step {item.trim()}
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
						<View className="w-full px-6 py-4 space-y-6 bg-white border rounded-xl border-light-border dark:border-dark-border dark:bg-dark-light">
							{post.recipe.nutrient_counts.split(",").map((item, i) => (
								<StyledText key={i} type="paragraph">
									• {item}
								</StyledText>
							))}
						</View>
					</View>

					{/* Allergens */}
					<View>
						<StyledText type="subheading" className="px-2 mb-2 font-chunk">
							Allergens:
						</StyledText>
						<View className="w-full px-6 py-4 space-y-2 bg-white border rounded-xl border-light-border dark:border-dark-border dark:bg-dark-light">
							{post.recipe?.allergens.split(",").map((item, i) => (
								<StyledText key={i} type="paragraph" className="">
									• {item}
								</StyledText>
							))}
						</View>
					</View>
				</View>
			</ScrollView>
			{darkbg && <DarkBgOverlay />}

			<RateRecipe isVisible={showRate} onClose={onClose} post_id={post.id} />
		</Fragment>
	);
};

export default RecipePostPage;
