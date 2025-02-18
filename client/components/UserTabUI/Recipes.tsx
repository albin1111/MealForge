import { RootState } from "@/redux/store";
import { ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import Spin from "../animations/Spin";
import StyledText from "../StyledText";
import StyledPressable from "../StyledPressable";
import { router } from "expo-router";
const Recipes = () => {
	const { recipe, status } = useSelector((state: RootState) => state.recipe);

	if (status === "pending")
		return (
			<View className="flex items-center p-4">
				<Spin loading={status === "pending"} size="md" />
			</View>
		);
	return (
		<View className="flex-col w-full h-full p-2">
			{!recipe || recipe.length <= 0 ? (
				<StyledText className="mx-auto my-4">No recipes added yet!</StyledText>
			) : (
				recipe.map((item, i) => (
					<View
						key={i}
						// className="w-full p-4 my-2 bg-white border rounded-lg dark:bg-dark-light border-light-border dark:border-dark-border"
						className="w-full py-4 my-2 bg-white border border-light-border dark:bg-dark-light dark:border-dark-border rounded-xl"
					>
						<StyledPressable
							size="link"
							onPress={() =>
								router.push(`/(home_screen)/user_recipe/${item.id}`)
							}>
							<StyledText type="heading-4" className="px-4 font-chunk">
								{item.name}
							</StyledText>
						</StyledPressable>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							className="w-full">
							<View className="flex-row items-start justify-center w-full mt-2 space-x-1.5 px-4">
								{item.ingredients.split(",").map((item, i) => (
									<StyledText
										key={i}
										className="px-3 py-1 text-sm border rounded-full bg-light border-light-border dark:border-dark-border dark:bg-dark">
										{item}
									</StyledText>
								))}
							</View>
						</ScrollView>
					</View>
				))
			)}
		</View>
	);
};
export default Recipes;
