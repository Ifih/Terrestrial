"""
Classical Machine Learning Model for Land Degradation Prediction
Uses scikit-learn for regression and classification tasks
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import pickle
import json

class LandDegradationClassifier:
    """
    Classical ML model for predicting land degradation levels
    Features: NDVI, soil moisture, temperature, precipitation, slope, etc.
    """
    
    def __init__(self):
        self.classifier = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.scaler = StandardScaler()
        self.feature_names = [
            'ndvi', 'soil_moisture', 'temperature', 'precipitation',
            'slope', 'elevation', 'land_use_code'
        ]
        
    def train(self, X, y):
        """Train the classifier on labeled data"""
        X_scaled = self.scaler.fit_transform(X)
        self.classifier.fit(X_scaled, y)
        
    def predict(self, features):
        """
        Predict degradation level
        Returns: degradation_level (0=none, 1=low, 2=moderate, 3=high, 4=severe)
        """
        features_scaled = self.scaler.transform(features)
        prediction = self.classifier.predict(features_scaled)
        probabilities = self.classifier.predict_proba(features_scaled)
        
        return {
            'degradation_level': int(prediction[0]),
            'confidence': float(np.max(probabilities[0])),
            'probabilities': {
                'none': float(probabilities[0][0]),
                'low': float(probabilities[0][1]),
                'moderate': float(probabilities[0][2]),
                'high': float(probabilities[0][3]),
                'severe': float(probabilities[0][4])
            }
        }
    
    def get_feature_importance(self):
        """Get feature importance scores"""
        importance = self.classifier.feature_importances_
        return dict(zip(self.feature_names, importance.tolist()))


class VegetationLossRegressor:
    """
    Regression model for predicting vegetation loss percentage
    """
    
    def __init__(self):
        self.regressor = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.scaler = StandardScaler()
        
    def train(self, X, y):
        """Train the regressor on labeled data"""
        X_scaled = self.scaler.fit_transform(X)
        self.regressor.fit(X_scaled, y)
        
    def predict(self, features):
        """
        Predict vegetation loss percentage
        Returns: percentage (0-100)
        """
        features_scaled = self.scaler.transform(features)
        prediction = self.regressor.predict(features_scaled)
        
        return {
            'vegetation_loss_percentage': float(np.clip(prediction[0], 0, 100)),
            'confidence_interval': {
                'lower': float(max(0, prediction[0] - 5)),
                'upper': float(min(100, prediction[0] + 5))
            }
        }


def generate_synthetic_training_data(n_samples=1000):
    """
    Generate synthetic training data for demonstration
    In production, this would be replaced with real satellite data
    """
    np.random.seed(42)
    
    # Generate features
    ndvi = np.random.uniform(0, 1, n_samples)
    soil_moisture = np.random.uniform(0, 100, n_samples)
    temperature = np.random.uniform(15, 40, n_samples)
    precipitation = np.random.uniform(0, 200, n_samples)
    slope = np.random.uniform(0, 45, n_samples)
    elevation = np.random.uniform(0, 3000, n_samples)
    land_use_code = np.random.randint(1, 6, n_samples)
    
    X = np.column_stack([
        ndvi, soil_moisture, temperature, precipitation,
        slope, elevation, land_use_code
    ])
    
    # Generate labels (degradation level)
    # Lower NDVI, lower soil moisture, higher temp = more degradation
    degradation_score = (
        (1 - ndvi) * 0.4 +
        (1 - soil_moisture / 100) * 0.3 +
        (temperature / 40) * 0.2 +
        (1 - precipitation / 200) * 0.1
    )
    
    y_classification = np.digitize(degradation_score, bins=[0.2, 0.4, 0.6, 0.8, 1.0])
    y_regression = degradation_score * 100  # Vegetation loss percentage
    
    return X, y_classification, y_regression


def train_and_save_models():
    """Train models and save them"""
    print("Generating synthetic training data...")
    X, y_class, y_reg = generate_synthetic_training_data(1000)
    
    print("Training classification model...")
    classifier = LandDegradationClassifier()
    classifier.train(X, y_class)
    
    print("Training regression model...")
    regressor = VegetationLossRegressor()
    regressor.train(X, y_reg)
    
    print("Models trained successfully!")
    
    # Test predictions
    test_features = np.array([[0.3, 20, 35, 50, 15, 500, 2]])
    
    class_result = classifier.predict(test_features)
    reg_result = regressor.predict(test_features)
    
    print("\nTest Prediction:")
    print(f"Degradation Level: {class_result['degradation_level']}")
    print(f"Confidence: {class_result['confidence']:.2%}")
    print(f"Vegetation Loss: {reg_result['vegetation_loss_percentage']:.1f}%")
    
    return classifier, regressor


if __name__ == "__main__":
    train_and_save_models()
