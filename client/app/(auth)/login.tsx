import {
	View,
	SafeAreaView,
	Image,
	ScrollView,
	Alert,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColors } from "../../constants/colors";
import { useColorScheme } from "nativewind";
import StyledText from "@/components/StyledText";
import StyledTextInput from "@/components/StyledTextInput";
import StyledPressable from "@/components/StyledPressable";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserLoginSchema } from "@/utils/types/user";
import { TUserLogin } from "../../utils/types/user";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { handleLogin } from "@/redux/actions/authActions";
import Spin from "@/components/animations/Spin";

const Login = () => {
	const { colorScheme } = useColorScheme();
	const { gradientColor, logoImage } = useThemeColors();

	const dispatch = useDispatch<AppDispatch>();
	const auth = useSelector((state: RootState) => state.auth);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<TUserLogin>({
		resolver: zodResolver(UserLoginSchema),
	});

	const onSubmit = async (data: TUserLogin) => {
		dispatch(handleLogin(data)).then((res) => {
			if (res.meta.requestStatus === "rejected") {
				Alert.alert(res.payload);
			}
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
				<ScrollView showsVerticalScrollIndicator={false} className="">
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
							Welcome Back
						</StyledText>

						<StyledText
							type="subheading"
							fontStyle="default"
							className="pt-1 text-center ">
							Login to your account.
						</StyledText>

						<View className="flex-col flex-1 ">
							{/* Email Input */}
							<View className="w-full pt-8">
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
									render={({ field: { onChange, value } }) => (
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

							<StyledPressable size="text" className="w-full px-4 mt-4">
								<StyledText selectable={false} fontStyle="default" type="link">
									Forgot Password?
								</StyledText>
							</StyledPressable>
						</View>

						<View className="flex-row items-end mt-12 space-x-2">
							<StyledText selectable={false} fontStyle="default" type="label">
								Don't have an Account?
							</StyledText>

							<StyledPressable
								size="text"
								onPress={() => router.replace("/(auth)/register")}>
								<StyledText
									className=""
									selectable={false}
									fontStyle="default"
									type="link">
									Sign-Up
								</StyledText>
							</StyledPressable>
						</View>

						<StyledPressable
							size="xl"
							className={`mt-4 bg-main flex-row items-center ${
								auth.status === "pending" && "bg-main/20"
							}`}
							disabled={auth.status === "pending"}
							onPress={handleSubmit(onSubmit)}>
							{auth.status === "pending" && (
								<Spin size="md" loading={auth.status === "pending"} />
							)}
							<StyledText
								className="ml-2"
								selectable={false}
								fontStyle="Chunk"
								type="button">
								{auth.status === "pending" ? "Logging in..." : "Log in"}
							</StyledText>
						</StyledPressable>
					</View>
				</ScrollView>
			</SafeAreaView>
		</KeyboardAvoidingView>
	);
};

export default Login;
