from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from PIL import Image
import numpy as np
import io

app = FastAPI(
    title="DermaIntel Enterprise API",
    description="AI-powered Skin Cancer Detection Platform",
    version="2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = load_model("skin_cancer_model.h5")

class_names = [
    "Basal Cell Carcinoma",
    "Dermatofibroma",
    "Melanoma",
    "Nevus",
    "Squamous Cell Carcinoma"
]


def preprocess(img):
    img = img.resize((224, 224))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array


@app.get("/")
def home():
    return {
        "status": "active",
        "message": "DermaIntel Enterprise API Running Successfully"
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB")

    processed = preprocess(img)

    prediction = model.predict(processed)

    predicted_class = class_names[np.argmax(prediction)]
    confidence = float(np.max(prediction) * 100)

    risk_level = (
        "High Risk" if confidence > 85
        else "Moderate Risk" if confidence > 60
        else "Low Risk"
    )

    return {
        "status": "success",
        "prediction": predicted_class,
        "confidence": round(confidence, 2),
        "risk_level": risk_level
    }