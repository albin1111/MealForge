import Loading from "@/components/Loading";
import StyledPressable from "@/components/StyledPressable";
import StyledText from "@/components/StyledText";
import StyledTextInput from "@/components/StyledTextInput";
import { icons } from "@/constants";
import { useThemeColors } from "@/constants/colors";
import { handleRefresh } from "@/redux/actions/authActions";
import { addSpecifications } from "@/redux/actions/userActions";
import { setUser } from "@/redux/slices/userSlice";
import { RootState, AppDispatch } from "@/redux/store";
import {
	TUserSpecification,
	UserSpecificationSchema,
} from "@/utils/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Image, RefreshControl, ScrollView, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list-expo";
import { useSelector, useDispatch } from "react-redux";

const UserPreferences = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { user, status } = useSelector((state: RootState) => state.user);
	const { pageLoading, accessToken } = useSelector(
		(state: RootState) => state.auth
	);

	const { colorScheme } = useColorScheme();
	const { textColor, borderColor, inputBgColor } = useThemeColors();

	const [edit, setEdit] = useState(false);

	const onRefresh = async () => {
		await dispatch(handleRefresh(accessToken));
	};

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<TUserSpecification>({
		resolver: zodResolver(UserSpecificationSchema),
		defaultValues: {
			height: user?.height,
			weight: user?.weight,
			age: user?.age,
			gender: user?.gender,
		},
	});

	const onSubmit = async (data: TUserSpecification) => {
		if (!user?.id) {
			return Alert.alert("user id not found!");
		}

		dispatch(
			addSpecifications({
				height: data.height,
				weight: data.weight,
				age: data.age,
				gender: data.gender,
				userId: user?.id,
			})
		).then((res) => {
			if (res.meta.requestStatus === "fulfilled") {
				dispatch(
					setUser({
						...user,
						height: data.height,
						weight: data.weight,
						age: data.age,
						gender: data.gender,
					})
				);
			}
		});
	};

	const handleCancel = () => {
		reset();
		setEdit(false);
	};

	if (pageLoading) return <Loading />;
	return (
		<>
			<ScrollView
				contentContainerStyle={{ flexGrow: 1 }}
				className="w-full h-screen bg-light dark:bg-dark"
				refreshControl={
					<RefreshControl refreshing={pageLoading} onRefresh={onRefresh} />
				}>
				<View className="flex-col w-full h-full">
					<View className="p-4">
						<StyledText className="text-3xl font-chunk">
							User Specifications
						</StyledText>
					</View>

					{/* Form */}
					{edit ? (
						<View className="w-full flex-col space-y-4 p-4">
							<View className="flex-1 w-full">
								<Controller
									control={control}
									name="height"
									render={({ field: { onChange, value } }) => (
										<StyledTextInput
											className="w-full"
											title="Height (cm)"
											keyboardType="numeric"
											handleTextChange={onChange}
											value={value}
											error={errors.height?.message}
										/>
									)}
								/>
							</View>

							<View className="flex-1 w-full">
								<Controller
									control={control}
									name="weight"
									render={({ field: { onChange, value } }) => (
										<StyledTextInput
											className="w-full"
											title="Weight (kg)"
											keyboardType="numeric"
											handleTextChange={onChange}
											value={value}
											error={errors.weight?.message}
										/>
									)}
								/>
							</View>

							<View className="flex-1 w-full">
								<Controller
									control={control}
									name="age"
									render={({ field: { onChange, value } }) => (
										<StyledTextInput
											className="w-full"
											title="Age"
											keyboardType="numeric"
											handleTextChange={onChange}
											value={value}
											error={errors.age?.message}
										/>
									)}
								/>
							</View>

							<View className="flex-1 w-full">
								<StyledText className="mb-2 px-4">Gender</StyledText>
								<Controller
									control={control}
									name="gender"
									render={({ field: { onChange, value } }) => (
										<SelectList
											data={[
												{
													key: 1,
													value: "Male",
												},
												{
													key: 2,
													value: "Female",
												},
												{
													key: 3,
													value: "Other",
												},
												{
													key: 4,
													value: "Prefer not to say",
												},
											]}
											save="value"
											setSelected={(selectedValue: string) => {
												onChange(selectedValue);
											}}
											inputStyles={{
												color: textColor,
												fontSize: 14,
												fontFamily: "Poppins-Regular",
												paddingVertical: 4,
											}}
											boxStyles={{
												backgroundColor: inputBgColor,
												borderColor: borderColor,
												borderRadius: 8,
											}}
											dropdownStyles={{
												backgroundColor: inputBgColor,
												borderColor: borderColor,
												borderRadius: 8,
											}}
											dropdownTextStyles={{
												color: textColor,
												fontSize: 14,
												fontFamily: "Poppins-Regular",
											}}
											searchicon={
												<Image
													source={
														colorScheme === "light"
															? icons.searchDarkLight
															: icons.searchLightDark
													}
													resizeMode="contain"
													className="w-4 h-4 mr-2"
												/>
											}
											closeicon={
												<Image
													source={
														colorScheme === "light"
															? icons.closeDarkLight
															: icons.closeLightDark
													}
													resizeMode="contain"
													className="w-5 h-5 ml-2"
												/>
											}
											arrowicon={
												<Image
													source={
														colorScheme === "dark"
															? icons.arrowDownLight
															: icons.arrowDownDark
													}
													resizeMode="contain"
													className="w-4 h-4"
												/>
											}
										/>
									)}
								/>
								{errors.gender && (
									<StyledText
										fontStyle="default"
										className="mt-2 ml-3 text-sm text-red-500">
										* {errors.gender.message}
									</StyledText>
								)}
							</View>
						</View>
					) : (
						<View className="w-full flex-col space-y-4 p-4">
							<View className="flex-col ">
								<StyledText
									type="label"
									fontStyle="default"
									className="px-2 mb-2">
									Height (cm)
								</StyledText>
								<StyledText className="px-6 py-4 rounded-lg dark:bg-dark-light ">
									{user?.height ? user.height : "N/A"}
								</StyledText>
							</View>

							<View className="flex-col ">
								<StyledText
									type="label"
									fontStyle="default"
									className="px-2 mb-2">
									Weight (kg)
								</StyledText>
								<StyledText className="px-6 py-4 rounded-lg dark:bg-dark-light ">
									{user?.weight ? user.weight : "N/A"}
								</StyledText>
							</View>

							<View className="flex-col ">
								<StyledText
									type="label"
									fontStyle="default"
									className="px-2 mb-2">
									Age
								</StyledText>
								<StyledText className="px-6 py-4 rounded-lg dark:bg-dark-light ">
									{user?.age ? user.age : "N/A"}
								</StyledText>
							</View>

							<View className="flex-col ">
								<StyledText
									type="label"
									fontStyle="default"
									className="px-2 mb-2">
									Gender
								</StyledText>
								<StyledText className="px-6 py-4 rounded-lg dark:bg-dark-light ">
									{user?.gender ? user.gender : "N/A"}
								</StyledText>
							</View>
						</View>
					)}

					{/* Buttons */}
					{!edit ? (
						<View className="flex-row items-center justify-end gap-2 p-4">
							<StyledPressable
								className="bg-main flex-1"
								onPress={() => setEdit(true)}>
								<StyledText>Update</StyledText>
							</StyledPressable>
						</View>
					) : (
						<View className="flex-row items-center justify-end gap-2 p-4">
							<StyledPressable
								disabled={status === "pending"}
								className="bg-main flex-1"
								onPress={handleSubmit(onSubmit)}>
								<StyledText>
									{status === "pending" ? "Saving..." : "Save"}
								</StyledText>
							</StyledPressable>
							<StyledPressable
								disabled={status === "pending"}
								className="bg-red-500 flex-1"
								onPress={handleCancel}>
								<StyledText>Cancel</StyledText>
							</StyledPressable>
						</View>
					)}
				</View>
			</ScrollView>
		</>
	);
};
export default UserPreferences;
