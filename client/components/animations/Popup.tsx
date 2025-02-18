import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

interface PopupAnimationProps {
	children: React.ReactNode;
	duration?: number;
	animate: boolean;
}

const Popup: React.FC<PopupAnimationProps> = ({
	children,
	duration = 1000,
	animate,
}) => {
	const popUpAnim = useRef(new Animated.Value(0)).current;
	useEffect(() => {
		if (animate) {
			Animated.timing(popUpAnim, {
				toValue: 1,
				duration: duration,
				useNativeDriver: true,
				easing: Easing.inOut(Easing.ease),
			}).start();
		} else {
			Animated.timing(popUpAnim, {
				toValue: 0,
				duration: duration,
				useNativeDriver: true,
				easing: Easing.inOut(Easing.ease),
			}).start();
		}
	}, [animate, duration]);

	return (
		<Animated.View
			style={{
				transform: [{ scale: popUpAnim }],
			}}>
			{children}
		</Animated.View>
	);
};

export default Popup;
