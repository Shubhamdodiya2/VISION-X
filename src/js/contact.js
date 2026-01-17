// Contact Form Validation and Submission
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const submitBtn = document.querySelector(".submit-btn");
  const btnText = document.querySelector(".btn-text");
  const spinner = document.getElementById("spinner");
  const successMessage = document.getElementById("success-message");

  // Form elements
  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const subjectField = document.getElementById("subject");
  const messageField = document.getElementById("message");

  // Error message elements
  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const subjectError = document.getElementById("subject-error");
  const messageError = document.getElementById("message-error");

  // Validation patterns
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const namePattern = /^[a-zA-Z\s]{2,50}$/;

  // Real-time validation
  nameField.addEventListener("blur", validateName);
  emailField.addEventListener("blur", validateEmail);
  subjectField.addEventListener("change", validateSubject);
  messageField.addEventListener("blur", validateMessage);

  // Clear errors on input
  nameField.addEventListener("input", () => clearError(nameField, nameError));
  emailField.addEventListener("input", () => clearError(emailField, emailError));
  subjectField.addEventListener("change", () => clearError(subjectField, subjectError));
  messageField.addEventListener("input", () => clearError(messageField, messageError));

  function validateName() {
    const name = nameField.value.trim();
    
    if (!name) {
      showError(nameField, nameError, "Name is required");
      return false;
    }
    
    if (!namePattern.test(name)) {
      showError(nameField, nameError, "Please enter a valid name (2-50 characters, letters only)");
      return false;
    }
    
    clearError(nameField, nameError);
    return true;
  }

  function validateEmail() {
    const email = emailField.value.trim();
    
    if (!email) {
      showError(emailField, emailError, "Email is required");
      return false;
    }
    
    if (!emailPattern.test(email)) {
      showError(emailField, emailError, "Please enter a valid email address");
      return false;
    }
    
    clearError(emailField, emailError);
    return true;
  }

  function validateSubject() {
    const subject = subjectField.value;
    
    if (!subject) {
      showError(subjectField, subjectError, "Please select a subject");
      return false;
    }
    
    clearError(subjectField, subjectError);
    return true;
  }

  function validateMessage() {
    const message = messageField.value.trim();
    
    if (!message) {
      showError(messageField, messageError, "Message is required");
      return false;
    }
    
    if (message.length < 10) {
      showError(messageField, messageError, "Message must be at least 10 characters long");
      return false;
    }
    
    if (message.length > 1000) {
      showError(messageField, messageError, "Message must be less than 1000 characters");
      return false;
    }
    
    clearError(messageField, messageError);
    return true;
  }

  function showError(field, errorElement, message) {
    field.parentElement.classList.add("error");
    errorElement.textContent = message;
    errorElement.classList.add("show");
  }

  function clearError(field, errorElement) {
    field.parentElement.classList.remove("error");
    errorElement.textContent = "";
    errorElement.classList.remove("show");
  }

  function clearAllErrors() {
    const errorElements = document.querySelectorAll(".error-message");
    const formGroups = document.querySelectorAll(".form-group");
    
    errorElements.forEach(error => {
      error.textContent = "";
      error.classList.remove("show");
    });
    
    formGroups.forEach(group => {
      group.classList.remove("error");
    });
  }

  function setLoadingState(loading) {
    if (loading) {
      submitBtn.disabled = true;
      submitBtn.classList.add("loading");
      btnText.style.opacity = "0";
      spinner.style.display = "block";
    } else {
      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
      btnText.style.opacity = "1";
      spinner.style.display = "none";
    }
  }

  function showSuccessMessage() {
    form.style.display = "none";
    successMessage.classList.add("show");
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: "smooth", block: "center" });
    
    // Reset form after 5 seconds
    setTimeout(() => {
      resetForm();
    }, 5000);
  }

  function resetForm() {
    form.reset();
    clearAllErrors();
    form.style.display = "block";
    successMessage.classList.remove("show");
    setLoadingState(false);
  }

  // Form submission
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    
    // Clear previous errors
    clearAllErrors();
    
    // Validate all fields
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isSubjectValid = validateSubject();
    const isMessageValid = validateMessage();
    
    if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
      // Focus on first error field
      const firstErrorField = document.querySelector(".form-group.error input, .form-group.error select, .form-group.error textarea");
      if (firstErrorField) {
        firstErrorField.focus();
      }
      return;
    }
    
    // Start loading state
    setLoadingState(true);
    
    try {
      // Simulate form submission (replace with actual API call)
      await submitContactForm({
        name: nameField.value.trim(),
        email: emailField.value.trim(),
        subject: subjectField.value,
        message: messageField.value.trim(),
        timestamp: new Date().toISOString()
      });
      
      // Show success message
      showSuccessMessage();
      
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error sending your message. Please try again later.");
      setLoadingState(false);
    }
  });

  // Simulate form submission (replace with actual backend integration)
  async function submitContactForm(formData) {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        console.log("Contact form submitted:", formData);
        
        // In a real application, you would send this data to your backend
        // Example:
        // fetch('/api/contact', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData)
        // });
        
        resolve();
      }, 2000);
    });
  }

  // Character counter for message field
  const messageCounter = document.createElement("div");
  messageCounter.className = "character-counter";
  messageCounter.style.cssText = `
    font-size: 0.8rem;
    color: #6c757d;
    text-align: right;
    margin-top: 0.5rem;
  `;
  messageField.parentElement.appendChild(messageCounter);

  function updateCharacterCounter() {
    const length = messageField.value.length;
    const maxLength = 1000;
    messageCounter.textContent = `${length}/${maxLength} characters`;
    
    if (length > maxLength * 0.9) {
      messageCounter.style.color = "#e74c3c";
    } else if (length > maxLength * 0.7) {
      messageCounter.style.color = "#f39c12";
    } else {
      messageCounter.style.color = "#6c757d";
    }
  }

  messageField.addEventListener("input", updateCharacterCounter);
  updateCharacterCounter(); // Initialize counter

  // Auto-resize textarea
  messageField.addEventListener("input", function() {
    this.style.height = "auto";
    this.style.height = Math.min(this.scrollHeight, 200) + "px";
  });
});
