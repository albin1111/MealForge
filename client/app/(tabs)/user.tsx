import Loading from "@/components/Loading";
import StyledPressable from "@/components/StyledPressable";
import StyledText from "@/components/StyledText";
import Posts from "@/components/UserTabUI/Posts";
import Recipes from "@/components/UserTabUI/Recipes";
import { icons, images } from "@/constants";
import { handleRefresh } from "@/redux/actions/authActions";
import { handleGetUserRecipes } from "@/redux/actions/recipeAction";
import { RootState, AppDispatch } from "@/redux/store";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { Dispatch, useEffect, useState } from "react";
import { Alert, Image, RefreshControl, ScrollView, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";

const user = () => {
	const { colorScheme } = useColorScheme();
	const dispatch = useDispatch<AppDispatch>();
	const [selectedTab, setSelectedTab] = useState("recipes");

	const { user } = useSelector((state: RootState) => state.user);
	const { recipe } = useSelector((state: RootState) => state.recipe);
	const { pageLoading, accessToken } = useSelector(
		(state: RootState) => state.auth
	);
	const onRefresh = async () => {
		await dispatch(handleRefresh(accessToken));
	};
	useEffect(() => {
		if (!user) return Alert.alert("user is not found!");

		if (
			(selectedTab === "recipes" && pageLoading) ||
			(selectedTab === "recipes" && (!recipe || recipe.length === 0))
		) {
			dispatch(handleGetUserRecipes(user?.id));
		}
	}, [selectedTab, pageLoading]);

	if (pageLoading) return <Loading />;
	return (
		<>
			<ScrollView
				// contentContainerStyle={{ flex: 1 }}
				className="w-full h-full bg-light dark:bg-dark"
				refreshControl={
					<RefreshControl refreshing={pageLoading} onRefresh={onRefresh} />
				}>
				<View className="flex-col w-full h-full p-2">
					<UserHeader />
					<UserInfo />
					<UserTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

					{selectedTab === "recipes" && <Recipes />}
					{selectedTab === "posts" && <Posts />}
				</View>
			</ScrollView>
			{/* Generate Recipe Button */}
			<StyledPressable
				size="icon"
				onPress={() => router.push("/(user_screen)/GenerateRecipe")}
				className="absolute rounded-full bottom-5 right-5 bg-main">
				<Image
					source={colorScheme === "light" ? icons.plusWhite : icons.plus}
					resizeMode="contain"
					className="w-12 h-12 rounded-full"
				/>
			</StyledPressable>
		</>
	);
};
export default user;

const UserHeader = () => {
	const { colorScheme } = useColorScheme();
	const { user } = useSelector((state: RootState) => state.user);
	return (
		<View className="flex-row items-start p-2 mt-6 mb-4">
			<View className="my-auto border rounded-xl border-light-border dark:border-dark-border">
				<Image
					source={
						user?.profile_picture_url
							? { uri: user.profile_picture_url }
							: images.loading_light
					}
					resizeMode="cover"
					className="w-[150px] h-[150px] rounded-xl"
				/>
			</View>

			<View className="flex-1 ml-4">
				<StyledText className="font-chunk" type="heading-3">
					{user?.firstName}
				</StyledText>
				<StyledText className="font-chunk" type="heading-3">
					{user?.lastName}
				</StyledText>
				<StyledText type="label" className="text-main">
					@{user?.userName}
				</StyledText>

				<View className="flex-row justify-between flex-1 mt-4">
					<StyledPressable
						size="text"
						onPress={() => router.push("/(user_screen)/EditInformation")}
						className="flex-row items-end">
						<Image
							source={
								colorScheme === "dark"
									? icons.editLightDark
									: icons.editDarkLight
							}
							resizeMode="contain"
							className="w-6 h-6 mr-1"
						/>
					</StyledPressable>
					<StyledPressable
						size="text"
						onPress={() => router.push("/(user_screen)/Settings")}
						className="justify-end">
						<Image
							source={
								colorScheme === "light"
									? icons.settingsDarkLight
									: icons.settingslightDark
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

const UserInfo = () => {
	const { ingredients } = useSelector((state: RootState) => state.ingredients);
	const { recipe } = useSelector((state: RootState) => state.recipe);
	const { post } = useSelector((state: RootState) => state.post);
	const { user } = useSelector((state: RootState) => state.user);
	const [totalLikes, setTotalLikes] = useState(0);

	useEffect(() => {
		if (user) {
			post.map((item) => {
				setTotalLikes((prev) =>
					item.user_id === user.id ? prev + item.total_likes : prev + 0
				);
			});
		}
	}, []);

	return (
		<View className="flex-row items-center p-4 mx-2 bg-white border rounded-xl border-light-border dark:border-dark-border dark:bg-dark-light">
			<View className="flex-col items-center flex-grow basis-1/3">
				<StyledText type="paragraph" className="font-chunk">
					{ingredients && ingredients.length}
				</StyledText>
				<StyledText type="label" fontStyle="light">
					Ingredients
				</StyledText>
			</View>

			<View className="flex-col items-center flex-grow basis-1/3">
				<StyledText type="paragraph" className="font-chunk">
					{recipe && recipe.length}
				</StyledText>
				<StyledText type="label" fontStyle="light">
					Recipes
				</StyledText>
			</View>

			<View className="flex-col items-center flex-grow basis-1/3">
				<StyledText type="paragraph" className="font-chunk">
					{totalLikes}
				</StyledText>
				<StyledText type="label" fontStyle="light">
					Likes
				</StyledText>
			</View>
		</View>
	);
};

type UserTabsProps = {
	selectedTab: string;
	setSelectedTab: Dispatch<string>;
};

const UserTabs: React.FC<UserTabsProps> = ({ selectedTab, setSelectedTab }) => {
	return (
		<View className="flex-row px-4 mt-2">
			<StyledPressable
				onPress={() => setSelectedTab("recipes")}
				className={`basis-1/2 rounded-none ${
					selectedTab === "recipes"
						? "border-b  border-main opacity-100"
						: "opacity-60"
				}`}>
				<StyledText className="">My Recipes</StyledText>
			</StyledPressable>
			<StyledPressable
				onPress={() => setSelectedTab("posts")}
				className={`basis-1/2 rounded-none ${
					selectedTab === "posts"
						? "border-b  border-main opacity-100"
						: "opacity-60"
				}`}>
				<StyledText className="">My Posts</StyledText>
			</StyledPressable>
		</View>
	);
};
