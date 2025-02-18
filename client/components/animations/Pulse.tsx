import React, { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";

interface PulseAnimationProps {
	children: React.ReactNode;
	duration?: number;
}

const Pulse: React.FC<PulseAnimationProps> = ({
	children,
	duration = 1000,
}) => {
	const pulseAnim = useRef(new Animated.Value(1)).current;
	const fadeAnim = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(pulseAnim, {
					toValue: 1.1,
					duration: duration,
					useNativeDriver: true,
					easing: Easing.inOut(Easing.ease),
				}),
				Animated.timing(pulseAnim, {
					toValue: 1,
					duration: duration,
					useNativeDriver: true,
					easing: Easing.inOut(Easing.ease),
				}),
			])
		).start();
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
	}, [pulseAnim, duration]);

	return (
		<Animated.View
			style={{ transform: [{ scale: pulseAnim }], opacity: fadeAnim }}>
			{children}
		</Animated.View>
	);
};

export default Pulse;
