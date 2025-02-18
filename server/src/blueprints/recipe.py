import uuid

from flask import Blueprint, jsonify, request
from sqlalchemy import text
from utils.database import engine

recipes_bp = Blueprint("recipes", __name__)

@recipes_bp.route("/create_recipe/<userId>", methods=["POST"])
def create_recipe(userId):
    data = request.get_json()

    recipe_data = data.get("recipe")
    recipe_name = recipe_data.get("name")
    ingredients = recipe_data.get("ingredients")
    instructions = recipe_data.get("instructions")
    type_of_cuisine = recipe_data.get("type_of_cuisine")
    nutrient_counts = recipe_data.get("nutrient_counts")
    serve_hot_or_cold = recipe_data.get("serve_hot_or_cold")
    cooking_time = recipe_data.get("cooking_time")
    benefits = recipe_data.get("benefits")
    serve_for = recipe_data.get("serve_for")
    difficulty = recipe_data.get("difficulty")
    tags = recipe_data.get("tags")
    allergens = recipe_data.get("allergens")
    leftover_recommendations = recipe_data.get("leftover_recommendations")

    print(data)


    try:
        with engine.connect() as conn:
            user = conn.execute(text("SELECT * FROM users WHERE id = :userId"), {"userId": userId}).fetchone()
            if not user:
                return jsonify({"error": "User not found"}), 404

            recipe_id = str(uuid.uuid4())

            ingredients_text = ", ".join([f"{ingredient["measurement"]} | {ingredient["name"]}" for ingredient in ingredients])
            nutrient_counts_text = ", ".join([f"{nutrient_count["measurement"]} {nutrient_count["name"]}" for nutrient_count in nutrient_counts])
            leftover_recommendations_text = "|".join(leftover_recommendations) if leftover_recommendations else ""

            recipe_query = text(
                """
                INSERT INTO recipes (
                    id, name, ingredients, instruction, type_of_cuisine, nutrient_counts,
                    serve_hot_or_cold, cooking_time, benefits, serve_for, difficulty, tags, allergens, leftover_recommendations, user_id
                )
                VALUES (
                    :id, :name, :ingredients, :instruction, :type_of_cuisine, :nutrient_counts,
                    :serve_hot_or_cold, :cooking_time, :benefits, :serve_for, :difficulty, :tags, :allergens, :leftover_recommendations, :user_id
                )
                """
            )

            instructions_text = "|".join(instructions)

            conn.execute(recipe_query, {
                "id": recipe_id,
                "name": recipe_name,
                "ingredients": ingredients_text,
                "instruction": instructions_text,
                "type_of_cuisine": type_of_cuisine,
                "nutrient_counts": nutrient_counts_text,
                "serve_hot_or_cold": serve_hot_or_cold,
                "cooking_time": cooking_time,
                "benefits": benefits,
                "serve_for": serve_for,
                "difficulty": difficulty,
                "tags": tags,
                "allergens": allergens,
                "leftover_recommendations": leftover_recommendations_text,
                "user_id": userId
            })

            conn.commit()

            return jsonify({"message": "Recipe created successfully!", "recipe_id": recipe_id}), 201

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


# Get user all recipe
@recipes_bp.route("/user/<user_id>/recipes", methods=["GET"])
def get_user_recipes(user_id):
    try:
        with engine.connect() as conn:
            result = conn.execute(text(
                """
                SELECT * FROM recipes WHERE user_id = :user_id
                """
            ), {"user_id": user_id})

            # recipes = [dict(row) for row in result.fetchall]
            recipes = result.fetchall()
            all_recipes = []
            for recipe in recipes:
                all_recipes.append({
                    "id":recipe.id,
                    "name":recipe.name,
                    "instruction":recipe.instruction,
                    "type_of_cuisine":recipe.type_of_cuisine,
                    "nutrient_counts":recipe.nutrient_counts,
                    "serve_hot_or_cold":recipe.serve_hot_or_cold,
                    "cooking_time":recipe.cooking_time,
                    "benefits":recipe.benefits,
                    "serve_for":recipe.serve_for,
                    "difficulty":recipe.difficulty,
                    "tags":recipe.tags,
                    "allergens":recipe.allergens,
                    "ingredients":recipe.ingredients,
                    "leftover_recommendations":recipe.leftover_recommendations,
                    "user_id":recipe.user_id,
                })

            return jsonify({"recipes": all_recipes}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get the user recipe
@recipes_bp.route("/user/recipe/<recipe_id>",methods=["GET"])
def get_user_recipe(recipe_id):
  print(recipe_id)
  try:
    with engine.connect() as conn:
        result = conn.execute(text(
            """
            SELECT * FROM recipes WHERE id = :recipe_id
            """
        ), {"recipe_id": recipe_id})

        # recipes = [dict(row) for row in result.fetchall]
        recipe = result.fetchone()
        final_recipe = {
          "id":recipe.id,
          "name":recipe.name,
          "instruction":recipe.instruction,
          "type_of_cuisine":recipe.type_of_cuisine,
          "nutrient_counts":recipe.nutrient_counts,
          "serve_hot_or_cold":recipe.serve_hot_or_cold,
          "cooking_time":recipe.cooking_time,
          "benefits":recipe.benefits,
          "serve_for":recipe.serve_for,
          "difficulty":recipe.difficulty,
          "ingredients":recipe.ingredients,
          "tags":recipe.tags,
          "allergens":recipe.allergens,
          "leftover_recommendations":recipe.leftover_recommendations,
          "user_id":recipe.user_id,
        }

        return jsonify({"recipe": final_recipe}), 200
  except Exception as e:
    return jsonify({"error": str(e)}), 500

# Remove the recipe
@recipes_bp.route("/user/recipe/<recipe_id>", methods=["DELETE"])
def delete_recipe(recipe_id):
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT id FROM recipes WHERE id = :recipe_id"), {"recipe_id": recipe_id})
            recipe = result.fetchone()

            if not recipe:
                return jsonify({"error": "Recipe not found!"}), 404

            conn.execute(
                text("DELETE FROM recipes WHERE id = :recipe_id"),
                {"recipe_id": recipe_id}
            )
            conn.commit();

            return jsonify({"message": "Recipe deleted successfully!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
