import { handleRefresh } from "@/redux/actions/authActions";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import StyledText from "./StyledText";

const PersistentLogin = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { accessToken, pageLoading } = useSelector(
		(state: RootState) => state.auth
	);

	useEffect(() => {
		!accessToken && dispatch(handleRefresh(accessToken));
	}, []);

	if (pageLoading) {
		return (
			<View className="w-full h-full flex-col items-center justify-center">
				<StyledText type="title" fontStyle="Makeba" className="text-red-500">
					LOADING....
				</StyledText>
			</View>
		);
	}
	return (
		<View>
			<Text>PersistentLogin</Text>
		</View>
	);
};
export default PersistentLogin;
