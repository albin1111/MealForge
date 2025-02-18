import DarkBgOverlay from "@/components/DarkBgOverlay";
import Header from "@/components/DrawerUI/Header";
import Ingredients from "@/components/DrawerUI/Ingredients";
import Seasonings from "@/components/DrawerUI/Seasonings";
import Loading from "@/components/Loading";
import ExpiredIngredients from "@/components/modals/ExpiredIngredients";
import StyledPressable from "@/components/StyledPressable";
import StyledText from "@/components/StyledText";
import { icons } from "@/constants";
import { handleRefresh } from "@/redux/actions/authActions";
import { getIngredients } from "@/redux/actions/ingredientsAction";
import { AppDispatch, RootState } from "@/redux/store";
import { TIngredients } from "@/utils/types/ingredients";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { Fragment, useEffect, useState } from "react";
import { Image, RefreshControl, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

type selectedTabProps = "main ingredient" | "seasoning";

const drawer = () => {
	const { colorScheme } = useColorScheme();
	const [expiredIngredientsModal, setExpiredIngredientsModal] =
		useState<boolean>(false);
	const [selectedTab, setSelectedTab] =
		useState<selectedTabProps>("main ingredient");
	const [expiredIngredients, setExpiredIngredients] = useState<TIngredients[]>(
		[]
	);

	const dispatch = useDispatch<AppDispatch>();
	const { user } = useSelector((state: RootState) => state.user);
	const { ingredients } = useSelector((state: RootState) => state.ingredients);
	const { pageLoading, accessToken } = useSelector(
		(state: RootState) => state.auth
	);

	const onRefresh = async () => {
		dispatch(handleRefresh(accessToken)).then((res) => {
			if (res.meta.requestStatus === "fulfilled") {
				if (!user?.id) {
					return;
				}
				dispatch(getIngredients(user.id));
			}
		});
	};

	const onClose = () => {
		setExpiredIngredientsModal(false);
	};

	useEffect(() => {
		if (!user?.id) return console.log("no userid");
		if (pageLoading || ingredients.length <= 0) {
			dispatch(getIngredients(user.id));
		}
	}, [pageLoading]);

	useEffect(() => {
		const expired = ingredients.filter((item) => item.is_expired);
		setExpiredIngredients(expired);
		setExpiredIngredientsModal(expired.length > 0);
	}, []);

	if (pageLoading) return <Loading />;

	return (
		<Fragment>
			<ScrollView
				className="w-full bg-light dark:bg-dark "
				refreshControl={
					<RefreshControl refreshing={pageLoading} onRefresh={onRefresh} />
				}>
				<View className="flex-col items-center w-full h-full">
					<Header />

					{/* Tabs */}
					<View className="flex-row px-8 space-x-4">
						<StyledPressable
							onPress={() => setSelectedTab("main ingredient")}
							className={`rounded-none pt-0 mt-0 ${selectedTab === "main ingredient"
								? "border-b  border-main opacity-100"
								: "opacity-60"
								}`}>
							<StyledText>Main Ingredients</StyledText>
						</StyledPressable>
						<StyledPressable
							onPress={() => setSelectedTab("seasoning")}
							className={`rounded-none pt-0 mt-0 ${selectedTab === "seasoning"
								? "border-b  border-main opacity-100"
								: "opacity-60"
								}`}>
							<StyledText>Secondary Ingredients</StyledText>
						</StyledPressable>
					</View>

					{selectedTab === "main ingredient" && <Ingredients />}
					{selectedTab === "seasoning" && <Seasonings />}
				</View>
			</ScrollView>
			<StyledPressable
				size="icon"
				className="absolute rounded-full bottom-5 right-5 bg-main"
				onPress={() => router.push("/(user_screen)/AddIngredients")}>
				<Image
					source={colorScheme === "light" ? icons.plusWhite : icons.plus}
					resizeMode="contain"
					className="w-12 h-12 rounded-full"
				/>
			</StyledPressable>
			{expiredIngredientsModal && <DarkBgOverlay />}
			<ExpiredIngredients
				isVisible={expiredIngredientsModal}
				onClose={onClose}
				expiredIngredients={expiredIngredients}
			/>
		</Fragment>
	);
};
export default drawer;
