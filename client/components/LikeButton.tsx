import { Alert, Image, TouchableOpacity, View } from "react-native";
import StyledPressable from "./StyledPressable";
import { icons } from "@/constants";
import { useColorScheme } from "nativewind";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
	dislikeorundislikePost,
	likeorunlikePost,
} from "@/redux/actions/postAction";
import { useState } from "react";
import Spin from "./animations/Spin";
import { Link } from "expo-router";
import StyledText from "./StyledText";
import { RecipePost } from "@/utils/types/post";
import BookmarkButton from "./BookmarkButton";

type Props = {
	recipe: RecipePost;
};

const LikeButton: React.FC<Props> = ({ recipe }) => {
	const { colorScheme } = useColorScheme();
	const dispatch = useDispatch<AppDispatch>();
	const [loading, setLoading] = useState(false);
	const [dislikeLoading, setDislikeLoading] = useState(false);
	const { user } = useSelector((state: RootState) => state.user);
	const [isLiked, setIsLiked] = useState(recipe.is_liked);
	const [totalLikes, setTotalLikes] = useState(recipe.total_likes);
	const [isDisliked, setIsDisliked] = useState(recipe.is_disliked);
	const [totalDislikes, setTotalDislikes] = useState(recipe.total_dislikes);

	const onLikeButton = () => {
		if (!user) return;
		setLoading(true);
		dispatch(
			likeorunlikePost({
				post_id: recipe.id,
				user_id: user.id,
			})
		).then((res) => {
			if (res.meta.requestStatus === "fulfilled") {
				setLoading(false);
				// If naka like, i unlike!
				if (isLiked) {
					setTotalLikes((prev) => prev - 1);
					setIsLiked((prev) => !prev);
				} else {
					setTotalLikes((prev) => prev + 1);
					setIsLiked((prev) => !prev);
				}
			}
			if (res.meta.requestStatus === "rejected") {
				setLoading(false);
			}
		});
	};

	const onDislikeButton = () => {
		if (!user) return;
		setDislikeLoading(true);
		dispatch(
			dislikeorundislikePost({
				post_id: recipe.id,
				user_id: user.id,
			})
		).then((res) => {
			if (res.meta.requestStatus === "fulfilled") {
				setDislikeLoading(false);

				// If naka dislike, i undislike!
				if (isDisliked) {
					setTotalDislikes((prev) => prev - 1);
					setIsDisliked((prev) => !prev);
				} else {
					setTotalDislikes((prev) => prev + 1);
					setIsDisliked((prev) => !prev);
				}
			}
			if (res.meta.requestStatus === "rejected") {
				setDislikeLoading(false);
			}
		});
	};

	return (
		// <Link href={`/(home_screen)/post/${recipe.id}`} asChild>
		// 	<TouchableOpacity>
		<View className="flex-row items-center justify-between w-full px-2 pt-4">
			<View className="flex-row items-center">
				<StyledText className="flex font-psemibold">{totalLikes}</StyledText>
				<StyledText className="flex ml-1" type="xs" fontStyle="light">
					{totalLikes <= 1 ? "Like" : "Likes"}
				</StyledText>

				<StyledText className="mx-2 text-2xl ">•</StyledText>

				<StyledText className="font-psemibold">{totalDislikes}</StyledText>
				<StyledText className="ml-1" type="xs" fontStyle="light">
					{totalDislikes <= 1 ? "Dislike" : "Dislikes"}
				</StyledText>
			</View>

			<View className="flex-row items-center space-x-2">
				<BookmarkButton
					post_id={recipe.id}
					is_bookmarked={recipe.is_bookmarked}
				/>
				<StyledPressable disabled={loading} onPress={onLikeButton} size="icon">
					{loading ? (
						<Spin size="sm" loading={loading} />
					) : (
						<Image
							source={
								colorScheme === "dark"
									? isLiked
										? icons.likeOrange
										: icons.likesLightDark
									: isLiked
										? icons.likeOrange
										: icons.likesDarkLight
							}
							resizeMode="contain"
							className="w-6 h-6 ml-1"
						/>
					)}
				</StyledPressable>
				<StyledPressable
					disabled={dislikeLoading}
					onPress={onDislikeButton}
					size="icon">
					{dislikeLoading ? (
						<Spin size="sm" loading={dislikeLoading} />
					) : (
						<Image
							source={
								colorScheme === "dark"
									? isDisliked
										? icons.unlikeOrange
										: icons.unlikesLightDark
									: isDisliked
										? icons.unlikeOrange
										: icons.unlikesDarkLight
							}
							resizeMode="contain"
							className="w-6 h-6"
						/>
					)}
				</StyledPressable>
			</View>
		</View>
		// 	</TouchableOpacity>
		// </Link>
	);
};
export default LikeButton;
