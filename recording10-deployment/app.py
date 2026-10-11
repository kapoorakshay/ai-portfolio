
import os

import streamlit as st
from dotenv import load_dotenv
from PIL import Image
from google import generativeai as genai

load_dotenv()

st.set_page_config(
    page_title="AI Calorie Counter",
    page_icon="🥗",
)

st.title("🥗 AI Calorie Counter")
st.write("Upload a food photo to estimate its calories and nutrition.")

api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    st.error("API key not found. Check your local .env file.")
    st.stop()

genai.configure(api_key=api_key)

uploaded_file = st.file_uploader(
    "Choose a food image",
    type=["jpg", "jpeg", "png"],
)

if uploaded_file:
    image = Image.open(uploaded_file)
    st.image(image, caption="Uploaded food", use_container_width=True)

    if st.button("Estimate nutrition"):
        with st.spinner("Analyzing your food..."):
            try:
                model = genai.GenerativeModel("gemini-3.8-flash")
                prompt = """
                Identify the visible food and estimate the serving size,
                calories, protein, carbohydrates, and fat.
                Explain that these values are approximate.
                """

                response = model.generate_content([prompt, image])
                st.subheader("Estimated nutrition")
                st.write(response.text)

            except Exception as error:
                st.error(f"Analysis failed: {error}")
