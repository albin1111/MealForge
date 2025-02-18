import { Modal, ScrollView, View } from "react-native";
import StyledText from "../StyledText";
import StyledPressable from "../StyledPressable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { handleSaveRecipe } from "@/redux/actions/recipeAction";
import { useState } from "react";
import RecipeCard from "../RecipeCard";

type Props = {
	isVisible: boolean;
	onClose: () => void;
	recipe: {
		name: string;
		ingredients: [
			{
				name: string;
				measurement: string;
			}
		];
		instructions: [string];
		type_of_cuisine: string;
		nutrient_counts: [
			{
				name: string;
				measurement: string;
			}
		];
		serve_hot_or_cold: string;
		cooking_time: string;
		benefits: string;
		serve_for: string;
		difficulty: string;
		tags: string;
		allergens: string;
		leftover_recommendations: string;
	}[];
};

type RecipeProps = {
	name: string;
	ingredients: [
		{
			name: string;
			measurement: string;
		}
	];
	instructions: [string];
	type_of_cuisine: string;
	nutrient_counts: [
		{
			name: string;
			measurement: string;
		}
	];
	serve_hot_or_cold: string;
	cooking_time: string;
	benefits: string;
	serve_for: string;
	difficulty: string;
	tags: string;
	allergens: string;
	leftover_recommendations: string;
};

const DisplayRecipe: React.FC<Props> = ({ isVisible, onClose, recipe }) => {
	const dispatch = useDispatch<AppDispatch>();
	const { user } = useSelector((state: RootState) => state.user);
	const [selectedRecipe, setSelectedRecipe] = useState<RecipeProps | null>(
		null
	);

	const handleClose = () => {
		onClose();
	};

	const handleDelete = () => {
		onClose();
	};

	const handleSave = async () => {
		if (selectedRecipe) {
			dispatch(
				handleSaveRecipe({
					userId: user?.id,
					recipe: selectedRecipe,
				})
			).then((res) => {
				if (res.meta.requestStatus === "fulfilled") {
					onClose();
				}
			});
		}
	};
	return (
		<Modal
			visible={isVisible}
			transparent={true}
			animationType="slide"
			className="bg-black">
			<View className="z-10 flex-1">
				<View className="absolute bottom-0 w-full  border bg-light h-[90%] rounded-t-3xl border-light-dark dark:border-dark-light dark:bg-dark">
					<ScrollView>
						<View className="flex-row items-center justify-between p-4 rounded-t-3xl bg-main">
							<StyledText type="subheading">Generated Recipe</StyledText>
							<StyledPressable
								onPress={handleClose}
								className="ml-auto "
								size="text">
								<StyledText type="xs" className="underline">
									Close
								</StyledText>
							</StyledPressable>
						</View>

						<View className="flex-col items-start justify-start p-4">
							<StyledText type="heading-3" className="font-chunk">
								Which one do you prefer?
							</StyledText>

							{recipe.length > 0 &&
								recipe.map((item, i) => (
									<RecipeCard
										key={i}
										item={item}
										selectedRecipe={selectedRecipe}
										setSelectedRecipe={setSelectedRecipe}
									/>
								))}

							{selectedRecipe && (
								<View className="flex-row items-center justify-end w-full p-4">
									<StyledPressable
										onPress={handleSave}
										className="mx-1 rounded-md bg-main"
										size="sm">
										<StyledText className="text-white">Save</StyledText>
									</StyledPressable>
									<StyledPressable
										onPress={handleDelete}
										className="mx-1 bg-red-500 rounded-md"
										size="sm">
										<StyledText className="text-white">Delete</StyledText>
									</StyledPressable>
								</View>
							)}
						</View>
					</ScrollView>
				</View>
			</View>
		</Modal>
	);
};
export default DisplayRecipe;
