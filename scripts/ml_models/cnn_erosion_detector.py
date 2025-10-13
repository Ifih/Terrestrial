"""
CNN-based Deep Learning Model for Erosion Detection
Uses PyTorch for satellite image analysis
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
from PIL import Image
import io

class ErosionDetectorCNN(nn.Module):
    """
    Convolutional Neural Network for detecting soil erosion in satellite images
    Input: RGB satellite image (224x224)
    Output: Erosion probability and severity
    """
    
    def __init__(self, num_classes=5):
        super(ErosionDetectorCNN, self).__init__()
        
        # Convolutional layers
        self.conv1 = nn.Conv2d(3, 32, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm2d(32)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm2d(64)
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, padding=1)
        self.bn3 = nn.BatchNorm2d(128)
        self.conv4 = nn.Conv2d(128, 256, kernel_size=3, padding=1)
        self.bn4 = nn.BatchNorm2d(256)
        
        # Pooling
        self.pool = nn.MaxPool2d(2, 2)
        
        # Fully connected layers
        self.fc1 = nn.Linear(256 * 14 * 14, 512)
        self.dropout1 = nn.Dropout(0.5)
        self.fc2 = nn.Linear(512, 128)
        self.dropout2 = nn.Dropout(0.3)
        self.fc3 = nn.Linear(128, num_classes)
        
    def forward(self, x):
        # Conv block 1
        x = self.pool(F.relu(self.bn1(self.conv1(x))))
        # Conv block 2
        x = self.pool(F.relu(self.bn2(self.conv2(x))))
        # Conv block 3
        x = self.pool(F.relu(self.bn3(self.conv3(x))))
        # Conv block 4
        x = self.pool(F.relu(self.bn4(self.conv4(x))))
        
        # Flatten
        x = x.view(-1, 256 * 14 * 14)
        
        # Fully connected layers
        x = F.relu(self.fc1(x))
        x = self.dropout1(x)
        x = F.relu(self.fc2(x))
        x = self.dropout2(x)
        x = self.fc3(x)
        
        return x


class ErosionDetector:
    """Wrapper class for erosion detection"""
    
    def __init__(self):
        self.model = ErosionDetectorCNN(num_classes=5)
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model.to(self.device)
        self.model.eval()
        
        self.class_names = ['none', 'minimal', 'moderate', 'severe', 'critical']
        
    def preprocess_image(self, image_bytes):
        """Preprocess image for model input"""
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        image = image.resize((224, 224))
        
        # Convert to tensor and normalize
        image_array = np.array(image).astype(np.float32) / 255.0
        image_tensor = torch.from_numpy(image_array).permute(2, 0, 1)
        
        # Normalize with ImageNet stats
        mean = torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1)
        std = torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1)
        image_tensor = (image_tensor - mean) / std
        
        return image_tensor.unsqueeze(0).to(self.device)
    
    def predict(self, image_bytes):
        """
        Predict erosion level from satellite image
        Returns: erosion level, confidence, and probabilities
        """
        with torch.no_grad():
            image_tensor = self.preprocess_image(image_bytes)
            outputs = self.model(image_tensor)
            probabilities = F.softmax(outputs, dim=1)
            
            confidence, predicted = torch.max(probabilities, 1)
            
            return {
                'erosion_detected': predicted.item() > 0,
                'erosion_level': self.class_names[predicted.item()],
                'confidence': float(confidence.item()),
                'probabilities': {
                    name: float(prob)
                    for name, prob in zip(self.class_names, probabilities[0].tolist())
                }
            }
    
    def train_model(self, train_loader, num_epochs=10):
        """Train the model (for demonstration)"""
        self.model.train()
        criterion = nn.CrossEntropyLoss()
        optimizer = torch.optim.Adam(self.model.parameters(), lr=0.001)
        
        for epoch in range(num_epochs):
            running_loss = 0.0
            for i, (inputs, labels) in enumerate(train_loader):
                inputs, labels = inputs.to(self.device), labels.to(self.device)
                
                optimizer.zero_grad()
                outputs = self.model(inputs)
                loss = criterion(outputs, labels)
                loss.backward()
                optimizer.step()
                
                running_loss += loss.item()
            
            print(f'Epoch {epoch+1}/{num_epochs}, Loss: {running_loss/len(train_loader):.4f}')
        
        self.model.eval()
        print("Training complete!")


def create_synthetic_image_data():
    """Create synthetic satellite images for demonstration"""
    # In production, this would load real satellite imagery
    synthetic_image = np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8)
    img = Image.fromarray(synthetic_image)
    
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    
    return img_bytes.getvalue()


if __name__ == "__main__":
    print("Initializing Erosion Detector CNN...")
    detector = ErosionDetector()
    
    print("Creating synthetic test image...")
    test_image = create_synthetic_image_data()
    
    print("Running prediction...")
    result = detector.predict(test_image)
    
    print("\nErosion Detection Results:")
    print(f"Erosion Detected: {result['erosion_detected']}")
    print(f"Erosion Level: {result['erosion_level']}")
    print(f"Confidence: {result['confidence']:.2%}")
    print("\nProbabilities:")
    for level, prob in result['probabilities'].items():
        print(f"  {level}: {prob:.2%}")
