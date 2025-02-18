import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

interface FadeAnimationProps {
	children: React.ReactNode;
	duration?: number;
}

const Fade: React.FC<FadeAnimationProps> = ({ children, duration = 1000 }) => {
	const fadeAnim = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(fadeAnim, {
					toValue: 0.5,
					duration: duration,
					useNativeDriver: true,
					easing: Easing.inOut(Easing.ease),
				}),
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: duration,
					useNativeDriver: true,
					easing: Easing.inOut(Easing.ease),
				}),
				Animated.delay(100),
				Animated.timing(fadeAnim, {
					toValue: 0.5,
					duration: duration,
					useNativeDriver: true,
					easing: Easing.inOut(Easing.ease),
				}),
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: duration,
					useNativeDriver: true,
					easing: Easing.inOut(Easing.ease),
				}),
			])
		).start();
	}, [duration]);

	return (
		<Animated.View style={{ opacity: fadeAnim }}>{children}</Animated.View>
	);
};

export default Fade;
