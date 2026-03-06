const loginForm = document.getElementById('loginForm');
const visaPanel = document.getElementById('visaPanel');
const loginMessage = document.getElementById('loginMessage');
const applyVisaBtn = document.getElementById('applyVisaBtn');
const applyTicketBtn = document.getElementById('applyTicketBtn');
const ticketNotice = document.getElementById('ticketNotice');
const visaForm = document.getElementById('visaForm');
const loading = document.getElementById('loading');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');
const issueDateInput = document.getElementById('issueDate');
const validUntilInput = document.getElementById('validUntil');
const uidInput = document.getElementById('uidNo');
const photoInput = document.getElementById('photo');
const photoPreview = document.getElementById('photoPreview');

let issueDate;
let validUntil;
let applicationUID;
let photoDataUrl = null;
let latestFormData = null;

function resetAutoValues() {
  issueDate = new Date();
  validUntil = new Date(issueDate.getTime());
  validUntil.setDate(validUntil.getDate() + 15);
  applicationUID = `VEZRO-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

  issueDateInput.value = `${issueDate.toLocaleString()} | Bhubaneswar`;
  validUntilInput.value = validUntil.toLocaleDateString();
  uidInput.value = applicationUID;
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const loginId = document.getElementById('loginId').value.trim();
  const password = document.getElementById('password').value;

  if (loginId === 'shajan@evisa.com' && password === 'India@123') {
    loginMessage.style.color = '#0b7f5f';
    loginMessage.textContent = 'Admin authenticated.';
    visaPanel.classList.remove('hidden');
    resetAutoValues();
  } else {
    loginMessage.style.color = '#a31b2d';
    loginMessage.textContent = 'Invalid credentials.';
  }
});

applyVisaBtn.addEventListener('click', () => {
  ticketNotice.classList.add('hidden');
  visaForm.classList.remove('hidden');
  resetAutoValues();
});

applyTicketBtn.addEventListener('click', () => {
  ticketNotice.classList.remove('hidden');
});

photoInput.addEventListener('change', () => {
  const file = photoInput.files?.[0];
  if (!file) return;

  if (!['image/jpeg', 'image/jpg'].includes(file.type) && !file.name.toLowerCase().endsWith('.jpg') && !file.name.toLowerCase().endsWith('.jpeg')) {
    alert('Only JPG images are allowed.');
    photoInput.value = '';
    photoPreview.classList.add('hidden');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    photoDataUrl = reader.result;
    photoPreview.src = photoDataUrl;
    photoPreview.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
});

visaForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!photoDataUrl) {
    alert('Please upload a JPG photo before applying.');
    return;
  }

  latestFormData = {
    fullName: document.getElementById('fullName').value,
    nationality: document.getElementById('nationality').value,
    birthPlace: document.getElementById('birthPlace').value,
    aadharNo: document.getElementById('aadharNo').value,
    profession: document.getElementById('profession').value,
    category: document.getElementById('category').value,
    allowedEntry: document.getElementById('allowedEntry').value,
    issueDateText: issueDateInput.value,
    validUntilText: validUntilInput.value,
    uidNo: uidInput.value
  };

  loading.classList.remove('hidden');
  downloadPdfBtn.classList.add('hidden');

  setTimeout(() => {
    loading.classList.add('hidden');
    downloadPdfBtn.classList.remove('hidden');
  }, 1800);
});

function drawKeyValue(doc, y, label, value, odiaLabel = '') {
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(18, 58, 107);
  doc.text(label, 98, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(20, 20, 20);
  doc.text(String(value || '-'), 160, y);
  if (odiaLabel) {
    doc.setFontSize(9);
    doc.setTextColor(85, 102, 130);
    doc.text(odiaLabel, 98, y + 4);
    doc.setFontSize(10);
  }
}

downloadPdfBtn.addEventListener('click', () => {
  if (!latestFormData || !window.jspdf) {
    alert('PDF engine not ready. Please try again.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  doc.setDrawColor(70, 96, 130);
  doc.setLineWidth(0.9);
  doc.rect(6, 6, 285, 198);
  doc.setLineWidth(0.25);
  doc.rect(8, 8, 281, 194);

  doc.setFillColor(234, 240, 247);
  doc.rect(8, 8, 281, 24, 'F');

  doc.setFont('times', 'bold');
  doc.setTextColor(18, 58, 107);
  doc.setFontSize(21);
  doc.text('VEZRO PVT LTD.', 148.5, 19, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Government Authorized Visit E-Visa', 148.5, 26, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('VEZRO INDIA', 260, 15, { align: 'right' });
  doc.setDrawColor(198, 168, 103);
  doc.line(8, 33, 289, 33);

  doc.setFillColor(18, 58, 107);
  doc.rect(8, 36, 281, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text('E-VISA - SHORT TERM VISIT PERMIT (15 DAYS)', 148.5, 43, { align: 'center' });
  doc.setFontSize(9);
  doc.text('ଇ-ଭିସା - ସ୍ୱଳ୍ପ ଅବଧି ପରିଦର୍ଶନ ଅନୁମତି (୧୫ ଦିନ)', 148.5, 47, { align: 'center' });

  doc.setTextColor(230, 235, 241);
  doc.setFontSize(22);
  doc.text('VEZRO OFFICIAL - GOVERNMENT AUTHORIZED', 148.5, 112, { align: 'center', angle: 24 });

  doc.setDrawColor(130, 146, 168);
  doc.rect(14, 54, 72, 118);
  doc.setDrawColor(198, 168, 103);
  doc.rect(19, 60, 48, 62);
  doc.addImage(photoDataUrl, 'JPEG', 20, 61, 46, 60);

  doc.setTextColor(20, 20, 20);
  doc.setFontSize(10);
  doc.text(`UID: ${latestFormData.uidNo}`, 19, 130);

  doc.rect(19, 135, 48, 14);
  doc.setFontSize(8);
  doc.text('BARCODE', 43, 143, { align: 'center' });

  doc.rect(19, 152, 23, 18);
  doc.text('QR', 30.5, 161, { align: 'center' });

  doc.circle(72, 64, 7);
  doc.setFontSize(7);
  doc.text('SEAL', 72, 65, { align: 'center' });

  doc.setFontSize(10);
  drawKeyValue(doc, 60, 'Date & Place of Issue', latestFormData.issueDateText, 'ଜାରି ତାରିଖ ଓ ସ୍ଥାନ');
  drawKeyValue(doc, 72, 'Valid Until', latestFormData.validUntilText, 'ବୈଧତା ସମୟସୀମା');
  drawKeyValue(doc, 84, 'UID No', latestFormData.uidNo);
  drawKeyValue(doc, 96, 'Allowed to Enter', latestFormData.allowedEntry);
  drawKeyValue(doc, 108, 'Full Name', latestFormData.fullName, 'ପୂର୍ଣ୍ଣ ନାମ');
  drawKeyValue(doc, 120, 'Nationality', latestFormData.nationality);
  drawKeyValue(doc, 132, 'Place of Birth', latestFormData.birthPlace);
  drawKeyValue(doc, 144, 'Aadhar No', latestFormData.aadharNo);
  drawKeyValue(doc, 156, 'Profession', latestFormData.profession);
  drawKeyValue(doc, 168, 'Category', latestFormData.category);

  doc.setDrawColor(150, 160, 170);
  doc.line(14, 178, 286, 178);
  doc.setFontSize(8);
  doc.setTextColor(60, 68, 82);
  doc.text('Authorized Immigration Officer', 20, 186);
  doc.text('Authorized Authority - VEZRO PVT LTD.', 282, 186, { align: 'right' });
  doc.text('Security Code: VZ-15D-' + Math.floor(Math.random() * 1000000), 20, 192);
  doc.text('This Visit E-Visa is valid for 15 days from date of issue and permits entry within Odisha boundaries only. Unauthorized duplication is prohibited.', 148.5, 192, { align: 'center' });

  doc.save(`${latestFormData.uidNo}.pdf`);
});

resetAutoValues();
