import {
	View,
	TextInput,
	TextProps,
	Image,
	KeyboardTypeOptions,
} from "react-native";
import React, { useState } from "react";
import StyledText from "./StyledText";
import { useThemeColors } from "@/constants/colors";
import { useColorScheme } from "nativewind";
import { icons } from "@/constants";
import StyledPressable from "./StyledPressable";

type Props = TextProps & {
	title?:
		| "default"
		| "Email"
		| "Password"
		| "Username"
		| "Firstname"
		| "Lastname"
		| string;
	handleTextChange?: ((text: string) => void) | undefined;
	value: string;
	error?: string;
	keyboardType?: KeyboardTypeOptions;
};

const StyledTextInput = ({
	title = "default",
	handleTextChange,
	value,
	error,
	keyboardType = "default",
}: Props) => {
	const [showPassword, setShowPassword] = useState(false);
	const { placeholderColor } = useThemeColors();
	const { colorScheme } = useColorScheme();

	return (
		<View className="w-full">
			<StyledText type="label" fontStyle="default" className="px-4 mb-2">
				{title}
			</StyledText>

			<View
				className={`flex-row items-center w-full border rounded-lg shadow-sm h-14
				${
					colorScheme === "light"
						? "border-light-border focus:border-gray"
						: "border-dark-border focus:border-main"
				}
			${error && "border-red-600"}`}>
				<TextInput
					className={`flex-1 h-full px-4 text-base ${
						colorScheme === "light" ? "text-dark" : "text-main-50"
					}`}
					placeholder={title}
					placeholderTextColor={placeholderColor}
					value={value}
					keyboardType={keyboardType}
					onChangeText={handleTextChange}
					autoCapitalize={
						title === "Username" || title === "Email" || title === "Password"
							? "none"
							: title === "default"
							? "sentences"
							: "words"
					}
					secureTextEntry={
						(title === "Password" ||
							title === "Current Password" ||
							title === "Retype Current Password" ||
							title === "New Password") &&
						!showPassword
					}
					style={{ alignSelf: "center" }}
				/>

				{(title === "Password" ||
					title === "Current Password" ||
					title === "Retype Current Password" ||
					title === "New Password") && (
					<StyledPressable
						size="icon"
						onPress={() => setShowPassword(!showPassword)}>
						<Image
							source={
								colorScheme === "dark"
									? showPassword
										? icons.eyeLightDark
										: icons.eyeOffLightDark
									: showPassword
									? icons.eyeDarkLight
									: icons.eyeOffDarkLight
							}
							className="w-6 h-full mr-4"
							resizeMode="contain"></Image>
					</StyledPressable>
				)}

				<View
					className={`absolute w-full h-full rounded-lg -z-10
          ${colorScheme === "light" ? "bg-white" : "bg-dark-light"}
        `}></View>
				{/* <BlurView intensity={100} tint='dark' className="">
          <Text>asds</Text>
        </BlurView> */}
			</View>
			{/* Display error message if present */}
			{error && (
				<StyledText fontStyle="default" className="px-4 text-red-600">
					{error}
				</StyledText>
			)}
		</View>
	);
};

export default StyledTextInput;
