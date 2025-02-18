import { styled, useColorScheme } from "nativewind";
import { Image, Pressable, View } from "react-native";
import { icons } from "@/constants";

const StyledPressable = styled(Pressable);
const ThemeButton = () => {
	const { colorScheme, toggleColorScheme } = useColorScheme();

	const icon = colorScheme === "dark" ? icons.moon : icons.sun;

	return (
		<StyledPressable onPress={toggleColorScheme} className="">
			<View className="">
				<Image className="w-8 h-8" resizeMode="contain" source={icon}></Image>
			</View>
		</StyledPressable>
	);
};
export default ThemeButton;
