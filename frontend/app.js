// app.js — MindMatrix QR frontend

// QR Generation
const qrcodeEl = document.getElementById('qrcode');
let qrInstance = null;
const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const qrText = document.getElementById('qr-text');
const qrSize = document.getElementById('qr-size');

function clearQRCode() {
  qrcodeEl.innerHTML = '';
  qrInstance = null;
  downloadBtn.disabled = true;
}

function generateQRCode() {
  const text = qrText.value.trim();
  if (!text) {
    alert('Please enter some text or URL to generate QR.');
    return;
  }
  clearQRCode();
  const size = parseInt(qrSize.value, 10) || 256;
  qrInstance = new QRCode(qrcodeEl, {
    text: text,
    width: size,
    height: size,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
  // small delay to enable download
  setTimeout(()=> downloadBtn.disabled = false, 100);
}

generateBtn.addEventListener('click', generateQRCode);

// Download PNG
downloadBtn.addEventListener('click', function(){
  // qrcodejs creates an img or canvas inside #qrcode
  const img = qrcodeEl.querySelector('img');
  const canvas = qrcodeEl.querySelector('canvas');

  let dataUrl;
  if (img) {
    // img.src is data URL
    dataUrl = img.src;
  } else if (canvas) {
    dataUrl = canvas.toDataURL('image/png');
  } else {
    alert('No QR generated yet.');
    return;
  }

  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = 'mindmatrix-qr.png';
  document.body.appendChild(a);
  a.click();
  a.remove();
});

// Webcam scanning via html5-qrcode
const cameraResult = document.getElementById('camera-result');
const startCameraBtn = document.getElementById('start-camera');
const stopCameraBtn = document.getElementById('stop-camera');
const readerId = "reader";
let html5QrScanner = null;
let cameraRunning = false;

function onScanSuccess(decodedText, decodedResult) {
  cameraResult.innerText = decodedText;
  // optionally stop after first detect:
  // html5QrScanner.clear().then(()=>{ cameraRunning = false; });
}

function onScanError(errorMessage) {
  // console.debug('Scan error', errorMessage);
}

startCameraBtn.addEventListener('click', async function() {
  if (cameraRunning) return;
  // Use Html5QrcodeScanner UI helper
  html5QrScanner = new Html5Qrcode(readerId);
  try {
    const devices = await Html5Qrcode.getCameras();
    if (!devices || devices.length === 0) {
      alert('No camera found on this device.');
      return;
    }
    // choose first camera
    const cameraId = devices[0].id;
    await html5QrScanner.start(
      cameraId,
      { fps: 10, qrbox: { width: 250, height: 250 } },
      onScanSuccess,
      onScanError
    );
    cameraRunning = true;
    startCameraBtn.disabled = true;
    stopCameraBtn.disabled = false;
  } catch (err) {
    console.error(err);
    alert('Unable to start camera: ' + err);
  }
});

stopCameraBtn.addEventListener('click', async function() {
  if (!cameraRunning || !html5QrScanner) return;
  try {
    await html5QrScanner.stop();
    await html5QrScanner.clear();
  } catch(e){
    console.warn(e);
  }
  cameraRunning = false;
  startCameraBtn.disabled = false;
  stopCameraBtn.disabled = true;
});

// File-based scanning
const fileInput = document.getElementById('file-input');
const fileResult = document.getElementById('file-result');

fileInput.addEventListener('change', async (ev) => {
  const file = ev.target.files && ev.target.files[0];
  if (!file) return;
  fileResult.innerText = 'Scanning...';
  try {
    // html5-qrcode provides scanFileV2
    const result = await Html5Qrcode.scanFileV2(file, { /* options */ }, true);
    // result is an array of decoded objects
    if (Array.isArray(result) && result.length > 0) {
      fileResult.innerText = result.map(r => r.decodedText).join(' | ');
    } else {
      fileResult.innerText = 'No QR code detected';
    }
  } catch (err) {
    console.error(err);
    fileResult.innerText = 'Error scanning file or no QR found.';
  } finally {
    // clear input so same file can be selected again
    fileInput.value = '';
  }
});

// allow pressing Ctrl+Enter to generate
qrText.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    generateQRCode();
  }
});
