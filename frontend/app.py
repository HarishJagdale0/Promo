import streamlit as st
import qrcode
from PIL import Image
import cv2
import numpy as np
from pyzbar.pyzbar import decode
import io

st.set_page_config(page_title="MindMatrix AI - QR Generator & Scanner", layout="wide")
st.title("📱 MindMatrix AI — QR Code Generator & Scanner")

tab1, tab2 = st.tabs(["✨ Generate QR Code", "🔍 Scan QR Code"])

# ----------------- QR GENERATOR -----------------
with tab1:
    st.header("Generate QR Code")

    text = st.text_area("Enter text or URL")

    size = st.slider("QR Size", 200, 600, 300)

    if st.button("Generate QR"):
        if text.strip() == "":
            st.warning("Please enter some text or URL")
        else:
            # generate qr
            qr = qrcode.QRCode(
                version=1,
                box_size=10,
                border=5,
            )
            qr.add_data(text)
            qr.make(fit=True)
            img = qr.make_image(fill_color="black", back_color="white").resize((size, size))

            st.image(img, caption="Generated QR Code")

            # Download button
            buf = io.BytesIO()
            img.save(buf, format="PNG")
            st.download_button(
                "⬇ Download QR Code",
                buf.getvalue(),
                file_name="qr_code.png",
                mime="image/png"
            )

# ----------------- QR SCANNER -----------------
with tab2:
    st.header("Scan QR Code from Image")

    uploaded_img = st.file_uploader("Upload QR Image", type=["png", "jpg", "jpeg"])

    if uploaded_img:
        img = Image.open(uploaded_img)
        st.image(img, caption="Uploaded Image", width=300)

        # Convert to OpenCV format
        img_cv = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
        decoded = decode(img_cv)

        if decoded:
            result = decoded[0].data.decode("utf-8")
            st.success(f"📜 Detected Content: **{result}**")
        else:
            st.error("❌ No QR Code detected!")
