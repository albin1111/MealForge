import { Image, Modal, ScrollView, View } from "react-native";
import StyledPressable from "../StyledPressable";
import { icons } from "@/constants";
import Popup from "../animations/Popup";
import { TIngredients } from "@/utils/types/ingredients";
import StyledText from "../StyledText";
import { useColorScheme } from "nativewind";

type Props = {
	isVisible: boolean;
	onClose: () => void;
	expiredIngredients: TIngredients[];
};

const ExpiredIngredients: React.FC<Props> = ({
	isVisible,
	onClose,
	expiredIngredients,
}) => {
	const handleClose = () => {
		onClose();
	};
	const { colorScheme } = useColorScheme();

	return (
		<Modal visible={isVisible} transparent={true} animationType="fade">

			{/*<View className="flex-col items-center justify-center w-full h-full">*/}
			<View className="flex-col items-center justify-center w-full h-full">
				<Popup animate={isVisible} duration={300}>
					<View className="w-[300px] h-[400px]  bg-light dark:bg-dark border border-dark-border rounded-xl p-4">

						{/* <View className="flex-row items-center justify-between w-full mb-4 "> */}
						<View className="flex-row items-center justify-between w-full mb-4 ">
							<StyledText type="heading-3" className=" font-chunk">
								Expired Ingredients:
							</StyledText>
							<StyledPressable
								onPress={handleClose}
								size="icon"
								className="w-max">
								<Image
									source={
										colorScheme === "light"
											? icons.closeDarkLight
											: icons.closeLightDark
									}
									className="w-8 h-8"
									resizeMode="contain"
								/>
							</StyledPressable>
						</View>

						<ScrollView className="mb-4 flex-col max-h-[300px]">
							<StyledText type="heading-3" className="font-chunk text-main">
								Main Ingredients:
							</StyledText>
							{expiredIngredients &&
								expiredIngredients.length > 0 &&
								expiredIngredients.map(
									(item, i) =>
										item.type === "main ingredient" && (
											<View
												key={i}
												className="flex-row items-center justify-between w-full my-1">
												<StyledText className="ml-2">• {item.name}</StyledText>
												<StyledText>
													{item.expirationDate?.toString().split("T")[0]}
												</StyledText>
											</View>
										)
								)}
							<StyledText type="heading-3" className="font-chunk text-main">
								Seasonings:
							</StyledText>
							{expiredIngredients &&
								expiredIngredients.length > 0 &&
								expiredIngredients.map(
									(item, i) =>
										item.type === "seasoning" && (
											<View
												key={i}
												className="flex-row items-center justify-between w-full my-1">
												<StyledText className="ml-2">• {item.name}</StyledText>
												<StyledText>
													{item.expirationDate?.toString().split("T")[0]}
												</StyledText>
											</View>
										)
								)}
						</ScrollView>
					</View>
				</Popup>
			</View>
		</Modal>
	);
};

export default ExpiredIngredients;
