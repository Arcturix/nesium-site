/**
 * Google Sheets Integration for Form Submissions
 * Handles sending form data to Google Sheets via Google Apps Script
 */

class GoogleSheetsIntegration {
    constructor() {
        // Replace this with your Google Apps Script web app URL
        // Get this from: Deploy → New deployment → Web app → Copy the URL
        this.webAppUrl = 'https://script.google.com/macros/s/AKfycbw-Ek1ts79BwTBwpi34duCW_F17pGhUz54TWJ6znbyrsAbLey1CB7DpfymW405-_S66/exec';
        this.isEnabled = this.webAppUrl !== 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
        
        if (this.isEnabled) {
            console.log('Google Sheets integration enabled');
        } else {
            console.warn('Google Sheets integration disabled - please set webAppUrl');
        }
    }

    async submitToGoogleSheets(formData, formType = 'unknown') {
        // Check if we're running locally (file:// protocol)
        const isLocalFile = window.location.protocol === 'file:';
        
        if (isLocalFile) {
            console.log('🔧 Local testing mode - simulating Google Sheets submission');
            console.log('📋 Data that would be sent to Google Sheets:', Object.fromEntries(formData));
            return { success: true, message: 'Simulated submission (local mode)' };
        }
        
        if (!this.isEnabled) {
            console.warn('Google Sheets integration not configured');
            return { success: false, message: 'Google Sheets integration not configured' };
        }

        try {
            // Handle both FormData and regular objects
            let data;
            if (formData instanceof FormData) {
                data = Object.fromEntries(formData);
            } else if (typeof formData === 'object' && formData !== null) {
                data = { ...formData };
            } else {
                throw new Error('Invalid form data provided');
            }
            
            console.log('📋 Data being processed:', data);
            
            // Add metadata
            data.form_type = formType;
            data.url = window.location.href;
            
            console.log('🔄 Attempting POST request to Google Sheets...');
            console.log('📋 Data being sent:', data);
            
            // Use form submission method that works better with Google Apps Script CORS
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (data[key] !== null && data[key] !== undefined) {
                    formData.append(key, data[key]);
                }
            });
            
            const response = await fetch(this.webAppUrl, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                console.log('✅ Form data submitted to Google Sheets successfully (POST)');
                return { success: true, message: 'Data saved to Google Sheets' };
            } else {
                console.error('❌ Google Sheets submission failed (POST):', result.message);
                return { success: false, message: result.message };
            }
            
        } catch (error) {
            console.error('❌ Error submitting to Google Sheets:', error.message);
            return { success: false, message: 'Network error: ' + error.message };
        }
    }

    // Method to test the connection
    async testConnection() {
        if (!this.isEnabled) {
            return { success: false, message: 'Google Sheets integration not configured' };
        }

        try {
            console.log('🔄 Testing Google Sheets connection to:', this.webAppUrl);
            
            // Use POST request for testing with minimal data
            const testFormData = new FormData();
            testFormData.append('test', 'true');
            testFormData.append('timestamp', new Date().toISOString());
            
            const response = await fetch(this.webAppUrl, {
                method: 'POST',
                body: testFormData
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('✅ Google Sheets connection test successful:', result);
            return { success: true, message: 'Connection successful' };
            
        } catch (error) {
            console.error('❌ Google Sheets connection test failed:', error);
            return { success: false, message: 'Connection failed: ' + error.message };
        }
    }

    // Method to update the web app URL
    setWebAppUrl(url) {
        this.webAppUrl = url;
        this.isEnabled = url && url !== 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
        
        if (this.isEnabled) {
            console.log('Google Sheets integration enabled with URL:', url);
        }
    }
}

// Initialize Google Sheets integration
window.googleSheetsIntegration = new GoogleSheetsIntegration();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleSheetsIntegration;
}
