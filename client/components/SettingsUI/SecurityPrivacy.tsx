import { icons } from "@/constants";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { Image, View } from "react-native";
import StyledText from "../StyledText";
import StyledPressable from "../StyledPressable";

const SecurityPrivacy = () => {
	const { colorScheme } = useColorScheme();

	return (
		<View className="flex-col w-full px-6 bg-white rounded-lg h-max dark:bg-dark-light">
			<StyledPressable
				onPress={() => router.push("/(user_screen)/ChangePassword")}
				size="xl"
				className={`flex-row items-center rounded-none justify-between py-4 border-b border-light-border dark:border-dark-border`}>
				<View className="flex-row items-center">
					<Image
						source={
							colorScheme === "dark" ? icons.lockLightDark : icons.lockDarkLight
						}
						resizeMode="contain"
						className="w-6 h-6"
					/>
					<StyledText className={`ml-3 text-base `}>Change Password</StyledText>
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
				onPress={() => router.push("/(user_screen)/ChangePassword")}
				size="xl"
				className={`flex-row items-center rounded-none justify-between py-4 text-rose-500`}>
				<View className="flex-row items-center">
					<Image
						source={icons.userDelete}
						resizeMode="contain"
						className="w-6 h-6"
					/>
					<StyledText className={`ml-3 text-base text-rose-500`}>
						Account Deletion
					</StyledText>
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
export default SecurityPrivacy;
