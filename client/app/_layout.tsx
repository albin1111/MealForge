import { persistor, store } from "@/redux/store";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		"Chunk-Print": require("../assets/fonts/Chunk-Five-Print.ttf"),
		Chunk: require("../assets/fonts/ChunkFive-Regular.ttf"),
		"Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
		"Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
		"Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
		"Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
		"Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
		"Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
		"Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
		"Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
		"Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
		Makeba: require("../assets/fonts/Makeba.ttf"),
		...FontAwesome.font,
	});
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name="index" options={{ headerShown: false }} />
					<Stack.Screen name="(user_screen)" options={{ headerShown: false }} />
					<Stack.Screen name="(home_screen)" options={{ headerShown: false }} />
				</Stack>
			</PersistGate>
		</Provider>
	);
}
