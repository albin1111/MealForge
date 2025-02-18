import os
import uuid

import jwt
from flask import Blueprint, jsonify, make_response, request
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
)
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from utils.database import engine

auth_bp = Blueprint("auth", __name__)
bcrypt = Bcrypt()

@auth_bp.route("/signup", methods=["POST"])
def handleSignup():
    data = request.get_json()
    userName = data.get("userName")
    firstName = data.get("firstName")
    lastName = data.get("lastName")
    email = data.get("email")
    password = data.get("password")

    if not userName or not firstName or not lastName or not email or not password:
        return jsonify({"error": "Missing field!"}), 400

    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM users WHERE email = :email"), {"email": email})
            user_exists = result.fetchone()

            if user_exists:
                return jsonify({"error": "Email already registered!"}), 400

            hashPass = bcrypt.generate_password_hash(password).decode('utf-8')
            userID = str(uuid.uuid4())

            query = text(
                """
                INSERT INTO users (id, userName, firstName, lastName, email, password)
                VALUES (:id, :userName, :firstName, :lastName, :email, :password)
                """
            )

            conn.execute(query, {
                "id": userID,
                "userName":userName,
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "password": hashPass
            })

            conn.commit()

            return jsonify({"message": "User registered successfully!"}), 200

    except IntegrityError:
        return jsonify({"error": "There's an error in database handling!"}), 409

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# TODO: Login user's account
@auth_bp.route("/signin", methods=["POST"])
def handleLogin():
    data = request.get_json()
    print(data)
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Please fill up the missing field!"}), 400

    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM users WHERE email = :email"), {"email": email})
            user_exists = result.fetchone()
            if user_exists is None:
                return jsonify({"error": "Email is not registered!"}), 400
            user = {
                "id": user_exists.id,
                "userName":user_exists.userName,
                "firstName": user_exists.firstName,
                "lastName": user_exists.lastName,
                "email": user_exists.email,
                "password": user_exists.password,
                "allergies": user_exists.allergies,
                "height":user_exists.height,
                "weight":user_exists.weight,
                "age":user_exists.age,
                "gender":user_exists.gender,
                "profile_picture_url":user_exists.profile_picture_url
            }

            valid_password = bcrypt.check_password_hash(user["password"], password)
            if not valid_password:
                return jsonify({"error": "Password incorrect!"}), 400

            # Create access and refresh tokens
            accessToken = create_access_token(identity=user["id"], additional_claims=user)
            refreshToken = create_refresh_token(identity=user["id"], additional_claims=user)

            # Store refresh token in the database
            conn.execute(text("UPDATE users SET refreshToken = :refreshToken WHERE id = :id"), {
                "refreshToken": refreshToken,
                "id": user['id']
            })
            conn.commit()

            secure_cookie = True if request.is_secure else False

            # Create the response object
            response = make_response({
                "message": "User authenticated!",
                "user": {
                    "id": user["id"],
                    "userName":user["userName"],
                    "firstName": user["firstName"],
                    "lastName": user["lastName"],
                    "email": user["email"],
                    "allergies": user["allergies"],
                    "height":user["height"],
                    "weight":user["weight"],
                    "age":user["age"],
                    "gender":user["gender"],
                    "profile_picture_url":user["profile_picture_url"]
                },
                "accessToken": accessToken,
                "refreshToken": refreshToken,
            })


            return response, 200

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

# TODO: Show's the cookies set
@auth_bp.route("/showcookie", methods=["GET"])
def show_cookie():
    refreshToken = request.cookies.get("refresh_token_cookie")
    if not refreshToken:
        return jsonify({"error": "Token missing!"}), 401

    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM users WHERE refreshToken = :refreshToken"), {"refreshToken": refreshToken})
        foundUser = result.fetchone()
        if foundUser is None:
            return jsonify({"error": "User not found!"}), 403
        return jsonify({"message": "User authenticated!", "refreshToken": foundUser.refreshToken}), 200

# TODO: Refresh user's cookies
@auth_bp.route("/refresh", methods=["GET"])
@jwt_required()
def refresh():
    try:
        current_user_id = get_jwt_identity()
        if not current_user_id:
            return jsonify({"error": "Token missing!"}), 401

        with engine.connect() as conn:
          result = conn.execute(text("SELECT * FROM users WHERE id = :userId"), {"userId": current_user_id})

          user_exists = result.fetchone()

          if user_exists is None:
                return jsonify({"error": "User not found!"}), 403

          user = {
              "id": user_exists.id,
              "userName":user_exists.userName,
              "firstName": user_exists.firstName,
              "lastName": user_exists.lastName,
              "email": user_exists.email,
              "allergies": user_exists.allergies,
              "height":user_exists.height,
              "weight":user_exists.weight,
              "age":user_exists.age,
              "gender":user_exists.gender,
              "profile_picture_url":user_exists.profile_picture_url
          }

            # Generate new access token and refresh token
          new_access_token = create_access_token(identity=user["id"], additional_claims=user)
          new_refresh_token = create_refresh_token(identity=user["id"], additional_claims=user)

          # Update refresh token in the database
          conn.execute(text("UPDATE users SET refreshToken = :new_refresh_token WHERE id = :id"), {
              "new_refresh_token": new_refresh_token,
              "id": user['id']
          })
          conn.commit()

          # Update the cookie with the new refresh token
          secure_cookie = True if request.is_secure else False
          response = jsonify({
              "accessToken": new_access_token,
              "refreshToken": new_refresh_token,
              "user":user,
              "message": "Token refreshed successfully!"
          })

          return response, 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# TODO: logout user's account
@auth_bp.route("/logout", methods=["GET"])
@jwt_required()
def logout():
    user_id = get_jwt_identity()
    print(user_id)
    try:
        with engine.connect() as conn:
            conn.execute(text("UPDATE users SET refreshToken = NULL WHERE id = :id"), {"id": user_id})
            conn.commit()

        response = jsonify({"message": "Logged out successfully!"})
        return response, 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
