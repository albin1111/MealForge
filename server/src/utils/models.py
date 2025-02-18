import uuid

from sqlalchemy import Column, ForeignKey, Integer, String, Text, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from utils.GUID import GUID

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    userName = Column(String(250), unique=True, nullable=False)
    firstName = Column(String(250), nullable=False)
    lastName = Column(String(250), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password = Column(String(250), nullable=False)
    refreshToken = Column(Text, nullable=True)
    profile_picture_url = Column(String(500), nullable=True)
    allergies = Column(Text, nullable=True)
    height = Column(String(250), nullable=False,default='')
    weight = Column(String(250), nullable=False,default='')
    age = Column(String(250), nullable=False,default='')
    gender = Column(String(250), nullable=False,default='')

    recipes = relationship('Recipe', back_populates='user', cascade="all, delete-orphan")
    recipe_posts = relationship('RecipePost', back_populates='user', cascade="all, delete-orphan")
    likes = relationship('Like', back_populates='user', cascade="all, delete-orphan")
    dislikes = relationship('Dislike', back_populates='user', cascade="all, delete-orphan")
    bookmarks = relationship('Bookmark', back_populates='user', cascade="all, delete-orphan")
    ratings = relationship('Rating', back_populates='user', cascade="all, delete-orphan")
    comments = relationship('Comment', back_populates='user', cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(firstName={self.firstName}, lastName={self.lastName}, email={self.email})>"

class Ingredient(Base):
    __tablename__ = 'ingredients'

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = Column(String(250), nullable=False)
    type = Column(String(250), nullable=False)
    measurements = Column(String(100), nullable=False)
    expirationDate = Column(String(250), nullable=True)
    date_added = Column(String(250), nullable=False, default=func.current_date())

    user_id = Column(GUID(), ForeignKey('users.id',ondelete="CASCADE"), nullable=False)
    user = relationship("User", backref="ingredients")

    def __repr__(self):
        return f"<Ingredient(name={self.name}, measurements={self.measurements})>"

class Recipe(Base):
    __tablename__ = 'recipes'

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = Column(String(250), nullable=False)
    ingredients = Column(Text, nullable=False)
    instruction = Column(Text, nullable=False)
    type_of_cuisine = Column(String(250), nullable=False)
    nutrient_counts = Column(Text, nullable=False)
    serve_hot_or_cold = Column(String(50), nullable=False)
    cooking_time = Column(Integer, nullable=False)
    benefits = Column(Text, nullable=True)
    serve_for = Column(Integer, nullable=False)
    difficulty = Column(String(250), nullable=False)
    tags = Column(String(250), nullable=False)

    user_id = Column(GUID(), ForeignKey('users.id',ondelete="CASCADE"), nullable=False)
    user = relationship('User', back_populates='recipes')

    recipe_posts = relationship('RecipePost', back_populates='recipe', cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Recipe(name={self.name}, type_of_cuisine={self.type_of_cuisine}, serve_for={self.serve_for})>"

class RecipePost(Base):
    __tablename__ = 'recipe_posts'

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID(), ForeignKey('users.id',ondelete="CASCADE"), nullable=False)
    recipe_id = Column(GUID(), ForeignKey('recipes.id',ondelete="CASCADE"), nullable=False)
    posted_at = Column(String(20), nullable=False, default=func.current_date())
    recipe_post_image  = Column(String(500), nullable=True)

    # Relationships
    user = relationship("User", back_populates="recipe_posts")
    recipe = relationship("Recipe", back_populates="recipe_posts")
    likes = relationship("Like", back_populates="recipe_post", cascade="all, delete-orphan")
    dislikes = relationship("Dislike", back_populates="recipe_post", cascade="all, delete-orphan")
    bookmarks = relationship("Bookmark", back_populates="recipe_post", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="recipe_post", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<RecipePost(user_id={self.user_id}, recipe_id={self.recipe_id}, posted_at={self.posted_at})>"

class Like(Base):
    __tablename__ = 'likes'

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID(), ForeignKey('users.id',ondelete="CASCADE"), nullable=False)
    post_id = Column(GUID(), ForeignKey('recipe_posts.id',ondelete="CASCADE"), nullable=False)
    liked_at = Column(String(20), nullable=False, default=func.current_date())

    # Relationships
    user = relationship("User", back_populates="likes")
    recipe_post = relationship("RecipePost", back_populates="likes")

    def __repr__(self):
        return f"<Like(user_id={self.user_id}, post_id={self.post_id}, liked_at={self.liked_at})>"

class Dislike(Base):
    __tablename__ = 'dislikes'

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID(), ForeignKey('users.id',ondelete="CASCADE"), nullable=False)
    post_id = Column(GUID(), ForeignKey('recipe_posts.id',ondelete="CASCADE"), nullable=False)
    disliked_at = Column(String(20), nullable=False, default=func.current_date())

    # Relationships
    user = relationship("User", back_populates="dislikes")
    recipe_post = relationship("RecipePost", back_populates="dislikes")

    def __repr__(self):
        return f"<Dislike(user_id={self.user_id}, post_id={self.post_id}, disliked_at={self.disliked_at})>"

class Bookmark(Base):
    __tablename__ = 'bookmarks'

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID(), ForeignKey('users.id',ondelete="CASCADE"), nullable=False)
    post_id = Column(GUID(), ForeignKey('recipe_posts.id',ondelete="CASCADE"), nullable=False)
    bookmarked_at = Column(String(20), nullable=False, default=func.current_date())

    # Relationships
    user = relationship("User", back_populates="bookmarks")
    recipe_post = relationship("RecipePost", back_populates="bookmarks")

    def __repr__(self):
        return f"<Bookmark(user_id={self.user_id}, post_id={self.post_id}, bookmarked_at={self.bookmarked_at})>"

class Rating(Base):
    __tablename__ = 'ratings'

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID(), ForeignKey('users.id',ondelete="CASCADE"), nullable=False)
    post_id = Column(GUID(), ForeignKey('recipe_posts.id',ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False)
    rated_at = Column(String(20), nullable=False, default=func.current_date())

    # Relationships
    user = relationship("User", back_populates="ratings")
    recipe_post = relationship("RecipePost", back_populates="ratings")

    def __repr__(self):
        return f"<Rating(user_id={self.user_id}, post_id={self.post_id}, rating={self.rating})>"

class Comment(Base):
    __tablename__ = 'comments'

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID(), ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
    post_id = Column(GUID(), ForeignKey('recipe_posts.id', ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(String(20), nullable=False, default=func.current_date())

    # Relationships
    user = relationship("User", back_populates="comments")
    recipe_post = relationship("RecipePost", back_populates="comments")

    def __repr__(self):
        return f"<Comment(user_id={self.user_id}, post_id={self.post_id}, created_at={self.created_at}, content={self.content[:20]}...)>"
