import { TextProps, View } from "react-native";

type Props = TextProps & {
  position?: "default" | "br" | "bl" | "tr" | "tl";
};

const Circle = ({ position = "default" }: Props) => {
  return (
    <View
      className={`
        absolute bg-gray-300 dark:bg-dark rounded-full w-[300] h-[300]

        ${position === "br" && "-bottom-[15%] -right-[30%]"}
        ${position === "bl" && "-bottom-[15%] -left-[30%]"}
        ${position === "tr" && "-top-[15%] -right-[30%]"}
        ${position === "tl" && "-top-[15%] -left-[30%]"}

        `} />
  );
};
export default Circle;