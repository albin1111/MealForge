import { useColorScheme } from "nativewind";
import icons from "./icons";

export const useThemeColors = () => {
	const { colorScheme } = useColorScheme();

	const colors = {
		// icons
		// dark: "#201D1C",
		// light: "#BBA78D",

		main: "#B25A1C", //orange
		main50: "#FFEDD5", // light yellowish, text/icon color in dark mode
		mainLight: "#BBA78D", // more yellowish

		dark: "#151210", // eto main dark color natin, main bg, text/icon color in light mode
		darkLight: "#201D1C", // used in gradient, main content bg
		darkBorder: "#272626",

		light: "#F6F6F6", // darker shade pang bg
		white: "#ffffff", // white na main light color, main content bg
		lightBorder: "#E0E0E0",
		lightDark: "#E7E7E7", // mas darker shade

		gray: "#3A3A3A", // dark mode placeholder, light mode input focus border
		grayLight: "#a4a4a4", // light mode placeholder
	};

	const gradientColor =
		colorScheme === "light"
			? [colors.light, colors.white]
			: [colors.dark, colors.darkLight];

	// Gradient color with transparent on the right
	const NewGradientColor =
		colorScheme === "light"
			? [colors.light, "rgba(255, 255, 255, 0)"] // light to transparent
			: [colors.darkLight, "rgba(21, 18, 16, 0)"]; // dark to transparent

	const logoImage = colorScheme === "dark" ? icons.logo_light : icons.logo_dark;
	const textColor = colorScheme === "light" ? colors.dark : colors.main50;
	const tabColor = colorScheme === "light" ? colors.white : colors.darkLight;
	const inActiveColor =
		colorScheme === "light" ? colors.darkLight : colors.mainLight;
	const statusColor = colorScheme === "light" ? colors.dark : colors.light;
	const borderColor =
		colorScheme === "light" ? colors.lightBorder : colors.darkBorder;
	const inputBgColor =
		colorScheme === "light" ? colors.white : colors.darkLight;
	const placeholderColor =
		colorScheme === "light" ? colors.grayLight : colors.gray;

	return {
		inActiveColor,
		gradientColor,
		logoImage,
		textColor,
		statusColor,
		tabColor,
		placeholderColor,
		borderColor,
		inputBgColor,
		NewGradientColor,
	};
};
