import { AppDispatch, RootState } from "@/redux/store";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import RecipePostCard from "../RecipePostCard";
import StyledText from "../StyledText";
import Spin from "../animations/Spin";

const BookmarkFeed = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { post, pageLoading } = useSelector((state: RootState) => state.post);

	if (pageLoading)
		return (
			<View className="flex-col items-center flex-1 w-full h-full">
				<Spin size={"md"} loading={pageLoading} />
			</View>
		);

	return (
		<View className="flex-col flex-1 w-full h-full">
			{post.length > 0 ? (
				post.map(
					(item, i) =>
						item.is_bookmarked && <RecipePostCard recipe={item} key={i} />
				)
			) : (
				<StyledText className="mx-auto my-4">You have no bookmarks yet.</StyledText>
			)}
		</View>
	);
};
export default BookmarkFeed;
