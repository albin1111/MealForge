import { useColorScheme } from "nativewind";
import { Text, type TextProps } from "react-native";

type Props = TextProps & {
	type?:
	| "default"
	| "title"
	| "subtitle"
	| "link"
	| "button"
	| "paragraph"
	| "heading-1"
	| "heading-2"
	| "heading-3"
	| "heading-4"
	| "heading-5"
	| "subheading"
	| "xs"
	| "label";
	fontStyle?: "default" | "light" | "Makeba" | "Chunk" | "ChunkP";
};

const StyledText = ({
	type = "default",
	fontStyle = "default",
	...rest
}: Props) => {
	const { colorScheme } = useColorScheme();
	return (
		<Text
			className={`
        ${colorScheme === "light" ? "text-dark" : "text-main-50"}

        ${fontStyle === "default" && "font-pregular"}
        ${fontStyle === "Makeba" && "font-makeba"}
        ${fontStyle === "Chunk" && "font-chunk"}
        ${fontStyle === "ChunkP" && "font-chunkp"}
        ${fontStyle === "light" && "font-plight"}

        ${type === "default" && "text-base"}
        ${type === "subtitle" && "text-2xl"}
        ${type === "button" && "text-xl text-white dark:text-main-50"}
        ${type === "link" && "text-base text-main underline"}
        ${type === "title" && "text-5xl"}
        ${type === "heading-1" && "text-4xl"}
        ${type === "heading-2" && "text-3xl"}
        ${type === "heading-3" && "text-2xl font-pmedium"}
        ${type === "heading-4" && "text-xl font-psemibold"}
        ${type === "heading-5" && "text-lg font-pregular"}
        ${type === "subheading" && "text-base font-pmedium"}
        ${type === "paragraph" && "text-base"}
        ${type === "label" && "text-sm"}
        ${type === "xs" && "text-xs"}
      `}
			{...rest}
		/>
	);
};

export default StyledText;
