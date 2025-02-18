import os
import uuid

import boto3
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from sqlalchemy import text
from utils.database import engine

posts_bp = Blueprint("posts", __name__)

s3 = boto3.client(
    "s3",
    aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name = "ap-southeast-2"
);

BUCKET_NAME = "mealforgebucket"

@posts_bp.route("/user/<user_id>/recipe/<recipe_name>/create_post", methods=["POST"])
def create_post(user_id, recipe_name):
    file = request.files.get('recipe_image')
    try:
        with engine.connect() as conn:
            # Check if user and recipe exist
            user = conn.execute(text("SELECT id FROM users WHERE id = :user_id"), {"user_id": user_id}).fetchone()
            recipe = conn.execute(text("SELECT id FROM recipes WHERE name = :recipe_name"), {"recipe_name": recipe_name}).fetchone()

            if not user:
                return jsonify({"error": "User not found"}), 404
            if not recipe:
                return jsonify({"error": "Recipe not found"}), 404

            # Generate unique post ID and handle optional image upload
            post_id = str(uuid.uuid4())
            image_url = None

            if file:
                # Save the image in a "recipe_posts" folder within the S3 bucket
                file_extension = file.filename.split('.')[-1]
                file_name = f"recipe_posts/{user_id}_{post_id}.{file_extension}"

                try:
                    # Upload the file to S3
                    s3.upload_fileobj(
                        file,
                        BUCKET_NAME,
                        file_name,
                        ExtraArgs={"ContentType": file.content_type}
                    )
                    # Create the S3 file URL
                    image_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{file_name}"
                except Exception as upload_error:
                    return jsonify({"error": f"Could not upload image: {str(upload_error)}"}), 500

            # Insert the new post with the optional image URL
            conn.execute(text(
                """
                INSERT INTO recipe_posts (id, user_id, recipe_id, recipe_post_image, posted_at)
                VALUES (:id, :user_id, :recipe_id, :recipe_post_image, CURRENT_DATE)
                """
            ), {
                "id": post_id,
                "user_id": user_id,
                "recipe_id": recipe.id,
                "recipe_post_image": image_url
            })

            conn.commit()
            return jsonify({"message": "Post created successfully!", "post_id": post_id, "recipe_post_image": image_url}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete a post
@posts_bp.route("/post/<post_id>/delete", methods=["DELETE"])
def delete_post(post_id):
    try:
        with engine.connect() as conn:
            # Fetch the post along with the image URL, if available
            post = conn.execute(text(
                "SELECT id, recipe_post_image FROM recipe_posts WHERE id = :post_id"
            ), {"post_id": post_id}).fetchone()

            if not post:
                return jsonify({"error": "Post not found"}), 404

            # Delete the image from S3 if it exists
            if post.recipe_post_image:
                # Extract the S3 object key from the URL
                image_key = post.recipe_post_image.split(f"{BUCKET_NAME}.s3.amazonaws.com/")[-1]
                try:
                    s3.delete_object(Bucket=BUCKET_NAME, Key=image_key)
                except Exception as delete_error:
                    print(f"Failed to delete image from S3: {delete_error}")
                    return jsonify({"error": "Failed to delete image from S3"}), 500

            # Delete the post from the database
            conn.execute(text("DELETE FROM recipe_posts WHERE id = :post_id"), {"post_id": post_id})
            conn.commit()

            return jsonify({"message": "Post deleted successfully!", "post_id": post_id}), 200

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

# Update a post (e.g., change recipe details associated with a post)
@posts_bp.route("/post/<post_id>/update", methods=["PUT"])
def update_post(post_id):
    data = request.get_json()
    recipe_id = data.get("recipe_id")

    try:
        with engine.connect() as conn:
            # Verify the new recipe exists
            recipe = conn.execute(text("SELECT id FROM recipes WHERE id = :recipe_id"), {"recipe_id": recipe_id}).fetchone()

            if not recipe:
                return jsonify({"error": "New recipe not found"}), 404

            # Update the post with the new recipe
            conn.execute(text(
                "UPDATE recipe_posts SET recipe_id = :recipe_id WHERE id = :post_id"
            ), {"recipe_id": recipe_id, "post_id": post_id})

            conn.commit()
            return jsonify({"message": "Post updated successfully!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Like or unlike a post
@posts_bp.route("/post/<post_id>/like", methods=["POST"])
def like_unlike_post(post_id):
    data = request.get_json()
    user_id = data.get("user_id")

    try:
        with engine.connect() as conn:
            # Check if post and user exist
            post = conn.execute(text("SELECT id FROM recipe_posts WHERE id = :post_id"), {"post_id": post_id}).fetchone()
            user = conn.execute(text("SELECT id FROM users WHERE id = :user_id"), {"user_id": user_id}).fetchone()

            if not post or not user:
                return jsonify({"error": "User or Post not found"}), 404

            # Check if the user has already liked the post
            like = conn.execute(text(
                "SELECT id FROM likes WHERE user_id = :user_id AND post_id = :post_id"
            ), {"user_id": user_id, "post_id": post_id}).fetchone()

            if like:
                # Unlike the post
                conn.execute(text("DELETE FROM likes WHERE user_id = :user_id AND post_id = :post_id"), {"user_id": user_id, "post_id": post_id})
                message = "Post unliked successfully!"
            else:
                # Like the post
                like_id = str(uuid.uuid4())
                conn.execute(text(
                    "INSERT INTO likes (id, user_id, post_id, liked_at) VALUES (:id, :user_id, :post_id, CURRENT_DATE)"
                ), {"id": like_id, "user_id": user_id, "post_id": post_id})
                message = "Post liked successfully!"

            conn.commit()
            return jsonify({"message": message}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Dislike or unDislike a post
@posts_bp.route("/post/<post_id>/dislike", methods=["POST"])
def dislike_undislike_post(post_id):
    data = request.get_json()
    user_id = data.get("user_id")

    try:
        with engine.connect() as conn:
            # Check if post and user exist
            post = conn.execute(text("SELECT id FROM recipe_posts WHERE id = :post_id"), {"post_id": post_id}).fetchone()
            user = conn.execute(text("SELECT id FROM users WHERE id = :user_id"), {"user_id": user_id}).fetchone()

            if not post or not user:
                return jsonify({"error": "User or Post not found"}), 404

            # Check if the user has already liked the post
            dislikes = conn.execute(text(
                "SELECT id FROM dislikes WHERE user_id = :user_id AND post_id = :post_id"
            ), {"user_id": user_id, "post_id": post_id}).fetchone()

            if dislikes:
                # Unlike the post
                conn.execute(text("DELETE FROM dislikes WHERE user_id = :user_id AND post_id = :post_id"), {"user_id": user_id, "post_id": post_id})
                message = "Post undisliked successfully!"
            else:
                # Like the post
                like_id = str(uuid.uuid4())
                conn.execute(text(
                    "INSERT INTO dislikes (id, user_id, post_id, disliked_at) VALUES (:id, :user_id, :post_id, CURRENT_DATE)"
                ), {"id": like_id, "user_id": user_id, "post_id": post_id})
                message = "Post disliked successfully!"

            conn.commit()
            return jsonify({"message": message}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get a specific post by post ID, including bookmark info for the current user
@posts_bp.route("/post/<post_id>", methods=["GET"])
def get_post(post_id):
    user_id = request.args.get("user_id")  # Get the current user's ID from the request
    try:
        with engine.connect() as conn:
            # Fetch post and recipe details
            result = conn.execute(text(
                """
                SELECT rp.id AS post_id, rp.user_id AS post_user_id, rp.posted_at AS post_date, rp.recipe_post_image AS recipePostImage,
                r.id AS recipe_id, r.name AS recipe_name, r.ingredients AS recipe_ingredients,
                r.instruction AS recipe_instruction, r.type_of_cuisine AS recipe_cuisine,
                r.nutrient_counts AS recipe_nutrients, r.serve_hot_or_cold AS recipe_serving_temp,
                r.cooking_time AS recipe_cooking_time, r.benefits AS recipe_benefits,
                r.serve_for AS recipe_servings, r.difficulty as recipe_difficulty, r.tags as recipe_tags, r.allergens as recipe_allergens,
                r.leftover_recommendations as recipe_leftover_recommendations,
                u.userName AS author_name
                FROM recipe_posts rp
                JOIN recipes r ON rp.recipe_id = r.id
                JOIN users u ON rp.user_id = u.id
                WHERE rp.id = :post_id
                """
            ), {"post_id": post_id}).fetchone()

            if not result:
                return jsonify({"error": "Post not found"}), 404

            # Count total likes for the post
            total_likes = conn.execute(text(
                "SELECT COUNT(*) FROM likes WHERE post_id = :post_id"
            ), {"post_id": post_id}).scalar()

            # Check if the user has liked the post
            is_liked = conn.execute(text(
                "SELECT 1 FROM likes WHERE user_id = :user_id AND post_id = :post_id"
            ), {"user_id": user_id, "post_id": post_id}).fetchone() is not None

            # Count total dislikes for each post
            total_dislikes = conn.execute(text(
                "SELECT COUNT(*) FROM dislikes WHERE post_id = :post_id"
            ), {"post_id": post_id}).scalar()

            # Check if the user has disliked the post
            is_disliked = conn.execute(text(
                "SELECT 1 FROM dislikes WHERE user_id = :user_id AND post_id = :post_id"
            ), {"user_id": user_id, "post_id": post_id}).fetchone() is not None

            # Check if the user has bookmarked the post
            is_bookmarked = conn.execute(text(
                "SELECT 1 FROM bookmarks WHERE user_id = :user_id AND post_id = :post_id"
            ), {"user_id": user_id, "post_id": post_id}).fetchone() is not None

            # Fetch the user's specific rating for the post
            avg_rating = conn.execute(
                text("""
                    SELECT AVG(rating) AS average_rating
                    FROM ratings
                    WHERE post_id = :post_id
                """), {"post_id": post_id}).scalar()

            ratings = round(avg_rating, 1) if avg_rating else 0

            post = {
                "id": result.post_id,
                "user_id": result.post_user_id,
                "posted_at": result.post_date,
                "recipe_post_image": result.recipePostImage,
                "recipe": {
                    "id": result.recipe_id,
                    "name": result.recipe_name,
                    "ingredients": result.recipe_ingredients,
                    "instruction": result.recipe_instruction,
                    "type_of_cuisine": result.recipe_cuisine,
                    "nutrient_counts": result.recipe_nutrients,
                    "serve_hot_or_cold": result.recipe_serving_temp,
                    "cooking_time": result.recipe_cooking_time,
                    "benefits": result.recipe_benefits,
                    "serve_for": result.recipe_servings,
                    "difficulty": result.recipe_difficulty,
                    "tags": result.recipe_tags,
                    "allergens": result.recipe_allergens,
                    "leftover_recommendations": result.recipe_leftover_recommendations,
                },
                "author": result.author_name,
                "is_bookmarked": is_bookmarked,
                "total_likes": total_likes,
                "is_liked": is_liked,
                "total_dislikes": total_dislikes,
                "is_disliked": is_disliked,
                "avg_rating": ratings
            }
            return jsonify({"post": post}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get all posts for the home page feed, including all recipe details and bookmark info for the current user
@posts_bp.route("/posts", methods=["GET"])
def get_all_posts():
    user_id = request.args.get("user_id")
    limit = int(request.args.get("limit", 10))  # Default limit to 10 posts
    offset = int(request.args.get("offset", 3))  # Default offset to 0

    try:
        with engine.connect() as conn:
            result = conn.execute(text(
                """
                SELECT rp.id AS post_id, rp.user_id AS post_user_id, rp.posted_at AS post_date, rp.recipe_post_image AS recipePostImage,
                r.id AS recipe_id, r.name AS recipe_name, r.ingredients AS recipe_ingredients,
                r.instruction AS recipe_instruction, r.type_of_cuisine AS recipe_cuisine,
                r.nutrient_counts AS recipe_nutrients, r.serve_hot_or_cold AS recipe_serving_temp,
                r.cooking_time AS recipe_cooking_time, r.benefits AS recipe_benefits,
                r.serve_for AS recipe_servings, r.difficulty as recipe_difficulty, r.tags as recipe_tags, r.allergens as recipe_allergens,
                u.userName AS author_name
                FROM recipe_posts rp
                JOIN recipes r ON rp.recipe_id = r.id
                JOIN users u ON rp.user_id = u.id
                ORDER BY rp.posted_at DESC
                LIMIT :limit OFFSET :offset
                """
            ), {"limit": limit, "offset": offset})

            posts = []
            for row in result:
                total_likes = conn.execute(text(
                    "SELECT COUNT(*) FROM likes WHERE post_id = :post_id"
                ), {"post_id": row.post_id}).scalar()

                is_liked = conn.execute(text(
                    "SELECT 1 FROM likes WHERE user_id = :user_id AND post_id = :post_id"
                ), {"user_id": user_id, "post_id": row.post_id}).fetchone() is not None

                total_dislikes = conn.execute(text(
                    "SELECT COUNT(*) FROM dislikes WHERE post_id = :post_id"
                ), {"post_id": row.post_id}).scalar()

                is_disliked = conn.execute(text(
                    "SELECT 1 FROM dislikes WHERE user_id = :user_id AND post_id = :post_id"
                ), {"user_id": user_id, "post_id": row.post_id}).fetchone() is not None

                is_bookmarked = conn.execute(text(
                    "SELECT 1 FROM bookmarks WHERE user_id = :user_id AND post_id = :post_id"
                ), {"user_id": user_id, "post_id": row.post_id}).fetchone() is not None

                avg_rating = conn.execute(
                text("""
                    SELECT AVG(rating) AS average_rating
                    FROM ratings
                    WHERE post_id = :post_id
                    """), {"post_id": row.post_id}).scalar()

                ratings = round(avg_rating, 1) if avg_rating else 0

                posts.append({
                    "id": row.post_id,
                    "user_id": row.post_user_id,
                    "posted_at": row.post_date,
                    "recipe_post_image": row.recipePostImage,
                    "recipe": {
                        "id": row.recipe_id,
                        "name": row.recipe_name,
                        "ingredients": row.recipe_ingredients,
                        "instruction": row.recipe_instruction,
                        "type_of_cuisine": row.recipe_cuisine,
                        "nutrient_counts": row.recipe_nutrients,
                        "serve_hot_or_cold": row.recipe_serving_temp,
                        "cooking_time": row.recipe_cooking_time,
                        "benefits": row.recipe_benefits,
                        "difficulty": row.recipe_difficulty,
                        "tags": row.recipe_tags,
                        "leftover_recommendations": row.leftover_recommendations
                    },
                    "author": row.author_name,
                    "is_bookmarked": is_bookmarked,
                    "total_likes": total_likes,
                    "is_liked": is_liked,
                    "total_dislikes": total_dislikes,
                    "is_disliked": is_disliked,
                    "avg_rating": ratings
                })

            return jsonify({"posts": posts }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get all posts by a specific user for profile feed, including all recipe details and bookmark info
@posts_bp.route("/user/<user_id>/posts", methods=["GET"])
def get_all_user_posts(user_id):
    try:
        with engine.connect() as conn:
            result = conn.execute(text(
                """
                SELECT rp.id AS post_id, rp.user_id, rp.posted_at,
                rp.recipe_post_image as recipePostImage,
                r.id AS recipe_id, r.name, r.ingredients, r.instruction,
                r.type_of_cuisine, r.nutrient_counts, r.serve_hot_or_cold,
                r.cooking_time, r.benefits, r.serve_for, r.difficulty as recipe_difficulty, r.tags, as recipe_tags, r.allergens as recipe_allergens,
                r.leftover_recommendations as recipe_leftover_recommendations,
                u.userName AS author
                FROM recipe_posts rp
                JOIN recipes r ON rp.recipe_id = r.id
                JOIN users u ON rp.user_id = u.id
                WHERE rp.user_id = :user_id
                ORDER BY rp.posted_at DESC
                """
            ), {"user_id": user_id})

            user_posts = []
            for row in result:
                bookmarks = conn.execute(text(
                    "SELECT user_id FROM bookmarks WHERE post_id = :post_id"
                ), {"post_id": row.post_id}).fetchall()
                bookmark_list = [bookmark.user_id for bookmark in bookmarks]

                # Fetch the user's specific rating for the post
                avg_rating = conn.execute(
                text("""
                    SELECT AVG(rating) AS average_rating
                    FROM ratings
                    WHERE post_id = :post_id
                    """), {"post_id": row.post_id}).scalar()

                ratings = round(avg_rating, 1) if avg_rating else 0

                post = {
                    "id": row.post_id,
                    "user_id": row.user_id,
                    "posted_at": row.posted_at,
                    "recipe_post_image":row.recipePostImage,
                    "recipe": {
                        "id": row.recipe_id,
                        "name": row.name,
                        "ingredients": row.ingredients,
                        "instruction": row.instruction,
                        "type_of_cuisine": row.type_of_cuisine,
                        "nutrient_counts": row.nutrient_counts,
                        "serve_hot_or_cold": row.serve_hot_or_cold,
                        "cooking_time": row.cooking_time,
                        "benefits": row.benefits,
                        "serve_for": row.serve_for,
                        "difficulty": row.recipe_difficulty,
                        "tags": row.recipe_tags,
                        "allergens": row.recipe_allergens,
                        "leftover_recommendations": row.recipe_leftover_recommendations
                    },
                    "author": row.author,
                    "bookmarks": bookmark_list,
                    "avg_rating":ratings
                }
                user_posts.append(post)

            return jsonify({"user_posts": user_posts}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Bookmark or unbookmark a post
@posts_bp.route("/post/<post_id>/bookmark", methods=["POST"])
def bookmark_unbookmark_post(post_id):
    data = request.get_json()
    user_id = data.get("user_id")

    try:
        with engine.connect() as conn:
            # Check if post and user exist
            post = conn.execute(text("SELECT id FROM recipe_posts WHERE id = :post_id"), {"post_id": post_id}).fetchone()
            user = conn.execute(text("SELECT id FROM users WHERE id = :user_id"), {"user_id": user_id}).fetchone()

            if not post or not user:
                return jsonify({"error": "User or Post not found"}), 404

            # Check if the user has already bookmarked the post
            bookmark = conn.execute(text(
                "SELECT id FROM bookmarks WHERE user_id = :user_id AND post_id = :post_id"
            ), {"user_id": user_id, "post_id": post_id}).fetchone()

            if bookmark:
                # Unbookmark the post
                conn.execute(text("DELETE FROM bookmarks WHERE user_id = :user_id AND post_id = :post_id"), {"user_id": user_id, "post_id": post_id})
                message = "Post unbookmarked successfully!"
            else:
                # Bookmark the post
                bookmark_id = str(uuid.uuid4())
                conn.execute(text(
                    "INSERT INTO bookmarks (id, user_id, post_id, bookmarked_at) VALUES (:id, :user_id, :post_id, CURRENT_DATE)"
                ), {"id": bookmark_id, "user_id": user_id, "post_id": post_id})
                message = "Post bookmarked successfully!"

            conn.commit()
            return jsonify({"message": message}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# fetch user all bookmarked post
@posts_bp.route("/user/<user_id>/bookmarked_posts", methods=["GET"])
def get_user_bookmarked_posts(user_id):
    try:
        with engine.connect() as conn:
            # Query to get all bookmarked posts by the user, including full recipe details
            result = conn.execute(text(
                """
                SELECT rp.user_id as user_id, rp.id AS post_id, rp.posted_at AS post_date,
                r.id AS recipe_id, r.name AS recipe_name, r.ingredients AS recipe_ingredients,
                r.instruction AS recipe_instruction, r.type_of_cuisine AS recipe_cuisine,
                r.nutrient_counts AS recipe_nutrients, r.serve_hot_or_cold AS recipe_serving_temp,
                r.cooking_time AS recipe_cooking_time, r.benefits AS recipe_benefits,
                r.serve_for AS recipe_servings, u.userName AS author_name
                FROM bookmarks b
                JOIN recipe_posts rp ON b.post_id = rp.id
                JOIN recipes r ON rp.recipe_id = r.id
                JOIN users u ON rp.user_id = u.id
                WHERE b.user_id = :user_id
                ORDER BY rp.posted_at DESC
                """
            ), {"user_id": user_id}).fetchall()

            # # Check if the user has any bookmarks
            # if not result:
            #     return jsonify({"message": "No bookmarks found for this user."}), 404

            # Structure the data for each bookmarked post with recipe details
            bookmarked_posts = []
            for row in result:
                bookmarked_posts.append({
                    "id": row.post_id,
                    "posted_at": row.post_date,
                    "user_id":row.user_id,
                    "recipe": {
                        "id": row.recipe_id,
                        "name": row.recipe_name,
                        "ingredients": row.recipe_ingredients,
                        "instruction": row.recipe_instruction,
                        "type_of_cuisine": row.recipe_cuisine,
                        "nutrient_counts": row.recipe_nutrients,
                        "serve_hot_or_cold": row.recipe_serving_temp,
                        "cooking_time": row.recipe_cooking_time,
                        "benefits": row.recipe_benefits,
                        "serve_for": row.recipe_servings,
                    },
                    "author": row.author_name,
                })

            return jsonify({"bookmarked_posts": bookmarked_posts}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Fetch all posts filtered by popularity or latest or ratings
@posts_bp.route("/posts/filtered", methods=["GET"])
def get_all_posts_filtered():
    filter_type = request.args.get("filter", "Latest")
    user_id = request.args.get("user_id")

    try:
        with engine.connect() as conn:
            if filter_type == "Latest":
                order_by_clause = "ORDER BY rp.posted_at DESC"
            elif filter_type == "Popular":
                order_by_clause = "ORDER BY total_likes DESC"
            elif filter_type == "Ratings":
                order_by_clause = "ORDER BY avg_rating DESC"
            else:
                # Default case
                order_by_clause = ""

            # Query to get posts along with total likes, dislikes, and ratings
            result = conn.execute(text(
                f"""
                SELECT rp.id AS post_id, rp.user_id AS post_user_id, rp.posted_at AS post_date, rp.recipe_post_image AS recipePostImage,
                r.id AS recipe_id, r.name AS recipe_name, r.ingredients AS recipe_ingredients,
                r.instruction AS recipe_instruction, r.type_of_cuisine AS recipe_cuisine,
                r.nutrient_counts AS recipe_nutrients, r.serve_hot_or_cold AS recipe_serving_temp,
                r.cooking_time AS recipe_cooking_time, r.benefits AS recipe_benefits,
                r.serve_for AS recipe_servings, r.difficulty as recipe_difficulty, r.tags as recipe_tags, r.allergens as recipe_allergens,
                r.leftover_recommendations as recipe_leftover_recommendations,
                u.userName AS author_name,
                (SELECT COUNT(*) FROM likes WHERE post_id = rp.id) AS total_likes,
                (SELECT COUNT(*) FROM dislikes WHERE post_id = rp.id) AS total_dislikes,
                (SELECT AVG(rating) FROM ratings WHERE post_id = rp.id) AS avg_rating
                FROM recipe_posts rp
                JOIN recipes r ON rp.recipe_id = r.id
                JOIN users u ON rp.user_id = u.id
                GROUP BY rp.id, r.id, u.id
                {order_by_clause}
                """
            ))

            posts = []
            for row in result:
                # Check if the user has liked, disliked, or bookmarked each post
                is_liked = conn.execute(text(
                    "SELECT 1 FROM likes WHERE user_id = :user_id AND post_id = :post_id"
                ), {"user_id": user_id, "post_id": row.post_id}).fetchone() is not None

                is_disliked = conn.execute(text(
                    "SELECT 1 FROM dislikes WHERE user_id = :user_id AND post_id = :post_id"
                ), {"user_id": user_id, "post_id": row.post_id}).fetchone() is not None

                is_bookmarked = conn.execute(text(
                    "SELECT 1 FROM bookmarks WHERE user_id = :user_id AND post_id = :post_id"
                ), {"user_id": user_id, "post_id": row.post_id}).fetchone() is not None

                # Fetch the user's specific rating for the post
                avg_rating = round(row.avg_rating, 1) if row.avg_rating else 0

                # Construct post data with required fields
                post = {
                    "id": row.post_id,
                    "user_id": row.post_user_id,
                    "posted_at": row.post_date,
                    "recipe_post_image": row.recipePostImage,
                    "recipe": {
                        "id": row.recipe_id,
                        "name": row.recipe_name,
                        "ingredients": row.recipe_ingredients,
                        "instruction": row.recipe_instruction,
                        "type_of_cuisine": row.recipe_cuisine,
                        "nutrient_counts": row.recipe_nutrients,
                        "serve_hot_or_cold": row.recipe_serving_temp,
                        "cooking_time": row.recipe_cooking_time,
                        "benefits": row.recipe_benefits,
                        "serve_for": row.recipe_servings,
                        "difficulty": row.recipe_difficulty,
                        "tags": row.recipe_tags,
                        "allergens": row.recipe_allergens,
                        "leftover_recommendations": row.recipe_leftover_recommendations
                    },
                    "author": row.author_name,
                    "total_likes": row.total_likes,
                    "total_dislikes": row.total_dislikes,
                    "is_liked": is_liked,
                    "is_disliked": is_disliked,
                    "is_bookmarked": is_bookmarked,
                    "avg_rating": avg_rating
                }
                posts.append(post)

            return jsonify({"posts": posts}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Search recipe name or ingredients
@posts_bp.route("/post/search", methods=["GET"])
def search_recipe():
    query = request.args.get("query", "").strip()
    search_query = f"%{query.lower()}%"
    if not query:
        return jsonify({"error": "A search query is required"}), 400

    try:
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT rp.id AS post_id, rp.recipe_post_image AS recipePostImage,r.name AS recipe_name,
                r.ingredients as recipe_ingredients
                FROM recipe_posts rp
                JOIN recipes r ON rp.recipe_id = r.id
                WHERE LOWER(r.name) LIKE :query
                OR LOWER(r.ingredients) LIKE :query
            """), {"query": search_query})

            # Process the results
            search_posts = []
            for row in result:
                post = {
                    "id": row.post_id,
                    "recipe_name": row.recipe_name,
                    "recipe_ingredients": row.recipe_ingredients,
                    "recipe_post_image": row.recipePostImage
                }
                search_posts.append(post)

            return jsonify({"searchPost": search_posts}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# fetch posts ratings
@posts_bp.route("/post/<post_id>/ratings", methods=["GET"])
def get_recipe_post_ratings(post_id):
    try:
        with engine.connect() as conn:
            result = conn.execute(
                text("""
                    SELECT r.rating, r.rated_at, u.userName, u.id
                    FROM ratings r
                    JOIN users u ON r.user_id = u.id
                    WHERE r.post_id = :post_id
                """), {"post_id": post_id}
            )

            ratings = [
                {"id":row.id,"userName": row.userName, "rating": row.rating, "rated_at": row.rated_at}
                for row in result
            ]

            return jsonify({"ratings": ratings}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Give post a rating
@posts_bp.route("/post/<post_id>/rate", methods=["POST"])
def rate_recipe_post(post_id):
    data = request.get_json()
    user_id = data.get("user_id")
    rating = data.get("rating")

    # Validate input
    if not isinstance(rating, (int, float)) or not (1 <= rating <= 5):
        return jsonify({"error": "Rating must be a number between 1 and 5"}), 400

    try:
        with engine.connect() as conn:
            # Check if the recipe post exists
            post = conn.execute(
                text("SELECT id FROM recipe_posts WHERE id = :post_id"),
                {"post_id": post_id}
            ).fetchone()
            if not post:
                return jsonify({"error": "Recipe post not found"}), 404

            # Check if the user has already rated this post
            existing_rating = conn.execute(
                text("""
                    SELECT id FROM ratings
                    WHERE user_id = :user_id AND post_id = :post_id
                """), {"user_id": user_id, "post_id": post_id}
            ).fetchone()

            if existing_rating:
                return jsonify({"error": "User has already rated this recipe post"}), 400

            # Insert the rating
            rating_id = str(uuid.uuid4())
            conn.execute(
                text("""
                    INSERT INTO ratings (id, user_id, post_id, rating, rated_at)
                    VALUES (:id, :user_id, :post_id, :rating, CURRENT_DATE)
                """), {
                    "id": rating_id,
                    "user_id": user_id,
                    "post_id": post_id,
                    "rating": rating
                }
            )

            # Calculate the new average rating
            avg_rating = conn.execute(
                text("""
                    SELECT AVG(rating) AS average_rating
                    FROM ratings
                    WHERE post_id = :post_id
                """), {"post_id": post_id}
            ).scalar()

            conn.commit()

            # Return success response
            return jsonify({
                "message": "Rating added successfully!",
                "rating_id": rating_id,
                "user_rating": rating,
                "average_rating": round(avg_rating, 1)
            }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
