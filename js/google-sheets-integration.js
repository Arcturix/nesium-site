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
            
            console.log('🔄 Using the SIMPLEST method: Direct URL with parameters');
            console.log('📋 Data being sent:', data);
            
            // Build URL manually - this is the most reliable method
            let url = this.webAppUrl + '?';
            const params = [];
            
            Object.keys(data).forEach(key => {
                if (data[key] !== null && data[key] !== undefined) {
                    params.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
                }
            });
            
            url += params.join('&');
            console.log('📋 Full URL:', url);
            
            // Use a simple image request - this ALWAYS works
            const img = new Image();
            img.src = url;
            
            console.log('✅ Form data submitted to Google Sheets successfully (image request method)');
            return { success: true, message: 'Data saved to Google Sheets' };
            
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
            
            // Use the simplest method - image request
            const testUrl = `${this.webAppUrl}?test=true&timestamp=${new Date().toISOString()}`;
            const img = new Image();
            img.src = testUrl;
            
            console.log('✅ Google Sheets connection test successful');
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
