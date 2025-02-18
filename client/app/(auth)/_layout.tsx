import React from "react";
import { Redirect, Stack } from "expo-router";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const AuthLayout = () => {
	const { pageLoading } = useSelector((state: RootState) => state.user);
	const { refreshToken, accessToken } = useSelector(
		(state: RootState) => state.auth
	);
	if (refreshToken && accessToken && !pageLoading) {
		return <Redirect href={"/(tabs)/home"} />;
	}
	return (
		<>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen
					name="login"
					options={{ headerShown: false }}></Stack.Screen>
				<Stack.Screen
					name="register"
					options={{ headerShown: false }}></Stack.Screen>
			</Stack>
		</>
	);
};

export default AuthLayout;
