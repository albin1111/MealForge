import { icons, images } from "@/constants";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { Image, View } from "react-native";
import StyledPressable from "../StyledPressable";
const Header = () => {
	const { colorScheme } = useColorScheme();

	return (
		<View className="flex-row items-center justify-between w-full p-4 mt-6">
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
	);
};
export default Header;
