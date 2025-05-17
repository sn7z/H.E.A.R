// Report form functionality for SafeGuard

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const incidentTypeSelect = document.getElementById('incident-type');
  const otherTypeContainer = document.getElementById('other-type-container');
  const otherTypeInput = document.getElementById('other-type');
  
  const witnessRadios = document.querySelectorAll('input[name="witnesses"]');
  const witnessDetailsContainer = document.getElementById('witness-details-container');
  
  const evidenceRadios = document.querySelectorAll('input[name="evidence"]');
  const evidenceUploadContainer = document.getElementById('evidence-upload-container');
  
  const supportCheckboxes = document.querySelectorAll('input[name="support-type"]');
  const otherSupportContainer = document.getElementById('other-support-container');
  
  const saveButton = document.getElementById('save-draft');
  const reportForm = document.getElementById('incident-report-form');
  
  // Set up conditional form visibility
  if (incidentTypeSelect && otherTypeContainer) {
    incidentTypeSelect.addEventListener('change', () => {
      if (incidentTypeSelect.value === 'other') {
        otherTypeContainer.style.display = 'block';
        otherTypeInput.setAttribute('required', 'required');
      } else {
        otherTypeContainer.style.display = 'none';
        otherTypeInput.removeAttribute('required');
      }
    });
  }
  
  // Witness details toggle
  if (witnessRadios.length && witnessDetailsContainer) {
    witnessRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.value === 'yes') {
          witnessDetailsContainer.style.display = 'block';
        } else {
          witnessDetailsContainer.style.display = 'none';
        }
      });
    });
  }
  
  // Evidence upload toggle
  if (evidenceRadios.length && evidenceUploadContainer) {
    evidenceRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.value === 'yes') {
          evidenceUploadContainer.style.display = 'block';
        } else {
          evidenceUploadContainer.style.display = 'none';
        }
      });
    });
  }
  
  // Other support needs toggle
  if (supportCheckboxes.length && otherSupportContainer) {
    supportCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        if (checkbox.value === 'other' && checkbox.checked) {
          otherSupportContainer.style.display = 'block';
        } else if (checkbox.value === 'other' && !checkbox.checked) {
          otherSupportContainer.style.display = 'none';
        }
      });
    });
  }
  
  // Save draft functionality
  if (saveButton) {
    saveButton.addEventListener('click', () => {
      saveFormDraft();
    });
  }
  
  // Form submission
  if (reportForm) {
    reportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitForm();
    });
    
    // Load draft if exists
    const savedDraft = localStorage.getItem('reportFormDraft');
    if (savedDraft) {
      showDraftNotification();
    }
  }
  
  // Function to save form draft
  function saveFormDraft() {
    // Get all form inputs
    const formData = new FormData(reportForm);
    const formObject = {};
    
    formData.forEach((value, key) => {
      // Handle checkboxes (they can have multiple values)
      if (key.includes('support-type')) {
        if (!formObject[key]) {
          formObject[key] = [];
        }
        formObject[key].push(value);
      } else {
        formObject[key] = value;
      }
    });
    
    // Save to localStorage
    localStorage.setItem('reportFormDraft', JSON.stringify(formObject));
    
    // Show success notification
    showNotification('Draft saved successfully. You can return to complete it later.', 'success');
  }
  
  // Function to load form draft
  function loadFormDraft() {
    const savedDraft = localStorage.getItem('reportFormDraft');
    if (!savedDraft) return;
    
    const formObject = JSON.parse(savedDraft);
    
    // Populate form fields
    Object.keys(formObject).forEach(key => {
      const input = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
      if (!input) return;
      
      if (input.type === 'checkbox' || input.type === 'radio') {
        if (Array.isArray(formObject[key])) {
          // Handle multiple checkboxes with the same name
          document.querySelectorAll(`[name="${key}"]`).forEach(checkbox => {
            if (formObject[key].includes(checkbox.value)) {
              checkbox.checked = true;
              // Trigger change event for conditional form elements
              const event = new Event('change');
              checkbox.dispatchEvent(event);
            }
          });
        } else {
          // Handle radio buttons
          document.querySelectorAll(`[name="${key}"]`).forEach(radio => {
            if (radio.value === formObject[key]) {
              radio.checked = true;
              // Trigger change event for conditional form elements
              const event = new Event('change');
              radio.dispatchEvent(event);
            }
          });
        }
      } else if (input.tagName === 'SELECT') {
        input.value = formObject[key];
        // Trigger change event for conditional form elements
        const event = new Event('change');
        input.dispatchEvent(event);
      } else {
        // Text inputs, textareas, etc.
        input.value = formObject[key];
      }
    });
    
    showNotification('Your draft has been loaded.', 'info');
  }
  
  // Function to submit form
  function submitForm() {
    // Validate required fields (in addition to HTML5 validation)
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        highlightInvalidField(field);
        isValid = false;
      } else {
        removeInvalidHighlight(field);
      }
    });
    
    // Additional validation for incident type "other"
    if (incidentTypeSelect.value === 'other' && !otherTypeInput.value.trim()) {
      highlightInvalidField(otherTypeInput);
      isValid = false;
    }
    
    if (!isValid) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }
    
    // Show loading state
    const submitBtn = reportForm.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate form submission (in a real app, this would be an API call)
    setTimeout(() => {
      // Success case
      // Remove draft from local storage
      localStorage.removeItem('reportFormDraft');
      
      // Show success message
      showSuccessModal();
      
      // Reset form
      reportForm.reset();
      
      // Reset conditional form elements
      otherTypeContainer.style.display = 'none';
      witnessDetailsContainer.style.display = 'none';
      evidenceUploadContainer.style.display = 'none';
      otherSupportContainer.style.display = 'none';
      
      // Reset button state
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }, 2000);
  }
  
  // Form validation helpers
  function highlightInvalidField(field) {
    field.classList.add('invalid');
    field.parentNode.classList.add('error');
    
    // Add error message if not already present
    if (!field.parentNode.querySelector('.field-error')) {
      const errorMessage = document.createElement('div');
      errorMessage.className = 'field-error';
      errorMessage.textContent = field.getAttribute('data-error') || 'This field is required';
      errorMessage.style.color = 'var(--error)';
      errorMessage.style.fontSize = 'var(--font-size-sm)';
      errorMessage.style.marginTop = '4px';
      field.parentNode.appendChild(errorMessage);
    }
    
    // Add error styles
    field.style.borderColor = 'var(--error)';
    
    // Focus on first invalid field
    if (document.querySelector('.invalid') === field) {
      field.focus();
    }
  }
  
  function removeInvalidHighlight(field) {
    field.classList.remove('invalid');
    field.parentNode.classList.remove('error');
    field.style.borderColor = '';
    
    // Remove error message if present
    const errorMessage = field.parentNode.querySelector('.field-error');
    if (errorMessage) {
      field.parentNode.removeChild(errorMessage);
    }
  }
  
  // Show draft notification
  function showDraftNotification() {
    const notification = document.createElement('div');
    notification.className = 'draft-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-save"></i>
        <div>
          <h3>Draft Found</h3>
          <p>You have a saved draft of your report. Would you like to load it?</p>
        </div>
      </div>
      <div class="notification-actions">
        <button class="btn btn-sm btn-outline" id="discard-draft">Discard</button>
        <button class="btn btn-sm btn-primary" id="load-draft">Load Draft</button>
      </div>
    `;
    
    // Style notification
    Object.assign(notification.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: 'var(--white)',
      borderRadius: 'var(--border-radius)',
      boxShadow: 'var(--shadow-lg)',
      padding: '16px',
      zIndex: 'var(--z-toast)',
      width: '320px',
      animation: 'slideInUp 0.3s ease-out forwards',
      border: '1px solid var(--gray-200)',
      borderLeft: '4px solid var(--primary)'
    });
    
    // Style notification content
    const content = notification.querySelector('.notification-content');
    Object.assign(content.style, {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      marginBottom: '12px'
    });
    
    // Style icon
    const icon = content.querySelector('i');
    Object.assign(icon.style, {
      fontSize: '24px',
      color: 'var(--primary)'
    });
    
    // Style heading
    const heading = content.querySelector('h3');
    Object.assign(heading.style, {
      margin: '0 0 4px 0',
      fontSize: 'var(--font-size-lg)'
    });
    
    // Style paragraph
    const paragraph = content.querySelector('p');
    Object.assign(paragraph.style, {
      margin: '0',
      color: 'var(--gray-700)',
      fontSize: 'var(--font-size-sm)'
    });
    
    // Style notification actions
    const actions = notification.querySelector('.notification-actions');
    Object.assign(actions.style, {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '8px'
    });
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add event listeners
    document.getElementById('load-draft').addEventListener('click', () => {
      loadFormDraft();
      document.body.removeChild(notification);
    });
    
    document.getElementById('discard-draft').addEventListener('click', () => {
      localStorage.removeItem('reportFormDraft');
      document.body.removeChild(notification);
      showNotification('Draft discarded.', 'info');
    });
  }
  
  // Show success modal
  function showSuccessModal() {
    const modal = document.createElement('div');
    modal.className = 'modal report-success-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2>Report Submitted</h2>
        <p>Thank you for submitting your report. A member of our support team will review your information and reach out to you through your preferred contact method.</p>
        <p>Your report ID is: <strong>RPT-${Date.now().toString().substring(3, 10)}</strong></p>
        <p>Please save this ID for your records.</p>
        <div class="modal-actions">
          <button class="btn btn-primary" id="success-close">Close</button>
        </div>
      </div>
    `;
    
    // Add to document
    document.body.appendChild(modal);
    
    // Style success icon
    const successIcon = modal.querySelector('.success-icon');
    Object.assign(successIcon.style, {
      textAlign: 'center',
      marginBottom: '16px'
    });
    
    const icon = successIcon.querySelector('i');
    Object.assign(icon.style, {
      fontSize: '64px',
      color: 'var(--success)'
    });
    
    // Style modal actions
    const actions = modal.querySelector('.modal-actions');
    Object.assign(actions.style, {
      marginTop: '24px',
      textAlign: 'center'
    });
    
    // Show modal
    modal.style.display = 'block';
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
    
    // Close button events
    const closeBtn = modal.querySelector('.close-modal');
    const successCloseBtn = document.getElementById('success-close');
    
    closeBtn.addEventListener('click', () => {
      closeSuccessModal(modal);
    });
    
    successCloseBtn.addEventListener('click', () => {
      closeSuccessModal(modal);
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeSuccessModal(modal);
      }
    });
  }
  
  function closeSuccessModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      document.body.removeChild(modal);
    }, 300);
  }
  
  // Show notification (reused from auth.js)
  function showNotification(message, type = 'info') {
    // Check if showNotification exists in window (defined in auth.js)
    if (window.showNotification) {
      window.showNotification(message, type);
      return;
    }
    
    // Fallback implementation if not defined in window
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas ${getIconForType(type)}"></i>
        <p>${message}</p>
      </div>
      <button class="close-notification">×</button>
    `;
    
    // Add styles
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'var(--white)';
    notification.style.borderRadius = 'var(--border-radius)';
    notification.style.boxShadow = 'var(--shadow-lg)';
    notification.style.padding = '12px 16px';
    notification.style.zIndex = 'var(--z-toast)';
    notification.style.display = 'flex';
    notification.style.justifyContent = 'space-between';
    notification.style.alignItems = 'center';
    notification.style.minWidth = '300px';
    notification.style.animation = 'slideInRight 0.3s ease-out forwards';
    
    // Set border color based on type
    if (type === 'success') {
      notification.style.borderLeft = '4px solid var(--success)';
    } else if (type === 'error') {
      notification.style.borderLeft = '4px solid var(--error)';
    } else if (type === 'warning') {
      notification.style.borderLeft = '4px solid var(--warning)';
    } else {
      notification.style.borderLeft = '4px solid var(--primary)';
    }
    
    // Style notification content
    const content = notification.querySelector('.notification-content');
    content.style.display = 'flex';
    content.style.alignItems = 'center';
    content.style.gap = '12px';
    
    // Style icon
    const icon = content.querySelector('i');
    icon.style.fontSize = '20px';
    if (type === 'success') {
      icon.style.color = 'var(--success)';
    } else if (type === 'error') {
      icon.style.color = 'var(--error)';
    } else if (type === 'warning') {
      icon.style.color = 'var(--warning)';
    } else {
      icon.style.color = 'var(--primary)';
    }
    
    // Style close button
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.fontSize = '20px';
    closeBtn.style.color = 'var(--gray-600)';
    
    // Add to document
    document.body.appendChild(notification);
    
    // Close button event
    closeBtn.addEventListener('click', () => {
      notification.style.animation = 'slideInRight 0.3s ease-out reverse forwards';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse forwards';
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }
    }, 5000);
  }
  
  // Helper function to get icon for notification type
  function getIconForType(type) {
    switch (type) {
      case 'success':
        return 'fa-check-circle';
      case 'error':
        return 'fa-exclamation-circle';
      case 'warning':
        return 'fa-exclamation-triangle';
      default:
        return 'fa-info-circle';
    }
  }
});