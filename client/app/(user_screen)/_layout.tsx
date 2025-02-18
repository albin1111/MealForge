import React from "react";
import { Redirect, Stack } from "expo-router";
import { useThemeColors } from "@/constants/colors";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
const AuthLayout = () => {
	const { tabColor, textColor } = useThemeColors();
	const { accessToken, refreshToken, pageLoading } = useSelector(
		(state: RootState) => state.auth
	);

	if (!accessToken && !refreshToken && !pageLoading) {
		return <Redirect href={"/(auth)/login"} />;
	}

	return (
		<>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen
					name="EditInformation"
					options={{
						headerShown: true,
						title: "Edit Information",
						headerStyle: {
							backgroundColor: tabColor,
						},
						headerTitleStyle: {
							fontFamily: "Poppins-Regular",
							fontSize: 16,
						},
						headerTitleAlign: "center",
						headerTintColor: textColor,
						headerShadowVisible: false,
					}}
				/>
				<Stack.Screen
					name="UserPreferences"
					options={{
						headerShown: true,
						title: "User Preferences",
						headerStyle: {
							backgroundColor: tabColor,
						},
						headerTitleStyle: {
							fontFamily: "Poppins-Regular",
							fontSize: 16,
						},
						headerTitleAlign: "center",
						headerTintColor: textColor,
						headerShadowVisible: false,
					}}
				/>
				<Stack.Screen
					name="Theme"
					options={{
						headerShown: true,
						title: "Theme",
						headerStyle: {
							backgroundColor: tabColor,
						},
						headerTitleStyle: {
							fontFamily: "Poppins-Regular",
							fontSize: 16,
						},
						headerTitleAlign: "center",
						headerTintColor: textColor,
						headerShadowVisible: false,
					}}
				/>
				<Stack.Screen
					name="Settings"
					options={{
						headerShown: true,
						title: "Settings",
						headerStyle: {
							backgroundColor: tabColor,
						},
						headerTitleStyle: {
							fontFamily: "Poppins-Regular",
							fontSize: 16,
						},
						headerTitleAlign: "center",
						headerTintColor: textColor,
						headerShadowVisible: false,
					}}
				/>
				<Stack.Screen
					name="ChangePassword"
					options={{
						headerShown: true,
						title: "Change Password",
						headerStyle: {
							backgroundColor: tabColor,
						},
						headerTitleStyle: {
							fontFamily: "Poppins-Regular",
							fontSize: 16,
						},
						headerTitleAlign: "center",
						headerTintColor: textColor,
						headerShadowVisible: false,
					}}
				/>
				<Stack.Screen
					name="DeleteAccount"
					options={{
						headerShown: true,
						title: "Account Deletion",
						headerStyle: {
							backgroundColor: tabColor,
						},
						headerTitleStyle: {
							fontFamily: "Poppins-Regular",
							fontSize: 16,
						},
						headerTitleAlign: "center",
						headerTintColor: textColor,
						headerShadowVisible: false,
					}}
				/>
				<Stack.Screen
					name="GenerateRecipe"
					options={{
						headerShown: true,
						title: "Generate Recipe",
						headerStyle: {
							backgroundColor: tabColor,
						},
						headerTintColor: textColor,
						headerShadowVisible: false,
					}}
				/>
				<Stack.Screen
					name="AddIngredients"
					options={{
						headerShown: true,
						title: "Add new ingredient",
						headerStyle: {
							backgroundColor: tabColor,
						},
						headerTintColor: textColor,
						headerShadowVisible: false,
					}}
				/>
			</Stack>
		</>
	);
};

export default AuthLayout;
