import { Image, View } from "react-native";
import Pulse from "./animations/Pulse";
import { images } from "@/constants";
import { useColorScheme } from "nativewind";

const Loading = () => {
	const { colorScheme } = useColorScheme();
	return (
		<View className="w-full h-full flex-col items-center justify-center bg-light dark:bg-dark">
			<Pulse>
				<Image
					source={
						colorScheme === "dark" ? images.loading_light : images.loading_dark
					}
					resizeMode="contain"
					className="w-20 h-20"
				/>
			</Pulse>
		</View>
	);
};
export default Loading;
