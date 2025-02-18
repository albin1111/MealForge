import json
import os
import uuid
from datetime import datetime

from flask import Blueprint, jsonify, request
from model.GNN import get_similar_ingredients
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from utils.database import engine

ingredients_bp = Blueprint("ingredients", __name__)

@ingredients_bp.route("/user/<userId>/ingredients",methods=["GET"])
def get_ingredients(userId):
    try:
      with engine.connect() as conn:
        query = """
            SELECT
              id, name, type, measurements, expirationDate, date_added,
                CASE
                    WHEN expirationDate IS NOT NULL AND expirationDate < :current_date THEN TRUE
                    ELSE FALSE
                END AS is_expired
            FROM ingredients
            WHERE user_id = :userId
        """
        result = conn.execute(text(query),{"userId":userId,"current_date": datetime.now().strftime("%Y-%m-%d")})
        ingredients = result.fetchall()

        if not ingredients:
                return jsonify({"message": "No ingredients found for this user."}), 404

        ingredients_list = []
        for ingredient in ingredients:
              ingredients_list.append({
                  "id": str(ingredient.id),
                  "name": ingredient.name,
                  "type": ingredient.type,
                  "measurements": ingredient.measurements,
                  "expirationDate": ingredient.expirationDate,
                  "date_added": ingredient.date_added,
                  "is_expired": ingredient.is_expired
              })

        return jsonify({"ingredients": ingredients_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@ingredients_bp.route("/user/add_ingredients/<userId>", methods=["POST"])
def create_ingredient(userId):
    data = request.get_json()

    name = data.get("name")
    type = data.get("type")
    measurements = data.get("measurements")
    expiration_date = data.get("expirationDate")

    date_added = datetime.now().strftime("%Y-%m-%d")

    if not name or not measurements or not type or not userId:
        return jsonify({"error": "Missing required fields: 'name', 'measurements', and 'user_id'"}), 400

    try:
        with engine.connect() as conn:
            user_query = text("SELECT * FROM users WHERE id = :user_id")
            user_exists = conn.execute(user_query, {"user_id": userId}).fetchone()

            if not user_exists:
                return jsonify({"error": "User does not exist!"}), 404

            ingredient_id = str(uuid.uuid4())

            query = text("""
                INSERT INTO ingredients (id, name, type, measurements, expirationDate, date_added, user_id)
                VALUES (:id, :name, :type, :measurements, :expirationDate, :date_added, :user_id)
            """)

            conn.execute(query, {
                "id": ingredient_id,
                "name": name,
                "type":type,
                "measurements": measurements,
                "expirationDate": expiration_date if expiration_date else None,
                "date_added": date_added,
                "user_id": userId
            })

            conn.commit()

            return jsonify({
                "message": "Ingredient created successfully!",
                "ingredient": {
                    "id": ingredient_id,
                    "name": name,
                    "type":type,
                    "measurements": measurements,
                    "expirationDate": expiration_date,
                    "date_added": date_added,
                    "user_id": userId
                }
            }), 201

    except IntegrityError:
        return jsonify({"error": "Database integrity error occurred!"}), 409

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@ingredients_bp.route("/user/delete_ingredients/<ingredientsId>",methods=["DELETE"])
def delete_ingredients(ingredientsId):
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM ingredients WHERE id = :ingredient_id"), {"ingredient_id": ingredientsId})
            ingredient = result.fetchone()

            if not ingredient:
                return jsonify({"error": "Ingredient not found."}), 404

            conn.execute(text(
                """
                DELETE FROM ingredients
                WHERE id = :ingredientsId
                """),{"ingredientsId":ingredientsId})
            conn.commit()
            return jsonify({"message":"ingredients deleted successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@ingredients_bp.route("/user/ingredients/recommend/<ingredient>",methods=["GET"])
def recommend_ingredients(ingredient):
  try:
      result = get_similar_ingredients(ingredient)
      print(result)
      return jsonify({"recommendations":result}),200
  except Exception as e:
      return jsonify({"error":str(e)}), 500

@ingredients_bp.route("/insert-ingredients", methods=["POST"])
def insert_ingredients():
    try:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

        # Load the JSON file
        with open(os.path.join(base_dir,'data','new_unique_ner.json'), "r") as file:
            ingredients = json.load(file)

        # Prepare the insert query
        query = text("INSERT INTO dataset_ingredients (value) VALUES (:value)")

        # Batch insertion
        batch_size = 1000
        batch = []

        with engine.connect() as conn:
            for ingredient in ingredients:
                batch.append({"value": ingredient})

                # Insert batch into the database
                if len(batch) == batch_size:
                    conn.execute(query, batch)
                    batch = []

            # Insert any remaining records
            if batch:
                conn.execute(query, batch)

        return jsonify({"message": f"Inserted {len(ingredients)} ingredients successfully!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
