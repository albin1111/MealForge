import { icons } from "@/constants";
import { useColorScheme } from "nativewind";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, Image } from "react-native";

interface SpinAnimationProps {
	loading: boolean;
	size: "sm" | "md" | "lg";
}

const Spin: React.FC<SpinAnimationProps> = ({ loading = false, size }) => {
	const spinAnim = useRef(new Animated.Value(0)).current;
	const animationControl = Animated.loop(
		Animated.timing(spinAnim, {
			toValue: 1,
			easing: Easing.linear,
			useNativeDriver: true,
		})
	);
	useEffect(() => {
		if (loading) {
			animationControl.start();
		} else {
			animationControl.stop();
		}
	}, [loading]);

	const spin = spinAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "360deg"],
	});

	const { colorScheme } = useColorScheme();

	return (
		<Animated.View style={{ transform: [{ rotate: spin }] }}>
			<Image
				source={
					colorScheme === "dark"
						? icons.loadingLightDark
						: icons.loadingDarkLight
				}
				resizeMode="contain"
				className={`
          ${size === "sm" && "w-5 h-5"}
          ${size === "md" && "w-6 h-6"}
          ${size === "lg" && "w-7 h-7"}
          `}
			/>
		</Animated.View>
	);
};

export default Spin;
