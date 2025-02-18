import os
import pickle

import numpy as np
import torch
import torch.nn.functional as F
from flask import jsonify
from sklearn.metrics.pairwise import cosine_similarity
from torch_geometric.nn import GATConv

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

model_path = os.path.join(base_dir,'dataset','GNN','gnn_model.pth')
ingredients_path = os.path.join(base_dir,'dataset','GNN','ingredients_list.pkl')
embeddings_path = os.path.join(base_dir,'dataset','GNN','node_embeddings.npy')

class IngredientGNN(torch.nn.Module):
    def __init__(self, in_channels, out_channels):
        super(IngredientGNN, self).__init__()
        self.conv1 = GATConv(in_channels, 32, heads=4, concat=True)
        self.conv2 = GATConv(32 * 4, out_channels, heads=1, concat=False)

    def forward(self, data):
        x, edge_index = data.x, data.edge_index
        x = self.conv1(x, edge_index)
        x = torch.relu(x)
        x = self.conv2(x, edge_index)
        return x

model = IngredientGNN(in_channels=384, out_channels=16)
model.load_state_dict(torch.load(model_path))
model.eval()

with open(ingredients_path, 'rb') as f:
    ingredients_list = pickle.load(f)

embeddings = np.load(embeddings_path)


def get_similar_ingredients(ingredient, k=5):
    if ingredient not in ingredients_list:
        return jsonify({'error': f"Ingredient '{ingredient}' not found"}), 404

    query_index = ingredients_list.index(ingredient)

    query_embedding = embeddings[query_index].reshape(1, -1)
    similarities = cosine_similarity(query_embedding, embeddings)[0]

    top_k = 5
    recommendation_indices = np.argsort(similarities)[::-1]
    recommendations = [
        ingredients_list[i] for i in recommendation_indices[:top_k] if i != query_index
    ]

    return recommendations
