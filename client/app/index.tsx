import { useColorScheme } from "nativewind";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import StyledText from "@/components/StyledText";
import ThemeButton from "@/components/ThemeButton";
import StyledPressable from "@/components/StyledPressable";
import { Redirect, router } from "expo-router";
import { useThemeColors } from "../constants/colors";
import { StatusBar } from "expo-status-bar";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import Circle from "@/components/Circle";

const index = () => {
	const { gradientColor, logoImage } = useThemeColors();
	const { colorScheme } = useColorScheme();
	const { refreshToken, accessToken, pageLoading } = useSelector(
		(state: RootState) => state.auth
	);

	if (refreshToken && accessToken && !pageLoading) {
		console.log("Redirect");
		return <Redirect href={"/(tabs)/home"} />;
	}

	return (
		<>
			{colorScheme === "dark" ? (
				<StatusBar style="light"></StatusBar>
			) : (
				<StatusBar style="dark"></StatusBar>
			)}

			{colorScheme === "dark" ? (
				<LinearGradient
					start={{ x: 0.9, y: 0.1 }}
					colors={gradientColor}
					className="absolute top-0 left-0 w-full h-full"
				/>
			) : null}

			<SafeAreaView className="relative w-full h-full bg-light dark:bg-transparent">
				<Circle position="bl" />

				{/* Main Container */}
				<View className="items-center justify-between w-full h-full p-8 pt-6 ">
					<View className="items-end justify-center w-full">
						<ThemeButton />
					</View>
					<View className="flex-1 w-full h-full">
						<View className="items-center justify-end w-full h-1/2">
							<Image
								source={logoImage}
								className="absolute w-[80%] max-w-[500px] h-[80%] max-h-[500px]"
								resizeMode="contain"
							/>
						</View>

						<View className="justify-center flex-1 w-full h-full pb-10">
							<StyledText
								type="subheading"
								fontStyle="default"
								className="text-center">
								Your AI-Powered
							</StyledText>
							<StyledText
								type="subheading"
								fontStyle="default"
								className="text-center">
								Recipe Crafting Companion.
							</StyledText>
						</View>
					</View>

					<StyledPressable
						size="xl"
						className="bg-main"
						onPress={() => router.push("/(auth)/login")}>
						<StyledText selectable={false} fontStyle="Chunk" type="button">
							Get Started
						</StyledText>
					</StyledPressable>
				</View>
			</SafeAreaView>
		</>
	);
};
export default index;
