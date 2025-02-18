import { View, RefreshControl, Image, ScrollView } from "react-native";
import React, { useState } from "react";
import Loading from "@/components/Loading";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { handleRefresh } from "@/redux/actions/authActions";
import { icons, images } from "@/constants";
import StyledPressable from "@/components/StyledPressable";
import { useColorScheme } from "nativewind";
import StyledText from "@/components/StyledText";
import CreatePost from "@/components/modals/CreatePost";
import PostFeed from "@/components/HomeUI/PostFeed";
import SearchRecipe from "@/components/modals/SearchRecipe";
import DarkBgOverlay from "@/components/DarkBgOverlay";

const Home = () => {
	const [darkbg, setDarkBg] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const dispatch = useDispatch<AppDispatch>();
	const { user } = useSelector((state: RootState) => state.user);
	const { accessToken, pageLoading } = useSelector(
		(state: RootState) => state.auth
	);

	const onRefresh = async () => {
		await dispatch(handleRefresh(accessToken));
	};

	const onOpenModal = () => {
		setShowModal(true);
		setDarkBg(true);
	};

	const onClose = () => {
		setShowModal(false);
		setDarkBg(false);
	};

	if (pageLoading) return <Loading />;

	return (
		<>
			<ScrollView
				className="w-full bg-light dark:bg-dark "
				refreshControl={
					<RefreshControl refreshing={pageLoading} onRefresh={onRefresh} />
				}>
				<View className="p-4">
					{/* Navbar */}
					<HomeNav />

					{/* Header */}
					<View className="flex-row items-center justify-between px-2">
						<View className="flex-col flex-1">
							<StyledText type="xs">Welcome,</StyledText>
							<StyledText className="flex-1 text-2xl font-chunk">
								{user?.lastName}, {user?.firstName}!
							</StyledText>
						</View>
						<StyledPressable
							onPress={onOpenModal}
							size="icon"
							className="bg-main rounded-xl">
							<Image
								source={icons.plusWhite}
								resizeMode="contain"
								className="w-10 h-10"
							/>
						</StyledPressable>
					</View>

					<PostFeed />
				</View>
			</ScrollView>
			{darkbg && <DarkBgOverlay />}
			<CreatePost isVisible={showModal} onClose={onClose} />
		</>
	);
};

export default Home;

const HomeNav = () => {
	const { colorScheme } = useColorScheme();
	const [showSearch, setShowSearch] = useState(false);

	const onClose = () => {
		setShowSearch((prev) => !prev);
	};

	return (
		<>
			<View className="flex-row items-center justify-between w-full mt-6 mb-4">
				<Image
					source={
						colorScheme === "dark"
							? images.headerLogoLight
							: images.headerLogoDark
					}
					resizeMode="contain"
					className="w-[150px] h-[30px]"
				/>

				<StyledPressable
					size="icon"
					onPress={() => setShowSearch((prev) => !prev)}>
					<Image
						source={
							colorScheme === "dark"
								? icons.searchLightDark
								: icons.searchDarkLight
						}
						resizeMode="contain"
						className="w-6 h-6 rounded-full"
					/>
				</StyledPressable>
			</View>

			<SearchRecipe isVisible={showSearch} onClose={onClose} />
		</>
	);
};
