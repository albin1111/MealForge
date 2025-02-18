import Loading from "@/components/Loading";
import StyledPressable from "@/components/StyledPressable";
import StyledText from "@/components/StyledText";
import StyledTextInput from "@/components/StyledTextInput";
import { images } from "@/constants";
import { handleRefresh } from "@/redux/actions/authActions";
import { editUser } from "@/redux/actions/userActions";
import { setUser } from "@/redux/slices/userSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { EditInfoSchema, TEditUser } from "@/utils/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Alert, Image, RefreshControl, ScrollView, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import axios from "@/redux/api/axios";
import { useState } from "react";

interface UploadResponse {
	message: string;
	profile_picture_url: string;
}

const EditInformation = () => {
	const { user, status } = useSelector((state: RootState) => state.user);
	const { pageLoading, accessToken } = useSelector(
		(state: RootState) => state.auth
	);
	const [profilePic, setProfilePic] = useState(user?.profile_picture_url);
	const dispatch = useDispatch<AppDispatch>();

	const onRefresh = async () => {
		await dispatch(handleRefresh(accessToken));
	};

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<TEditUser>({
		resolver: zodResolver(EditInfoSchema),
		defaultValues: {
			userName: user?.userName,
			email: user?.email,
			firstName: user?.firstName,
			lastName: user?.lastName,
		},
	});

	const onSubmit = async (data: TEditUser) => {
		if (!user?.id) {
			return Alert.alert("user id not found!");
		}
		dispatch(
			editUser({
				email: data.email,
				userName: data.userName,
				firstName: data.firstName,
				lastName: data.lastName,
				userId: user.id,
			})
		).then((res) => {
			if (res.meta.requestStatus === "fulfilled") {
				dispatch(
					setUser({
						id: user.id,
						email: data.email,
						userName: data.userName,
						firstName: data.firstName,
						lastName: data.lastName,
					})
				);
			}
		});
	};

	// Function to pick and upload profile picture
	const handleProfilePicUpload = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			Alert.alert(
				"Permission denied",
				"Permission to access photos is required."
			);
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.canceled && result.assets[0].uri) {
			await uploadProfilePicture(result.assets[0].uri);
		}
	};

	// Function to upload the selected image using axios
	const uploadProfilePicture = async (uri: string): Promise<void> => {
		const formData = new FormData();
		console.log(uri);
		formData.append("profile_picture", {
			uri,
			name: "profile.jpg",
			type: "image/jpeg",
		} as any);

		try {
			const response = await axios.post<UploadResponse>(
				"/user/profile-picture",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			const result = response.data;
			if (response.status === 200) {
				setProfilePic(result.profile_picture_url);
				Alert.alert("Success", "Profile picture updated!");
			} else {
				Alert.alert(
					"Error",
					result.message || "Failed to upload profile picture."
				);
			}
		} catch (error) {
			console.error(error);
			Alert.alert("Error", "An error occurred while uploading the picture.");
		}
	};

	if (pageLoading) return <Loading />;

	return (
		<ScrollView
			className="w-full h-full bg-light dark:bg-dark"
			refreshControl={
				<RefreshControl refreshing={pageLoading} onRefresh={onRefresh} />
			}>
			<View className="flex-col items-center w-full h-full p-4">
				<Image
					source={profilePic ? { uri: profilePic } : images.loading_light}
					resizeMode="contain"
					className="w-[100px] h-[100px] rounded-xl"
				/>

				<View className="flex-1 w-full space-y-6">
					<View className="flex-row items-center justify-center w-full mt-2">
						<StyledPressable
							onPress={handleProfilePicUpload}
							className="border border-main">
							<StyledText type="label" className="text-main">
								Change Picture
							</StyledText>
						</StyledPressable>
					</View>

					<View className="w-full">
						<Controller
							control={control}
							name="userName"
							render={({ field: { onChange, onBlur, value } }) => (
								<StyledTextInput
									className="w-full"
									title="Username"
									handleTextChange={onChange}
									value={value}
									error={errors.userName?.message}
								/>
							)}
						/>
					</View>

					<View className="flex-row w-full space-x-4">
						<View className="flex-1 w-full">
							<Controller
								control={control}
								name="firstName"
								render={({ field: { onChange, onBlur, value } }) => (
									<StyledTextInput
										className="w-full"
										title="Firstname"
										handleTextChange={onChange}
										value={value}
										error={errors.firstName?.message}
									/>
								)}
							/>
						</View>
						<View className="flex-1 w-full">
							<Controller
								control={control}
								name="lastName"
								render={({ field: { onChange, onBlur, value } }) => (
									<StyledTextInput
										className="w-full"
										title="Lastname"
										handleTextChange={onChange}
										value={value}
										error={errors.lastName?.message}
									/>
								)}
							/>
						</View>
					</View>

					<View className="w-full">
						<Controller
							control={control}
							name="email"
							render={({ field: { onChange, onBlur, value } }) => (
								<StyledTextInput
									className="w-full"
									title="Email"
									handleTextChange={onChange}
									value={value}
									error={errors.email?.message}
								/>
							)}
						/>
					</View>

					<View className="w-full pt-6">
						<StyledPressable
							disabled={status === "pending"}
							size="xl"
							onPress={handleSubmit(onSubmit)}
							className="w-full bg-main">
							<StyledText
								type="subheading"
								className="text-white dark:text-main-50">
								{status === "pending" ? "Updating..." : "Save changes"}
							</StyledText>
						</StyledPressable>
					</View>
				</View>
			</View>
		</ScrollView>
	);
};
export default EditInformation;
