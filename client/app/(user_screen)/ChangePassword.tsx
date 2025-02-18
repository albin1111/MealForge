import StyledPressable from "@/components/StyledPressable";
import StyledText from "@/components/StyledText";
import StyledTextInput from "@/components/StyledTextInput";
import { changePassword } from "@/redux/actions/userActions";
import { AppDispatch, RootState } from "@/redux/store";
import { ChangePasswordSchema, TChangePassword } from "@/utils/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const ChangePassword = () => {
	const { user, status } = useSelector((state: RootState) => state.user);

	const dispatch = useDispatch<AppDispatch>();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<TChangePassword>({
		resolver: zodResolver(ChangePasswordSchema),
	});

	const onSubmit = async (data: TChangePassword) => {
		if (!user) {
			return Alert.alert("User not found!");
		}

		dispatch(
			changePassword({
				id: user.id,
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
			})
		);
	};

	return (
		<ScrollView
			contentContainerStyle={{ flexGrow: 1 }}
			className="flex-col w-full h-full p-4 bg-light dark:bg-dark">
			<View className="flex-1 py-4 space-y-8">
				<View className="w-full">
					<Controller
						control={control}
						name="currentPassword"
						render={({ field: { onChange, onBlur, value } }) => (
							<StyledTextInput
								className="w-full"
								title="Current Password"
								handleTextChange={onChange}
								value={value}
								error={errors.currentPassword?.message}
							/>
						)}
					/>
				</View>
				<View className="w-full">
					<Controller
						control={control}
						name="retypeCurrentPassword"
						render={({ field: { onChange, onBlur, value } }) => (
							<StyledTextInput
								className="w-full"
								title="Retype Current Password"
								handleTextChange={onChange}
								value={value}
								error={errors.retypeCurrentPassword?.message}
							/>
						)}
					/>
				</View>
				<View className="w-full">
					<Controller
						control={control}
						name="newPassword"
						render={({ field: { onChange, onBlur, value } }) => (
							<StyledTextInput
								className="w-full"
								title="New Password"
								handleTextChange={onChange}
								value={value}
								error={errors.newPassword?.message}
							/>
						)}
					/>
				</View>
				<View className="w-full pt-6">
					<StyledPressable
						disabled={status === "pending"}
						onPress={handleSubmit(onSubmit)}
						size="xl"
						className="w-full bg-main">
						<StyledText
							type="subheading"
							className="text-white dark:text-main-50">
							{status === "pending" ? "Updating..." : "Save changes"}
						</StyledText>
					</StyledPressable>
				</View>
			</View>
		</ScrollView>
	);
};
export default ChangePassword;
