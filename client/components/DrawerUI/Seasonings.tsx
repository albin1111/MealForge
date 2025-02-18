import StyledText from "../StyledText";
import Pulse from "../animations/Pulse";
import { icons, images } from "@/constants";
import { useColorScheme } from "nativewind";
import StyledPressable from "../StyledPressable";
import { Image, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { deleteIngredients } from "@/redux/actions/ingredientsAction";

const Seasonings = () => {
	const { colorScheme } = useColorScheme();

	const dispatch = useDispatch<AppDispatch>();
	const { ingredients, pageLoading } = useSelector(
		(state: RootState) => state.ingredients
	);

	const handleDelete = async (ingredientsId: string) => {
		dispatch(deleteIngredients(ingredientsId));
	};

	if (pageLoading) {
		return (
			<View className="flex-col items-center justify-center w-full p-8 bg-light dark:bg-dark">
				<Pulse>
					<Image
						source={
							colorScheme === "dark"
								? images.loading_light
								: images.loading_dark
						}
						resizeMode="contain"
						className="w-20 h-20"
					/>
				</Pulse>
			</View>
		);
	}
	return (
		<ScrollView className="flex-1 w-full h-full p-4 ">
			{ingredients.length > 0 ? (
				ingredients.map(
					(item, i) =>
						item.type === "secondary ingredient" && (
							<View
								key={i}
								className="flex-row items-center justify-between w-full p-4 mb-4 bg-white border border-light-border dark:bg-dark-light dark:border-dark-border rounded-xl">
								<View className="flex-col items-start justify-center flex-1">
									<View className="flex-row items-center mb-2">
										<StyledText type="label" className="text-xs ">
											{item.type === "secondary ingredient" ? "Secondary Ingredients" : item.type}
										</StyledText>
										{item.is_expired ? (
											<StyledText
												type="xs"
												className="ml-2 bg-red-500 text-light px-3 py-0.5 rounded-full">
												Expired!
											</StyledText>
										) : null}
									</View>
									<StyledText key={i} className="font-chunk " type="heading-2">
										{item.name}
									</StyledText>
									<StyledText type="label" className="text">
										{item.measurements}
									</StyledText>
								</View>
								<View className="flex-row items-center justify-center">
									<StyledPressable
										size="icon"
										onPress={() => handleDelete(item.id)}>
										<Image
											source={
												colorScheme === "light"
													? icons.closeDarkLight
													: icons.closeLightDark
											}
											resizeMode="contain"
											className="w-7 h-7"
										/>
									</StyledPressable>
								</View>
							</View>
						)
				)
			) : (
				<StyledText className="mx-auto my-4">No Ingredients are added yet!</StyledText>
			)}
		</ScrollView>
	);
};
export default Seasonings;
