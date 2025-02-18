import Spin from "@/components/animations/Spin";
import Loading from "@/components/Loading";
import General from "@/components/SettingsUI/General";
import Preference from "@/components/SettingsUI/Preference";
import SecurityPrivacy from "@/components/SettingsUI/SecurityPrivacy";
import StyledPressable from "@/components/StyledPressable";
import StyledText from "@/components/StyledText";
import { icons } from "@/constants";
import { handleLogout, handleRefresh } from "@/redux/actions/authActions";
import { clearIngredients } from "@/redux/slices/ingredientsSlice";
import { setPost, setUserPost } from "@/redux/slices/postSlice";
import { setRecipe } from "@/redux/slices/recipeSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { router } from "expo-router";
import { Alert, Image, RefreshControl, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const Settings = () => {
	const { status, pageLoading, accessToken } = useSelector(
		(state: RootState) => state.auth
	);
	const dispatch = useDispatch<AppDispatch>();

	const logout = () => {
		dispatch(handleLogout(accessToken)).then((res) => {
			if (res.meta.requestStatus === "fulfilled") {
				dispatch(clearIngredients());
				dispatch(setRecipe([]));
				dispatch(setPost([]));
				dispatch(setUserPost([]));
				Alert.alert(res.payload.message);
				router.push("/(auth)/login");
			} else {
				Alert.alert("Logout failed.");
			}
		});
	};

	const onRefresh = async () => {
		await dispatch(handleRefresh(accessToken));
	};

	if (pageLoading) return <Loading />;

	return (
		<ScrollView
			contentContainerStyle={{ flexGrow: 1 }}
			className="w-full h-screen bg-light dark:bg-dark"
			refreshControl={
				<RefreshControl refreshing={pageLoading} onRefresh={onRefresh} />
			}>
			<View className="flex-col w-full h-full px-4 pb-4">
				<StyledText type="heading-3" className="pt-4 pb-4">
					General
				</StyledText>
				<General />

				<StyledText type="heading-3" className="pt-8 pb-4">
					UI Preferences
				</StyledText>
				<Preference />

				<StyledText type="heading-3" className="pt-8 pb-4">
					Privacy & Security
				</StyledText>
				<SecurityPrivacy />

				<StyledPressable
					onPress={logout}
					size="xl"
					className={`flex-row items-center justify-start w-full mt-16 px-6 h-max ${
						status === "pending" ? "bg-red-600/50" : "bg-red-600"
					}`}>
					{status === "pending" ? (
						<Spin loading={status === "pending"} size="md" />
					) : (
						<Image
							source={icons.logout}
							resizeMode="contain"
							className="w-6 h-6"
						/>
					)}
					<StyledText className="ml-3 text-white">
						{status === "pending" ? "Logging Out..." : "Log Out"}
					</StyledText>
				</StyledPressable>
			</View>
		</ScrollView>
	);
};
export default Settings;
