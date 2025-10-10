/**
 * Form Integration for A/B Testing
 * Integrates A/B testing data with form submissions
 */

class FormABIntegration {
    constructor() {
        this.init();
    }

    init() {
        // Wait for A/B testing system to be available
        if (window.abTesting) {
            this.setupFormHandlers();
        } else {
            // Wait for A/B testing system to load
            const checkABTesting = setInterval(() => {
                if (window.abTesting) {
                    clearInterval(checkABTesting);
                    this.setupFormHandlers();
                }
            }, 100);
        }
    }

    setupFormHandlers() {
        // Handle automation form (from index-alt.html)
        const automationForm = document.getElementById('automation-form');
        if (automationForm) {
            this.enhanceForm(automationForm);
        }

        // Handle contact forms
        const contactForms = document.querySelectorAll('#contact-form-data, #modal-contact-form-data');
        contactForms.forEach(form => {
            this.enhanceForm(form);
        });

        // Handle any other forms that might exist
        const allForms = document.querySelectorAll('form');
        allForms.forEach(form => {
            if (!form.hasAttribute('data-ab-enhanced')) {
                this.enhanceForm(form);
            }
        });
    }

    enhanceForm(form) {
        form.setAttribute('data-ab-enhanced', 'true');
        
        // Override the form submission
        const originalSubmit = form.onsubmit;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            
            // Add A/B testing data
            const enhancedFormData = window.abTesting.trackFormSubmission(formData);
            
            // Call original form handler with enhanced data
            this.handleFormSubmission(form, enhancedFormData, originalSubmit);
        });
    }

    handleFormSubmission(form, formData, originalSubmit) {
        const formId = form.id || 'unknown-form';
        
        // Check if this is the automation form from index-alt.html
        if (formId === 'automation-form') {
            this.handleAutomationForm(form, formData);
            return;
        }

        // Check if this is a contact form
        if (formId.includes('contact')) {
            this.handleContactForm(form, formData);
            return;
        }

        // Default handling for other forms
        this.handleGenericForm(form, formData);
    }

    handleAutomationForm(form, formData) {
        // Validate required checkboxes (from original code)
        const improvements = document.querySelectorAll('input[name="improvements"]:checked');
        if (improvements.length === 0) {
            alert('Please select at least one area that needs improvement.');
            return;
        }
        
        // Add loading state to submit button
        const submitBtn = document.getElementById('submit-form');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        // Simulate form submission delay for better UX
        setTimeout(() => {
            // Hide form and show confirmation
            document.getElementById('automation-form').style.display = 'none';
            document.getElementById('confirmation').classList.add('show');
            
            // Scroll to confirmation with smooth animation
            document.getElementById('confirmation').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Reset submit button (in case user goes back)
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Log form data with A/B testing info
            console.log('Automation form submitted with A/B data:', Object.fromEntries(formData));
            
            // Send to server (you can modify this to send to your actual endpoint)
            this.sendToServer(formData, 'automation-form');
            
            // Track form submission event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'engagement',
                    'event_label': 'automation_form',
                    'ab_variation': formData.get('ab_test_variation'),
                    'ab_title': formData.get('ab_test_title')
                });
            }
        }, 1500);
    }

    handleContactForm(form, formData) {
        // Simple validation
        let proceed = true;
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                proceed = false;
                input.style.borderColor = '#ff4444';
            } else {
                input.style.borderColor = '';
            }
        });

        if (!proceed) {
            alert('Please fill in all required fields.');
            return;
        }

        // Add loading state
        const submitBtn = form.querySelector('.contact_btn, .modal_contact_btn');
        if (submitBtn) {
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate sending
            setTimeout(() => {
                console.log('Contact form submitted with A/B data:', Object.fromEntries(formData));
                
                // Send to server
                this.sendToServer(formData, 'contact-form');
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Show success message
                alert('Thank you! Your message has been sent.');
                form.reset();
            }, 1000);
        }
    }

    handleGenericForm(form, formData) {
        console.log('Generic form submitted with A/B data:', Object.fromEntries(formData));
        this.sendToServer(formData, 'generic-form');
    }

    async sendToServer(formData, formType) {
        // Convert FormData to object for easier handling
        const data = Object.fromEntries(formData);
        
        // Handle file upload if present
        const fileUpload = document.getElementById('file-upload');
        if (fileUpload && fileUpload.files && fileUpload.files[0]) {
            const file = fileUpload.files[0];
            try {
                // Convert file to base64
                const base64 = await this.fileToBase64(file);
                data.fileName = file.name;
                data.fileContent = base64;
                data.fileType = file.type;
                console.log('📁 File prepared for upload:', file.name, 'Size:', file.size, 'bytes');
            } catch (error) {
                console.error('❌ File upload error:', error);
                alert('Error preparing file for upload. Please try again.');
                return;
            }
        }
        
        // Map form fields to match Google Apps Script expectations
        const mappedData = {
            name: data.firstname || data.fullname || data.name || '',
            email: data.email || '',
            phone: data['phone-number'] || data.phone || '',
            company: data.company || '',
            projectType: data.projectType || data.role || '',
            budget: data.budget || '',
            timeline: data.timeline || '',
            improvements: data.improvements || '',
            customImprovement: data['custom-improvement'] || '',
            startDate: data.startDate || data['start-date'] || '',
            message: data.message || data.kpi || '',
            contactMethod: data['contact-method'] || '',
            fileName: data.fileName || '',
            fileContent: data.fileContent || '',
            fileType: data.fileType || '',
            ab_test_variation: data.ab_test_variation || '',
            ab_test_title: data.ab_test_title || '',
            form_type: formType,
            url: window.location.href
        };
        
        console.log('📋 Original form data:', data);
        console.log('📋 Mapped data for Google Sheets:', mappedData);
        
        // Check if we're running locally (file:// protocol)
        const isLocalFile = window.location.protocol === 'file:';
        
        if (isLocalFile) {
            console.log('🔧 Running locally - skipping server requests');
            console.log('📋 Form data that would be sent:', data);
            console.log('✅ Form submission successful (local mode)');
            return;
        }
        
        // Send to Google Sheets first (if enabled)
        if (window.googleSheetsIntegration && window.googleSheetsIntegration.isEnabled) {
            try {
                console.log('🔄 Attempting to submit to Google Sheets...');
                // Create new FormData with mapped field names
                const mappedFormData = new FormData();
                Object.keys(mappedData).forEach(key => {
                    mappedFormData.append(key, mappedData[key]);
                });
                
                const sheetsResult = await window.googleSheetsIntegration.submitToGoogleSheets(mappedFormData, formType);
                if (sheetsResult.success) {
                    console.log('✅ Data saved to Google Sheets');
                } else {
                    console.warn('⚠️ Google Sheets submission failed:', sheetsResult.message);
                }
            } catch (error) {
                console.error('❌ Google Sheets error:', error);
                console.error('❌ Error details:', {
                    message: error.message,
                    stack: error.stack,
                    url: window.googleSheetsIntegration.webAppUrl
                });
            }
        } else {
            console.log('ℹ️ Google Sheets integration not enabled or not available');
            console.log('ℹ️ googleSheetsIntegration available:', !!window.googleSheetsIntegration);
            console.log('ℹ️ isEnabled:', window.googleSheetsIntegration?.isEnabled);
        }
    }
    
    // Helper method to convert file to base64
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Remove the data URL prefix (data:image/jpeg;base64,)
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    }
}

// Initialize form integration when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.formABIntegration = new FormABIntegration();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormABIntegration;
}
