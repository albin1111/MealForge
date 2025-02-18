import { AppDispatch, RootState } from "@/redux/store";
import { Image, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import RecipePostCard from "../RecipePostCard";
import StyledText from "../StyledText";
import Spin from "../animations/Spin";
import { useEffect, useState } from "react";
import { getFilteredPosts } from "@/redux/actions/postAction";
import StyledPressable from "../StyledPressable";
import { icons } from "@/constants";

const PostFeed = () => {
	const [filter, setFilter] = useState("");
	const dispatch = useDispatch<AppDispatch>();
	const { user } = useSelector((state: RootState) => state.user);
	const { post, status } = useSelector((state: RootState) => state.post);
	const { pageLoading } = useSelector((state: RootState) => state.auth);

	const handleFilter = (newFilter: string) => {
		if (!user) return;
		if (filter === newFilter) {
			setFilter("");
		} else {
			setFilter(newFilter);
		}
	};

	useEffect(() => {
		if (!user) return;
		dispatch(
			getFilteredPosts({
				userId: user.id,
				filter: filter,
			})
		);
	}, [filter, pageLoading]);

	return (
		<>
			{/* Separator */}
			<View className="flex-1 h-px mx-2 mt-4 rounded-full bg-light-border dark:bg-dark-border" />
			{/* filter */}
			<View className="flex-row items-center w-full my-1 justify-evenly">
				<StyledPressable
					onPress={() => handleFilter("Ratings")}
					className={`flex-1 px-2 py-1.5 relative rounded-md flex-row items-center w-full ${filter === "Ratings" && "bg-main"
						}`}
					size="icon">
					<StyledText
						type="label"
						className={`w-full ${filter === "Ratings" ? "text-start text-light" : "text-center"
							}`}>
						Ratings
					</StyledText>
					{filter === "Ratings" && (
						<Image
							source={icons.closeWhite}
							resizeMode="contain"
							className="absolute right-0 w-3 h-3 mr-2"
						/>
					)}
				</StyledPressable>
				<StyledPressable
					onPress={() => handleFilter("Popular")}
					className={`flex-1 px-2 py-1.5 relative rounded-md flex-row items-center w-full ${filter === "Popular" && "bg-main"
						}`}
					size="icon">
					<StyledText
						type="label"
						className={`w-full ${filter === "Popular" ? "text-start text-light" : "text-center"
							}`}>
						Popular
					</StyledText>
					{filter === "Popular" && (
						<Image
							source={icons.closeWhite}
							resizeMode="contain"
							className="absolute right-0 w-3 h-3 mr-2"
						/>
					)}
				</StyledPressable>
				<StyledPressable
					onPress={() => handleFilter("Latest")}
					className={`flex-1 px-2 py-1.5 relative rounded-md flex-row items-center w-full ${filter === "Latest" && "bg-main"
						}`}
					size="icon">
					<StyledText
						type="label"
						className={`w-full ${filter === "Latest" ? "text-start text-light" : "text-center"
							}`}>
						Latest
					</StyledText>
					{filter === "Latest" && (
						<Image
							source={icons.closeWhite}
							resizeMode="contain"
							className="absolute right-0 w-3 h-3 mr-2"
						/>
					)}
				</StyledPressable>
			</View>

			{/* Separator */}
			<View className="flex-1 h-px mx-2 rounded-full bg-light-border dark:bg-dark-border" />

			<View className="flex-col flex-1 w-full h-full">
				{status === "pending" ? (
					<View className="flex-col items-center flex-1 w-full h-full mt-4">
						<Spin size={"md"} loading={status === "pending"} />
					</View>
				) : post.length > 0 ? (
					post.map((item, i) => <RecipePostCard recipe={item} key={i} />)
				) : (
					<StyledText className="mx-auto my-4">There are no posts available yet.</StyledText>
				)}
			</View>
		</>
	);
};
export default PostFeed;
