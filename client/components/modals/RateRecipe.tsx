import { Alert, Image, Modal, View } from "react-native";
import StyledPressable from "../StyledPressable";
import StyledText from "../StyledText";
import { icons } from "@/constants";
import { useState } from "react";
import axios from "@/redux/api/axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Spin from "../animations/Spin";
import { useColorScheme } from "nativewind";

type Props = {
	isVisible: boolean;
	onClose: () => void;
	post_id: string;
};

const RateRecipe: React.FC<Props> = ({ isVisible, onClose, post_id }) => {
	const [rate, setRate] = useState(0);
	const [loading, setLoading] = useState(false);

	const { colorScheme } = useColorScheme();

	const { user } = useSelector((state: RootState) => state.user);

	const handleRate = async () => {
		try {
			setLoading(true);
			const res = await axios.post(`/post/${post_id}/rate`, {
				user_id: user?.id,
				rating: rate,
			});
			console.log(res.data);
			Alert.alert(res.data.message);
		} catch (error) {
			console.log(error);
		} finally {
			handleClose();
			setLoading(false);
		}
	};

	const handleClose = () => {
		setRate(0);
		onClose();
	};

	return (
		<Modal visible={isVisible} transparent={true} animationType="fade">
			<View className="flex-col items-center justify-center w-full h-full">
				<View className="w-[300px] h-[250px] bg-white dark:bg-dark border border-dark-border rounded-xl p-4">
					<View className="flex-row items-center justify-end w-full ">
						<StyledPressable
							onPress={handleClose}
							size="icon"
							className="w-max">
							<Image
								source={
									colorScheme === "dark"
										? icons.closeLightDark
										: icons.closeDarkLight
								}
								className="w-7 h-7"
								resizeMode="contain"
							/>
						</StyledPressable>
					</View>

					<View className="flex-col items-center justify-center flex-1 w-full h-full space-y-4">
						<StyledText type="heading-4" className="text-center">
							How would you rate this posted recipe ?
						</StyledText>

						<View className="flex-row items-center">
							{Array(5)
								.fill(5)
								.map((_, i) => (
									<StyledPressable
										size="icon"
										key={i}
										onPress={() => setRate(i + 1)}>
										<Image
											source={
												rate <= i
													? colorScheme === "dark"
														? icons.starLight
														: icons.starDark
													: icons.starOrange
											}
											className="w-6 h-6 mx-1"
											resizeMode="contain"
										/>
									</StyledPressable>
								))}
						</View>
					</View>

					<View className="flex-row items-center justify-end w-full">
						<StyledPressable
							disabled={loading}
							onPress={handleRate}
							size="sm"
							className="bg-main">
							{loading ? (
								<Spin size="sm" loading={loading} />
							) : (
								<StyledText className="text-white">Rate</StyledText>
							)}
						</StyledPressable>
					</View>
				</View>
			</View>
		</Modal>
	);
};

export default RateRecipe;
