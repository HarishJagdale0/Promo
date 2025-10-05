# 📱 QR Code Generator & Recognition

A simple and powerful **QR Code Generator and Recognition System** built with **Python** using `qrcode`, `opencv`, and `pyzbar` libraries.  
This project allows users to **generate**, **save**, and **scan QR codes** effortlessly from text, URLs, or files.
using project integration of webcam sysstem for;mvpds

---

## 🚀 Features

- ✅ Generate custom QR Codes from text, URLs, or files  
- 🖼️ Save generated QR Codes as image files (PNG/JPG)  
- 🔍 Recognize & decode QR Codes from images or webcam  
- ⚡ Fast, lightweight, and beginner-friendly  
- 🧠 Supports real-time QR Code scanning using OpenCV  

---

## 🧩 Tech Stack

| Component | Technology |
|------------|-------------|
| **Language** | Python 3.x |
| **Libraries Used** | `qrcode`, `opencv-python`, `pyzbar`, `Pillow` |
| **IDE (Recommended)** | VS Code / PyCharm / Jupyter Notebook |

---

## 📂 Project Structure



---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/QR-Code-Generator-Recognition.git
cd QR-Code-Generator-Recognition

python -m venv venv
source venv/bin/activate     # for Linux/Mac
venv\Scripts\activate        # for Windows

pip install -r requirements.txt

pip install qrcode opencv-python pyzbar pillow

import qrcode

data = "https://www.linkedin.com/in/harish-jagdale"
qr = qrcode.make(data)
qr.save("output_qr/linkedin_qr.png")
print("✅ QR Code generated and saved successfully!")
python qr_scanner.py



import cv2
from pyzbar.pyzbar import decode

img = cv2.imread("output_qr/linkedin_qr.png")
for qr in decode(img):
    print("📜 Data:", qr.data.decode('utf-8'))
cv2.imshow("QR Code", img)
cv2.waitKey(0)




import cv2
from pyzbar.pyzbar import decode

cap = cv2.VideoCapture(0)

while True:
    _, frame = cap.read()
    for qr in decode(frame):
        data = qr.data.decode('utf-8')
        print("📜 Detected:", data)
    cv2.imshow("QR Scanner", frame)
    if cv2.waitKey(1) == 27:  # Press 'ESC' to exit
        break

cap.release()
cv2.destroyAllWindows()


THANKS FOR SUPPORTING JUST STAR THIS REPOSITORY IF YOU LIKED!
