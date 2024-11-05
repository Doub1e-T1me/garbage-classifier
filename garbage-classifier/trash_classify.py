import cv2
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import mysql.connector
from datetime import datetime
import time
import gc
import os

class GarbageClassifier(nn.Module):
    def __init__(self, num_classes):
        super(GarbageClassifier, self).__init__()
        self.model = models.resnet50(weights=None)
        self.model.fc = nn.Linear(self.model.fc.in_features, num_classes)

    def forward(self, x):
        return self.model(x)

num_classes = 6
model = GarbageClassifier(num_classes=num_classes)

state_dict = torch.load('Model.pth', map_location=torch.device('cpu'))
new_state_dict = {}
for key in state_dict:
    new_key = key.replace("resnet.", "model.")
    new_state_dict[new_key] = state_dict[key]

model.load_state_dict(new_state_dict)
model.eval()

preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

class_names = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']
threshold = 0.85

def save_classification_result(conn, img_path, class_name, user_id=1):
    cursor = conn.cursor(buffered=True)
    try:
        image_url = f"http://192.168.0.11/images/{os.path.basename(img_path)}"
        
        cursor.execute('''
            SELECT category_id FROM Classification_Category WHERE name = %s
        ''', (class_name,))
        result = cursor.fetchone()

        if result is None:
            print(f"Category '{class_name}' not found in Classification_Category.")
            return
        category_id = result[0]

        cursor.execute('''
            INSERT IGNORE INTO Waste_Item (name, category_id, image_url)
            VALUES (%s, %s, %s)
        ''', (class_name, category_id, image_url))
        conn.commit()

        cursor.execute('''
            SELECT item_id FROM Waste_Item WHERE name = %s
        ''', (class_name,))
        item_id = cursor.fetchone()[0]

        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute('''
            INSERT INTO Classification_Log (item_id, user_id, timestamp, image_url)
            VALUES (%s, %s, %s, %s)
        ''', (item_id, user_id, timestamp, image_url))
        conn.commit()
    finally:
        cursor.close()

cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
cap.set(cv2.CAP_PROP_FPS, 60)

if not cap.isOpened():
    raise Exception("Unable to open webcam.")

conn = mysql.connector.connect(
    host="192.168.0.11",
    user="aceontop",
    password="1234",
    database="waste_management"
)

last_detected_class = None
last_process_time = 0
process_interval = 2

try:
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Unable to capture frame.")
            break

        cv2.imshow("Webcam Feed", frame)

        current_time = time.time()
        if current_time - last_process_time > process_interval:
            image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            input_tensor = preprocess(image).unsqueeze(0)

            with torch.no_grad():
                output = model(input_tensor)
                probabilities = torch.nn.functional.softmax(output, dim=1)
                max_prob, predicted = torch.max(probabilities, 1)

            class_index = predicted.item()
            class_name = class_names[class_index]
            
            if max_prob.item() >= threshold and class_name not in ['trash'] and class_name != last_detected_class:
                img_path = f"/home/aceontop/Desktop/Project/images/captured_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{class_name}.jpg"
                cv2.imwrite(img_path, frame)
                print(f"'{class_name}' detected with confidence {max_prob.item():.2f}, image saved: {img_path}")
                save_classification_result(conn, img_path, class_name)
                last_detected_class = class_name

            del image
            del input_tensor
            del output
            gc.collect()

            last_process_time = current_time

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
finally:
    cap.release() 
    conn.close()
    cv2.destroyAllWindows()
