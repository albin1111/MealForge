import React from "react";
import { Redirect, Stack } from "expo-router";
import { useThemeColors } from "@/constants/colors";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const HomeScreenLayout = () => {
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
					name="post/[id]"
					options={{
						headerShown: true,
						title: "Posted Recipe",
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
					name="user_recipe/[id]"
					options={{
						headerShown: true,
						title: "Your Recipe",
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
					name="user_post/[id]"
					options={{
						headerShown: true,
						title: "Your Posted Recipe",
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
			</Stack>
		</>
	);
};

export default HomeScreenLayout;
