import { icons } from "@/constants";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { Image, View } from "react-native";
import StyledText from "../StyledText";
import StyledPressable from "../StyledPressable";

const Preference = () => {
	const { colorScheme } = useColorScheme();

	return (
		<View className="flex-col w-full px-6 bg-white rounded-lg h-max dark:bg-dark-light">
			<StyledPressable
				onPress={() => router.push("/(user_screen)/Theme")}
				size="xl"
				className={`flex-row items-center justify-between py-4 `}>
				<View className="flex-row items-center">
					<Image
						source={
							colorScheme === "dark" ? icons.moonLightDark : icons.moonDarkLight
						}
						resizeMode="contain"
						className="w-6 h-6"
					/>
					<StyledText className="ml-3 text-base">Theme</StyledText>
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
export default Preference;
