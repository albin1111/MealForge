import React from "react";
import { Redirect, Tabs } from "expo-router";
import { View, Image, Text, ImageProps } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useThemeColors } from "@/constants/colors";
import { icons } from "@/constants";

type TabIconProps = {
	icon: ImageProps;
	color: string;
	name: string;
	focused: boolean;
};

const TabIcon: React.FC<TabIconProps> = ({ icon, color, name, focused }) => {
	return (
		<View
			className={`flex-col items-center justify-center space-y-1 ${
				focused && "#f97316"
			}`}>
			<Image
				source={icon}
				resizeMode="contain"
				tintColor={focused ? "#f97316" : color}
				className="w-6 h-6"
			/>
			<Text
				className={`${focused ? "font-psemibold" : "font-pregular "} text-xs`}
				style={{ color: focused ? "#f97316" : color }}>
				{name}
			</Text>
		</View>
	);
};

const AppLayout = () => {
	const { accessToken, refreshToken, pageLoading } = useSelector(
		(state: RootState) => state.auth
	);
	const { textColor, inActiveColor, tabColor } = useThemeColors();

	if (!accessToken && !refreshToken && !pageLoading) {
		return <Redirect href={"/(auth)/login"} />;
	}

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: textColor,
				tabBarInactiveTintColor: inActiveColor,
				tabBarShowLabel: false,
				tabBarStyle: {
					backgroundColor: tabColor,
					borderTopColor: tabColor,
					borderTopWidth: 1,
					height: 70,
				},
			}}>
			<Tabs.Screen
				name="home"
				options={{
					title: "Home",
					headerShown: false,
					tabBarIcon: ({ color, focused }) => (
						<TabIcon
							icon={icons.home_light}
							color={color}
							name="Home"
							focused={focused}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="drawer"
				options={{
					title: "Drawer",
					headerShown: false,
					tabBarIcon: ({ color, focused }) => (
						<TabIcon
							icon={icons.drawer_light}
							color={color}
							name="Drawer"
							focused={focused}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="bookmark"
				options={{
					title: "Bookmark",
					headerShown: false,
					tabBarIcon: ({ color, focused }) => (
						<TabIcon
							icon={icons.bookmark_light}
							color={color}
							name="Bookmark"
							focused={focused}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="user"
				options={{
					title: "User",
					headerShown: false,
					tabBarIcon: ({ color, focused }) => (
						<TabIcon
							icon={icons.user_light}
							color={color}
							name="User"
							focused={focused}
						/>
					),
				}}
			/>
		</Tabs>
	);
};

export default AppLayout;
