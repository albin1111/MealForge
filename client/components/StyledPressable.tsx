import { TouchableOpacity, type TouchableOpacityProps } from "react-native";

type Props = TouchableOpacityProps & {
	size?: "default" | "link" | "sm" | "lg" | "xl" | "text" | "icon";
};

const StyledPressable = ({ size = "default", ...rest }: Props) => {
	return (
		<TouchableOpacity
			className={`
        ${size === "sm" && "w-1/4 py-2 items-center justify-center rounded-lg"}
        ${
					size === "default" &&
					"w-1/2 py-3 items-center justify-center rounded-xl"
				}
        ${size === "lg" && "w-3/4 py-4 items-center justify-center rounded-xl"}
        ${size === "xl" && "w-full py-4 items-center justify-center rounded-xl"}
        ${size === "icon" && "w-max h-max"}
        ${size === "text" && ""}
        `}
			{...rest}
		/>
	);
};
export default StyledPressable;
