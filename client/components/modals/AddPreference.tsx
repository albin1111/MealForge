import { Image, Modal, TextInput, View } from "react-native";
import StyledText from "../StyledText";
import StyledPressable from "../StyledPressable";
import { icons } from "@/constants";
import { useColorScheme } from "nativewind";
import { PreferenceSchema, TNewPreference } from "@/utils/types/preference";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useThemeColors } from "@/constants/colors";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addAllergy } from "@/redux/actions/userActions";
import Spin from "../animations/Spin";

type Props = {
	isVisible: boolean;
	onClose: () => void;
};

const AddPreference: React.FC<Props> = ({ isVisible, onClose }) => {
	const { colorScheme } = useColorScheme();
	const { placeholderColor } = useThemeColors();
	const { accessToken } = useSelector((state: RootState) => state.auth);
	const handleClose = () => {
		onClose();
	};
	const { status } = useSelector((state: RootState) => state.user);

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<TNewPreference>({
		resolver: zodResolver(PreferenceSchema),
	});

	const dispatch = useDispatch<AppDispatch>();
	const onSubmit = async (data: TNewPreference) => {
		dispatch(addAllergy({ allergy: data.allergies, token: accessToken })).then(
			(res) => {
				if (res.meta.requestStatus === "fulfilled") {
					onClose();
					reset();
				}
			}
		);
	};

	return (
		<Modal
			visible={isVisible}
			transparent={true}
			animationType="slide"
			className="bg-black">
			<View className="absolute bottom-0 w-full p-4 border bg-light h-3/4 rounded-t-3xl border-light-dark dark:border-dark-light dark:bg-dark">
				{/* header */}
				<View className="flex-row items-center justify-between">
					<StyledText type="heading-4">Add new preference</StyledText>
					<StyledPressable onPress={handleClose} size="icon">
						<Image
							source={
								colorScheme === "light"
									? icons.closeDarkLight
									: icons.closeLightDark
							}
							className="w-8 h-8"
						/>
					</StyledPressable>
				</View>

				{/* body */}
				<View className="mt-4">
					<View className="">
						<StyledText type="label" className="mb-2">
							Allergies
						</StyledText>
						<Controller
							control={control}
							name="allergies"
							render={({ field: { value, onChange } }) => (
								<TextInput
									value={value}
									onChangeText={onChange}
									className={`
                        border border-light-border font-pregular dark:border-dark-border bg-white dark:bg-dark-light text-dark dark:text-main-50 rounded-lg px-6 py-2 text-sm
                        `}
									placeholderTextColor={placeholderColor}
									placeholder="type your allegies here...."
								/>
							)}
						/>
						{errors.allergies && (
							<StyledText
								fontStyle="default"
								className="px-1 text-sm text-red-500">
								{errors.allergies.message}
							</StyledText>
						)}
					</View>
					<View>
						<StyledPressable
							size="xl"
							disabled={status === "pending"}
							className={`mt-10 bg-main flex-row items-center`}
							onPress={handleSubmit(onSubmit)}>
							<StyledText
								className="text-white dark:text-main-50"
								selectable={false}
								type="subheading">
								{status === "pending" && (
									<Spin size="md" loading={status === "pending"} />
								)}
								{status !== "pending" && "Save"}
							</StyledText>
						</StyledPressable>
					</View>
				</View>
			</View>
		</Modal>
	);
};
export default AddPreference;
