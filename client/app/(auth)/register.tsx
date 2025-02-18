import {
	View,
	SafeAreaView,
	Image,
	ScrollView,
	Alert,
	Platform,
	KeyboardAvoidingView,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColors } from "../../constants/colors";
import { useColorScheme } from "nativewind";
import StyledText from "@/components/StyledText";
import StyledTextInput from "@/components/StyledTextInput";
import StyledPressable from "@/components/StyledPressable";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { TUserSignup, UserSignupSchema } from "@/utils/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { handleSignup } from "@/redux/actions/authActions";
import Spin from "@/components/animations/Spin";

const Register = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { colorScheme } = useColorScheme();
	const { status } = useSelector((state: RootState) => state.auth);
	const { gradientColor, logoImage } = useThemeColors();

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<TUserSignup>({
		resolver: zodResolver(UserSignupSchema),
	});

	const onSubmit = async (data: TUserSignup) => {
		dispatch(handleSignup(data)).then((res) => {
			reset();
			Alert.alert(res.payload.message);
			router.push("/(auth)/login");
		});
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={{ flex: 1 }}
			keyboardVerticalOffset={Platform.OS === "ios" ? 60 : -300}>
			{colorScheme === "dark" ? (
				<LinearGradient
					start={{ x: 0.9, y: 0.1 }}
					colors={gradientColor}
					className="absolute top-0 left-0 w-full h-full"
				/>
			) : null}

			<SafeAreaView className="relative w-full h-full bg-light dark:bg-transparent">
				{/* scroll container*/}
				<ScrollView showsVerticalScrollIndicator={false}>
					<View className="items-center flex-1 w-full max-h-full min-h-screen p-10 pb-4">
						<View className="items-center w-full max-h-[100px]">
							<Image
								source={logoImage}
								className="w-full h-full "
								resizeMode="contain"
							/>
						</View>

						<StyledText
							type="heading-1"
							fontStyle="Chunk"
							className="pt-3 text-center">
							Create an Account
						</StyledText>

						<StyledText
							type="subheading"
							fontStyle="default"
							className="pt-1 text-center">
							Create an account to use MealForge.
						</StyledText>

						<View className="flex-1">
							{/* Username Input */}
							<View className="w-full pt-8">
								<Controller
									control={control}
									name="userName"
									render={({ field: { onChange, onBlur, value } }) => (
										<StyledTextInput
											className="w-full"
											title="Username"
											handleTextChange={onChange}
											value={value}
											error={errors.userName?.message}
										/>
									)}
								/>
							</View>

							{/* Name Inputs */}
							<View className="flex-row w-full gap-2 pt-4">
								<View className="flex-1">
									<Controller
										control={control}
										name="firstName"
										render={({ field: { onChange, onBlur, value } }) => (
											<StyledTextInput
												className="w-full"
												title="Firstname"
												handleTextChange={onChange}
												value={value}
												error={errors.firstName?.message}
											/>
										)}
									/>
								</View>
								<View className="flex-1">
									<Controller
										control={control}
										name="lastName"
										render={({ field: { onChange, onBlur, value } }) => (
											<StyledTextInput
												className="w-full"
												title="Lastname"
												handleTextChange={onChange}
												value={value}
												error={errors.lastName?.message}
											/>
										)}
									/>
								</View>
							</View>

							{/* Email Input */}
							<View className="w-full pt-4">
								<Controller
									control={control}
									name="email"
									render={({ field: { onChange, onBlur, value } }) => (
										<StyledTextInput
											className="w-full"
											title="Email"
											handleTextChange={onChange}
											value={value}
											error={errors.email?.message}
										/>
									)}
								/>
							</View>

							{/* Password Input */}
							<View className="w-full pt-4">
								<Controller
									control={control}
									name="password"
									render={({ field: { onChange, onBlur, value } }) => (
										<StyledTextInput
											className="w-full"
											title="Password"
											handleTextChange={onChange}
											value={value}
											error={errors.password?.message}
										/>
									)}
								/>
							</View>
						</View>

						<View className="flex-row items-end mt-12 space-x-2">
							<StyledText selectable={false} fontStyle="default" type="label">
								Already have an Account?
							</StyledText>

							<StyledPressable
								size="text"
								onPress={() => router.replace("/(auth)/login")}>
								<StyledText
									className=""
									selectable={false}
									fontStyle="default"
									type="link">
									Sign-In
								</StyledText>
							</StyledPressable>
						</View>

						<StyledPressable
							size="xl"
							className={`mt-4 bg-main flex-row items-center ${status === "pending" && "bg-main/20"
								}`}
							disabled={status === "pending"}
							onPress={handleSubmit(onSubmit)}>
							{status === "pending" && (
								<Spin size="md" loading={status === "pending"} />
							)}
							<StyledText
								className="ml-2"
								selectable={false}
								fontStyle="Chunk"
								type="button">
								{status === "pending"
									? "Creating account..."
									: "Create account"}
							</StyledText>
						</StyledPressable>
					</View>
				</ScrollView>
			</SafeAreaView>
		</KeyboardAvoidingView>
	);
};

export default Register;
