import { icons } from "@/constants";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { Image, View } from "react-native";
import StyledText from "../StyledText";
import StyledPressable from "../StyledPressable";

const General = () => {
	const { colorScheme } = useColorScheme();

	return (
		<View className="flex-col w-full px-6 bg-white rounded-lg h-max dark:bg-dark-light">
			<StyledPressable
				onPress={() => router.push("/(user_screen)/EditInformation")}
				size="xl"
				className={`flex-row items-center rounded-none justify-between py-4 border-b border-light-border dark:border-dark-border`}>
				<View className="flex-row items-center">
					<Image
						source={
							colorScheme === "dark" ? icons.editLightDark : icons.editDarkLight
						}
						resizeMode="contain"
						className="w-6 h-6"
					/>
					<StyledText className="ml-3 text-base">Edit Information</StyledText>
				</View>
				<Image
					source={
						colorScheme === "dark"
							? icons.chevronRightLight
							: icons.chevronRightDarkLight
					}
					resizeMode="cover"
					className="w-7 h-7"
				/>
			</StyledPressable>
			<StyledPressable
				onPress={() => router.push("/(user_screen)/UserPreferences")}
				size="xl"
				className={`flex-row items-center rounded-none justify-between py-4 `}>
				<View className="flex-row items-center">
					<Image
						source={colorScheme === "dark" ? icons.userLight : icons.userDark}
						resizeMode="contain"
						className="w-6 h-6"
					/>
					<StyledText className="ml-3 text-base">User Preferences</StyledText>
				</View>
				<Image
					source={
						colorScheme === "dark"
							? icons.chevronRightLight
							: icons.chevronRightDarkLight
					}
					resizeMode="cover"
					className="w-7 h-7"
				/>
			</StyledPressable>
		</View>
	);
};
export default General;
