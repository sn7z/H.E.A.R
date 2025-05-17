const BASE_URL = "http://127.0.0.1:8001";  // Change port if 8000 is occupied

// Toggle email section
document.getElementById('send-email').addEventListener('change', function () {
  document.getElementById('email-group').style.display = this.checked ? 'block' : 'none';
});

// Handle file uploads with preview and removal
function handleFileUpload(inputId, listId, isImage = false) {
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);

  input.addEventListener('change', function () {
    list.innerHTML = '';

    for (const file of this.files) {
      const item = document.createElement('div');
      item.className = 'file-item';

      const nameElement = document.createElement('div');
      nameElement.className = 'file-item-name';
      nameElement.textContent = file.name;

      const removeBtn = document.createElement('span');
      removeBtn.className = 'file-item-remove';
      removeBtn.innerHTML = '<i class="fas fa-times"></i>';
      removeBtn.onclick = () => item.remove();

      if (isImage && file.type.startsWith('image/')) {
        const preview = document.createElement('img');
        preview.className = 'file-preview';
        preview.src = URL.createObjectURL(file);
        item.append(preview, nameElement, removeBtn);
      } else {
        const icon = document.createElement('i');
        icon.className = file.type.startsWith('audio/') ? 'fas fa-music' : 'fas fa-file';
        item.append(icon, nameElement, removeBtn);
      }

      list.appendChild(item);
    }
  });
}

// Initialize upload inputs
handleFileUpload('file-upload', 'file-list');
handleFileUpload('photo-upload', 'photo-preview', true);
handleFileUpload('audio-upload', 'audio-list');

// Generate report
async function generateReport() {
  try {
    const data = {
      date: document.getElementById('date').value,
      time: document.getElementById('time').value,
      location: document.getElementById('location').value,
      person: document.getElementById('person').value,
      reporter: document.getElementById('reporter').value,
      recipient: document.getElementById('recipient').value,
      description: document.getElementById('description').value,
      evidence: document.getElementById('evidence').value
    };

    const response = await fetch(`${BASE_URL}/generate-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error("Failed to generate report");

    const result = await response.json();
    document.getElementById('generated-report').value = result.report;
    document.getElementById('result-container').style.display = 'block';
  } catch (err) {
    alert("Error: " + err.message);
    console.error(err);
  }
}

// Download report using client-side function (assumes it's defined globally)
async function downloadReport() {
  const reportText = document.getElementById('generated-report').value;
  try {
    const success = await window.downloadReportAsWord(reportText);
    if (!success) throw new Error("Client-side report generation failed.");
  } catch (err) {
    alert("Download failed: " + err.message);
    console.error(err);
  }
}

// Send email with attachments
async function sendEmail() {
  try {
    const reportText = document.getElementById('generated-report').value;
    const emails = document.getElementById('email').value;
    const sendWithAttachments = document.getElementById('send-email').checked;

    if (!sendWithAttachments) {
      // Simple email without attachments
      const response = await fetch(`${BASE_URL}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report: reportText, emails })
      });

      if (!response.ok) throw new Error("Failed to send email");
      const result = await response.json();
      alert(result.message);
    } else {
      // Email with files/photos/audio
      const formData = new FormData();
      formData.append('report', reportText);
      formData.append('emails', emails);

      const docFiles = document.getElementById('file-upload').files;
      const photoFiles = document.getElementById('photo-upload').files;
      const audioFiles = document.getElementById('audio-upload').files;

      for (const f of docFiles) formData.append('files', f);
      for (const p of photoFiles) formData.append('photos', p);
      for (const a of audioFiles) formData.append('audio', a);

      const response = await fetch(`${BASE_URL}/send-email-with-attachments`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error("Failed to send email with attachments");
      const result = await response.json();
      alert(result.message);
    }
  } catch (err) {
    alert("Email failed: " + err.message);
    console.error(err);
  }
}

// Event listeners
document.getElementById('generate-btn').addEventListener('click', generateReport);
document.getElementById('download-btn').addEventListener('click', downloadReport);
document.getElementById('email-btn').addEventListener('click', sendEmail);
