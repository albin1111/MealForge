import React, { SetStateAction, useState } from "react";
import { View, Image, ScrollView, TouchableOpacity } from "react-native";
import { useColorScheme } from "nativewind";
import StyledText from "./StyledText";
import { icons } from "@/constants";

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

type RecipeCardProps = {
	item: RecipeProps;
	setSelectedRecipe: React.Dispatch<SetStateAction<RecipeProps | null>>;
	selectedRecipe: RecipeProps | null;
};

const RecipeCard: React.FC<RecipeCardProps> = ({
	item,
	selectedRecipe,
	setSelectedRecipe,
}) => {
	const [showInstructions, setShowInstructions] = useState<
		"ingredients" | "nutrients" | "instruction" | "allergens" | "none"
	>("none");
	const { colorScheme } = useColorScheme();

	const handleSelectItem = () => {
		if (selectedRecipe && selectedRecipe.name === item.name) {
			setSelectedRecipe(null);
		} else {
			setSelectedRecipe(item);
		}
	};

	return (
		<View
			className={`flex-1 w-full mt-4 overflow-hidden bg-white dark:bg-dark-light border  rounded-xl  ${
				selectedRecipe && selectedRecipe.name === item.name
					? "border-main"
					: "border-light-border  dark:border-dark-border"
			}`}>
			<View className="p-2">
				{/* Header */}
				<TouchableOpacity onPress={handleSelectItem}>
					<View className="flex-col px-2  rounded-t-xl p-2">
						<View className="flex-row justify-between w-full">
							<StyledText type="heading-5" className="font-chunk">
								{item.name}
							</StyledText>
						</View>
					</View>
				</TouchableOpacity>

				<View className="flex-col flex-1 w-full px-4 py-4 bg-white border rounded-xl border-light-border dark:border-dark-border dark:bg-dark-light">
					<View className="flex-row flex-1">
						<View className="flex-col justify-between flex-1 space-y-4">
							{/* Servings */}
							<View className="flex-row w-full">
								<Image
									source={
										colorScheme === "light" ? icons.usersDark : icons.usersLight
									}
									resizeMode="contain"
									className="mt-1 w-7 h-7"
								/>
								<View className="flex-1 w-full ml-3">
									<StyledText type="xs">Serve for: </StyledText>
									<StyledText type="xs" className="">
										{item.serve_for}
									</StyledText>
								</View>
							</View>

							{/* Cooking time */}
							<View className="flex-row w-full">
								<Image
									source={
										colorScheme === "light" ? icons.timeDark : icons.timeLight
									}
									resizeMode="contain"
									className="mt-1 w-7 h-7"
								/>
								<View className="flex-1 w-full ml-3">
									<StyledText type="xs">Cooking time: </StyledText>
									<StyledText type="xs" className="">
										{item.cooking_time}
									</StyledText>
								</View>
							</View>
						</View>

						<View className="flex-col justify-between flex-1 space-y-4">
							{/* Serve hot or cold */}
							<View className="flex-row w-full">
								<Image
									source={
										colorScheme === "light" ? icons.tempDark : icons.tempLight
									}
									resizeMode="contain"
									className="mt-1 w-7 h-7"
								/>
								<View className="flex-1 w-full ml-3">
									<StyledText type="xs">Serve in: </StyledText>
									<StyledText type="xs" className="">
										{item.serve_hot_or_cold}{" "}
									</StyledText>
								</View>
							</View>

							{/* Cuisine type */}
							<View className="flex-row w-full">
								<Image
									source={
										colorScheme === "light"
											? icons.cuisineTypeDark
											: icons.cuisineTypeLight
									}
									resizeMode="contain"
									className="mt-1 w-7 h-7"
								/>
								<View className="flex-1 w-full ml-3">
									<StyledText type="xs">Cuisine type: </StyledText>
									<StyledText type="xs" className="">
										{item.type_of_cuisine}
									</StyledText>
								</View>
							</View>
						</View>
					</View>

					{/* Difficulty */}
					<View className="flex-row flex-1 w-full pt-4">
						<Image
							source={
								colorScheme === "light" ? icons.diffDark : icons.diffLight
							}
							resizeMode="contain"
							className="w-5 h-5 mx-1 mt-1"
						/>
						<View className="flex-1 w-full ml-3">
							<StyledText type="xs">Difficulty: </StyledText>
							<StyledText type="xs" className="">
								{item.difficulty}{" "}
							</StyledText>
						</View>
					</View>
				</View>

				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					className="w-full mt-2">
					<View className="flex-row items-start justify-center w-full px-2 space-x-2">
						{item.tags.split(",").map((itemIngredients, i) => (
							<StyledText
								key={i}
								type="xs"
								className="px-3 bg-light border border-light-border dark:border-dark-border dark:bg-dark py-1.5 rounded-full">
								{itemIngredients}
							</StyledText>
						))}
					</View>
				</ScrollView>
			</View>

			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				className="w-full m-t2">
				<View className="flex-row items-center justify-start w-full  border-t border-light-border dark:border-dark-border p-2 rounded-b-xl">
					<TouchableOpacity
						onPress={() =>
							setShowInstructions((prev) =>
								prev === "ingredients" ? "none" : "ingredients"
							)
						}
						className={`flex-row items-center justify-center bg-light dark:bg-dark border border-light-border dark:border-dark-border rounded-md px-2 py-1.5 mx-1 w-full flex-1 ${
							showInstructions === "ingredients" ? "bg-main" : ""
						}`}>
						<StyledText type="xs" className="text-dark dark:text-white">
							Ingredients
						</StyledText>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() =>
							setShowInstructions((prev) =>
								prev === "instruction" ? "none" : "instruction"
							)
						}
						className={`flex-row items-center justify-center bg-light dark:bg-dark border border-light-border dark:border-dark-border rounded-md px-2 py-1.5 mx-1 w-full flex-1 ${
							showInstructions === "instruction" ? "bg-main" : ""
						}`}>
						<StyledText type="xs" className="text-dark dark:text-white">
							Instructions
						</StyledText>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() =>
							setShowInstructions((prev) =>
								prev === "nutrients" ? "none" : "nutrients"
							)
						}
						className={`flex-row items-center justify-center bg-light dark:bg-dark border border-light-border dark:border-dark-border rounded-md px-2 py-1.5 mx-1 w-full flex-1 ${
							showInstructions === "nutrients" ? "bg-main" : ""
						}`}>
						<StyledText type="xs" className="text-dark dark:text-white">
							Nutrients
						</StyledText>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() =>
							setShowInstructions((prev) =>
								prev === "allergens" ? "none" : "allergens"
							)
						}
						className={`flex-row items-center justify-center bg-light dark:bg-dark border border-light-border dark:border-dark-border rounded-md px-2 py-1.5 mx-1 w-full flex-1 ${
							showInstructions === "allergens" ? "bg-main" : ""
						}`}>
						<StyledText type="xs" className="text-dark dark:text-white">
							Allergens
						</StyledText>
					</TouchableOpacity>
				</View>
			</ScrollView>

			<View className="px-2 mb-2">
				{showInstructions === "instruction" && (
					<View className="mt-2 last:flex-col w-full p-2 bg-white border rounded-xl border-light-border dark:border-dark-border dark:bg-dark-light">
						<StyledText className="font-chunk" type="subheading">
							Instructions:
						</StyledText>
						<View className="flex-col w-full px-1">
							{item.instructions.map((item, i) => (
								<StyledText key={i} type="xs" className="py-2 tracking-wide">
									{item}
								</StyledText>
							))}
						</View>
					</View>
				)}

				{showInstructions === "nutrients" && (
					<View className="mt-2 last:flex-col w-full p-2 bg-white border rounded-xl border-light-border dark:border-dark-border dark:bg-dark-light">
						<StyledText className="font-chunk" type="subheading">
							Nutrients:
						</StyledText>
						<View className="flex-col w-full px-1">
							{item.nutrient_counts.map((item, i) => (
								<StyledText key={i} type="xs" className="py-2 tracking-wide">
									{item.name}: {item.measurement}
								</StyledText>
							))}
						</View>
					</View>
				)}

				{showInstructions === "allergens" && (
					<View className="mt-2 last:flex-col w-full p-2 bg-white border rounded-xl border-light-border dark:border-dark-border dark:bg-dark-light">
						<StyledText className="font-chunk" type="subheading">
							Allergens:
						</StyledText>
						<View className="flex-col w-full px-1">
							{item.allergens.split(",").map((item, i) => (
								<StyledText key={i} type="xs" className="py-2 tracking-wide">
									{item}
								</StyledText>
							))}
						</View>
					</View>
				)}

				{showInstructions === "ingredients" && (
					<View className="mt-2 last:flex-col w-full p-2 bg-white border rounded-xl border-light-border dark:border-dark-border dark:bg-dark-light">
						<StyledText className="font-chunk" type="subheading">
							Ingredients:
						</StyledText>
						<View className="flex-col w-full px-1">
							{item.ingredients.map((item, i) => (
								<StyledText key={i} type="xs" className="py-2 tracking-wide">
									• {item.measurement} {item.name}
								</StyledText>
							))}
						</View>
					</View>
				)}
			</View>
		</View>
	);
};

export default RecipeCard;
