import StyledPressable from "@/components/StyledPressable";
import StyledText from "@/components/StyledText";
import { Alert, ScrollView, View } from "react-native";
import { router } from "expo-router"; // Import Expo Router for navigation
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { deleteAccount } from "@/redux/actions/userActions";
import { clearToken } from "@/redux/slices/authSlice";

const DeleteAccount = () => {
	const { user, status } = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch<AppDispatch>();

	const handleDelete = () => {
		if (!user) {
			return Alert.alert("User not found!");
		}
		dispatch(deleteAccount(user.id)).then((res) => {
			if (res.meta.requestStatus === "fulfilled") {
				dispatch(clearToken());
				Alert.alert(res.payload.message);
				router.push("/(auth)/login");
			}
		});
	};

	return (
		<ScrollView
			contentContainerStyle={{ flexGrow: 1 }}
			className="flex-col w-full h-full p-4 bg-light dark:bg-dark">
			<View className="flex-col items-center justify-between w-full h-full">
				<View className="flex-1 w-full h-full">
					<StyledText
						type="heading-3"
						className="mb-8 font-bold text-center text-red-500">
						Are you sure you want to permanently delete your account?
					</StyledText>

					<StyledText className="mb-2">
						By deleting your account, the following will happen:
					</StyledText>
					<StyledText type="subheading" className="mt-2 ml-4">
						• All your personal information will be erased.
					</StyledText>
					<StyledText type="subheading" className="mt-2 ml-4">
						• All your personal preferences will be erased.
					</StyledText>
					<StyledText type="subheading" className="mt-2 ml-4">
						• All your ingredients and recipes will be erased.
					</StyledText>
					<StyledText type="subheading" className="mt-2 ml-4">
						• You will lose access to saved content and settings.
					</StyledText>
					<StyledText type="subheading" className="mt-2 ml-4">
						• This action is{" "}
						<StyledText type="subheading" className="text-red-500 font-pbold ">
							irreversible
						</StyledText>{" "}
						and cannot be undone.
					</StyledText>
				</View>

				<StyledPressable
					disabled={status === "pending"}
					onPress={handleDelete}
					size="xl"
					className="w-full p-4 mb-4 bg-red-600">
					<StyledText
						type="subheading"
						className="text-center text-white font-psemibold">
						{status === "pending"
							? "Deleting Account . . . ."
							: "Delete Account"}
					</StyledText>
				</StyledPressable>
			</View>
		</ScrollView>
	);
};

export default DeleteAccount;
