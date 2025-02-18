import { useDispatch, useSelector } from "react-redux";
import StyledPressable from "./StyledPressable";
import { AppDispatch, RootState } from "@/redux/store";
import Spin from "./animations/Spin";
import { Alert, Image } from "react-native";
import { icons } from "@/constants";
import { useColorScheme } from "nativewind";
import { BookmarkPost } from "@/redux/actions/postAction";
import { useState } from "react";

type Props = {
	post_id: string | undefined;
	is_bookmarked: boolean | undefined;
};

const BookmarkButton: React.FC<Props> = ({ post_id, is_bookmarked }) => {
	const { colorScheme } = useColorScheme();
	const dispatch = useDispatch<AppDispatch>();
	const [loading, setLoading] = useState(false);
	const { user } = useSelector((state: RootState) => state.user);
	const [isBookmarked, setIsBookmarked] = useState(is_bookmarked);

	const handleBookmarkPost = () => {
		if (!user || !post_id) return;
		setLoading(true);
		dispatch(
			BookmarkPost({
				user_id: user.id,
				post_id,
			})
		).then((res) => {
			if (res.meta.requestStatus === "fulfilled") {
				setLoading(false);
				setIsBookmarked((prev) => !prev);
			}
			if (res.meta.requestStatus === "rejected") {
				setLoading(false);
			}
		});
	};

	return (
		<StyledPressable
			disabled={loading}
			onPress={handleBookmarkPost}
			size="icon"
			className="">
			{loading ? (
				<Spin size="md" loading={loading} />
			) : (
				<Image
					source={
						colorScheme === "dark"
							? isBookmarked
								? icons.bookmarkOrange
								: icons.bookmarkLightDark
							: isBookmarked
							? icons.bookmarkOrange
							: icons.bookmarkDarkLight
					}
					resizeMode="contain"
					className="w-5 h-5"
				/>
			)}
		</StyledPressable>
	);
};
export default BookmarkButton;
