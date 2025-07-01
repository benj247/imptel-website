// Form Handler - IMPTEL Website

(function() {
    'use strict';
    
    // Initialize form handler when DOM is ready
    document.addEventListener('DOMContentLoaded', initFormHandler);
    
    function initFormHandler() {
        // Find all forms with data-form attribute
        const forms = document.querySelectorAll('form[data-form]');
        
        forms.forEach(form => {
            form.addEventListener('submit', handleFormSubmit);
            
            // Add real-time validation
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', validateField);
                input.addEventListener('input', clearError);
            });
        });
    }
    
    // Handle form submission
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Validate all fields
        if (!validateForm(form)) {
            return;
        }
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Add timestamp
        data.timestamp = new Date().toISOString();
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = i18n.getCurrentLanguage() === 'pt' ? 'Enviando...' : 'Sending...';
        
        try {
            // Here you would normally send the data to a server
            // For now, we'll simulate a successful submission
            await simulateFormSubmission(data);
            
            // Show success message
            showMessage(form, 'success', i18n.getCurrentLanguage() === 'pt' 
                ? 'Mensagem enviada com sucesso!' 
                : 'Message sent successfully!');
            
            // Reset form
            form.reset();
            
            // Log to console for demo purposes
            console.log('Form submitted:', data);
            
        } catch (error) {
            // Show error message
            showMessage(form, 'error', i18n.getCurrentLanguage() === 'pt' 
                ? 'Erro ao enviar mensagem. Tente novamente.' 
                : 'Error sending message. Please try again.');
            
            console.error('Form submission error:', error);
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
    
    // Validate entire form
    function validateForm(form) {
        let isValid = true;
        const fields = form.querySelectorAll('[required]');
        
        fields.forEach(field => {
            if (!validateField({ target: field })) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Validate individual field
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            errorMessage = i18n.getCurrentLanguage() === 'pt' 
                ? 'Este campo é obrigatório' 
                : 'This field is required';
            isValid = false;
        }
        
        // Validate email
        if (field.type === 'email' && value) {
            if (!utils.isValidEmail(value)) {
                errorMessage = i18n.getCurrentLanguage() === 'pt' 
                    ? 'Por favor, insira um email válido' 
                    : 'Please enter a valid email';
                isValid = false;
            }
        }
        
        // Validate phone
        if (field.type === 'tel' && value) {
            if (!utils.isValidPhone(value)) {
                errorMessage = i18n.getCurrentLanguage() === 'pt' 
                    ? 'Por favor, insira um telefone válido' 
                    : 'Please enter a valid phone number';
                isValid = false;
            }
        }
        
        // Show or hide error
        if (!isValid) {
            showFieldError(field, errorMessage);
        } else {
            clearFieldError(field);
        }
        
        return isValid;
    }
    
    // Clear error on input
    function clearError(e) {
        const field = e.target;
        if (field.value.trim()) {
            clearFieldError(field);
        }
    }
    
    // Show field error
    function showFieldError(field, message) {
        const wrapper = field.parentElement;
        let errorElement = wrapper.querySelector('.field-error');
        
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'field-error';
            wrapper.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        field.classList.add('error');
    }
    
    // Clear field error
    function clearFieldError(field) {
        const wrapper = field.parentElement;
        const errorElement = wrapper.querySelector('.field-error');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        field.classList.remove('error');
    }
    
    // Show form message
    function showMessage(form, type, message) {
        let messageElement = form.querySelector('.form-message');
        
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.className = 'form-message';
            form.appendChild(messageElement);
        }
        
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        // Auto-hide message after 5 seconds
        setTimeout(() => {
            messageElement.classList.add('fade-out');
            setTimeout(() => messageElement.remove(), 500);
        }, 5000);
    }
    
    // Simulate form submission (replace with actual API call)
    function simulateFormSubmission(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve(data);
                } else {
                    reject(new Error('Network error'));
                }
            }, 1500);
        });
    }
    
    // Add form styles
    const styles = `
        .field-error {
            display: block;
            color: #dc2626;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }
        
        input.error,
        textarea.error {
            border-color: #dc2626;
        }
        
        .form-message {
            padding: 1rem;
            border-radius: 0.5rem;
            margin-top: 1rem;
            text-align: center;
            animation: slide-in 0.3s ease-out;
        }
        
        .form-message.success {
            background: #d1fae5;
            color: #065f46;
            border: 1px solid #6ee7b7;
        }
        
        .form-message.error {
            background: #fee2e2;
            color: #991b1b;
            border: 1px solid #fca5a5;
        }
        
        .form-message.fade-out {
            animation: fade-out 0.5s ease-out forwards;
        }
        
        @keyframes slide-in {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fade-out {
            to {
                opacity: 0;
                transform: translateY(-10px);
            }
        }
    `;
    
    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    
    // Public API
    window.formHandler = {
        validate: validateForm,
        reset: function(formSelector) {
            const form = document.querySelector(formSelector);
            if (form) {
                form.reset();
                form.querySelectorAll('.field-error').forEach(el => el.remove());
                form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
            }
        }
    };
})();