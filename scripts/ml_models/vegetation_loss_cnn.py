"""
CNN-based Deep Learning Model for Vegetation Loss Detection
Uses PyTorch for analyzing vegetation changes in satellite imagery
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
from PIL import Image
import io

class VegetationLossCNN(nn.Module):
    """
    CNN for detecting vegetation loss and calculating NDVI changes
    """
    
    def __init__(self):
        super(VegetationLossCNN, self).__init__()
        
        # Encoder
        self.conv1 = nn.Conv2d(3, 64, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm2d(64)
        self.conv2 = nn.Conv2d(64, 128, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm2d(128)
        self.conv3 = nn.Conv2d(128, 256, kernel_size=3, padding=1)
        self.bn3 = nn.BatchNorm2d(256)
        
        self.pool = nn.MaxPool2d(2, 2)
        
        # Global average pooling
        self.global_pool = nn.AdaptiveAvgPool2d((1, 1))
        
        # Regression head
        self.fc1 = nn.Linear(256, 128)
        self.dropout = nn.Dropout(0.3)
        self.fc2 = nn.Linear(128, 1)  # Output: vegetation loss percentage
        
    def forward(self, x):
        x = self.pool(F.relu(self.bn1(self.conv1(x))))
        x = self.pool(F.relu(self.bn2(self.conv2(x))))
        x = self.pool(F.relu(self.bn3(self.conv3(x))))
        
        x = self.global_pool(x)
        x = x.view(x.size(0), -1)
        
        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        x = torch.sigmoid(self.fc2(x)) * 100  # Scale to 0-100%
        
        return x


class VegetationLossDetector:
    """Wrapper for vegetation loss detection"""
    
    def __init__(self):
        self.model = VegetationLossCNN()
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model.to(self.device)
        self.model.eval()
        
    def preprocess_image(self, image_bytes):
        """Preprocess satellite image"""
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        image = image.resize((224, 224))
        
        image_array = np.array(image).astype(np.float32) / 255.0
        image_tensor = torch.from_numpy(image_array).permute(2, 0, 1)
        
        mean = torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1)
        std = torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1)
        image_tensor = (image_tensor - mean) / std
        
        return image_tensor.unsqueeze(0).to(self.device)
    
    def calculate_ndvi(self, image_bytes):
        """Calculate NDVI from RGB image (approximation)"""
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        image_array = np.array(image).astype(np.float32)
        
        # Approximate NDVI using visible bands
        red = image_array[:, :, 0]
        green = image_array[:, :, 1]
        
        # Pseudo-NDVI calculation
        ndvi = (green - red) / (green + red + 1e-8)
        mean_ndvi = float(np.mean(ndvi))
        
        return mean_ndvi
    
    def predict(self, image_bytes):
        """
        Predict vegetation loss percentage
        """
        with torch.no_grad():
            image_tensor = self.preprocess_image(image_bytes)
            vegetation_loss = self.model(image_tensor)
            
            # Calculate NDVI
            ndvi = self.calculate_ndvi(image_bytes)
            
            loss_percentage = float(vegetation_loss.item())
            
            # Determine severity
            if loss_percentage < 10:
                severity = 'minimal'
            elif loss_percentage < 30:
                severity = 'moderate'
            elif loss_percentage < 60:
                severity = 'significant'
            else:
                severity = 'severe'
            
            return {
                'vegetation_loss_percentage': round(loss_percentage, 2),
                'ndvi': round(ndvi, 3),
                'severity': severity,
                'health_status': 'healthy' if loss_percentage < 20 else 'degraded',
                'confidence': 0.85  # Placeholder confidence
            }


if __name__ == "__main__":
    print("Initializing Vegetation Loss Detector...")
    detector = VegetationLossDetector()
    
    # Create synthetic test image
    synthetic_image = np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8)
    img = Image.fromarray(synthetic_image)
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    
    print("Running prediction...")
    result = detector.predict(img_bytes.getvalue())
    
    print("\nVegetation Loss Detection Results:")
    print(f"Vegetation Loss: {result['vegetation_loss_percentage']}%")
    print(f"NDVI: {result['ndvi']}")
    print(f"Severity: {result['severity']}")
    print(f"Health Status: {result['health_status']}")
