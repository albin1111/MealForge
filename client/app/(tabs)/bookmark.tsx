import Loading from "@/components/Loading";
import { handleRefresh } from "@/redux/actions/authActions";
import { AppDispatch, RootState } from "@/redux/store";
import { icons, images } from "@/constants";
import { Image, RefreshControl, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import StyledText from "@/components/StyledText";
import BookmarkFeed from "@/components/BookmarkUI/BookmarkFeed";
import { useColorScheme } from "nativewind";
import { router } from "expo-router";
import StyledPressable from "@/components/StyledPressable";

const bookmark = () => {
	const { colorScheme } = useColorScheme();

	const dispatch = useDispatch<AppDispatch>();
	const { pageLoading } = useSelector((state: RootState) => state.user);
	const { accessToken } = useSelector((state: RootState) => state.auth);

	const onRefresh = async () => {
		await dispatch(handleRefresh(accessToken));
	};

	if (pageLoading) return <Loading />;
	return (
		<ScrollView
			className="w-full bg-light dark:bg-dark "
			refreshControl={
				<RefreshControl refreshing={pageLoading} onRefresh={onRefresh} />
			}>
			<View className="p-4 ">
				{/* Header */}
				<View className="flex-row items-center justify-between w-full mt-6 ">
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
						onPress={() => router.push("/(user_screen)/Settings")}>
						<Image
							source={
								colorScheme === "dark"
									? icons.settingslightDark
									: icons.settingsDarkLight
							}
							resizeMode="contain"
							className="w-6 h-6"
						/>
					</StyledPressable>
				</View>

				<View className="flex-row items-center justify-between mt-3">
					<View className="flex-row items-center flex-1">
						<Image
							source={icons.bookmarkOrange}
							resizeMode="contain"
							className="w-6 h-6 mr-2"
						/>
						<StyledText className="flex-1 text-2xl font-chunk">
							My Bookmarks
						</StyledText>
					</View>
				</View>

				{/* Separator */}
				<View className="flex-1 h-px mt-1 rounded-full bg-light-border dark:bg-dark-border"></View>

				<BookmarkFeed />
			</View>
		</ScrollView>
	);
};
export default bookmark;
