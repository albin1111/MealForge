import json
import traceback

import google.generativeai as genai
from flask import Blueprint, jsonify, request
from model.NLP import generateRecipe
from utils.generateQuery import generateQuery

generate_bp = Blueprint("generate", __name__)


@generate_bp.route("/generate/recipe", methods=["POST"])
def generate():
    data = request.get_json()

    main_ingredients = data.get("main_ingredients", [])
    seasonings = data.get("seasonings", [])

    ingredients = main_ingredients + seasonings
    server_for = data.get("serve_for", 1)
    height = data.get("height")
    weight = data.get("weight")
    age = data.get("age")
    gender = data.get("gender")

    print(main_ingredients)
    print(seasonings)
    print(ingredients)

    if not height or not weight or not age or not gender:
        return jsonify({'error':'Either from height, weight, age or gender is miising!'}),404


    try:
        recommended_recipes = generateRecipe(ingredients)
        print(recommended_recipes)

        if not recommended_recipes:
          return jsonify({"error": "No matching recipes found for the provided ingredients."}), 404

        response = generateQuery(ingredients, recommended_recipes,server_for,height,weight,age,gender)

        json_response = response.candidates[0].content.parts[0].text

        if json_response.startswith("```json"):
            json_response = json_response[7:]

        json_response = json_response.strip("` \n")
        parsed_response = json.loads(json_response)

        return jsonify(parsed_response), 200
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {str(e)}")
        print(f"Problematic JSON: {json_response}")
        return jsonify({"error": "Invalid JSON format in AI response"}), 500
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500
