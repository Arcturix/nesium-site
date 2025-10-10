/**
 * Google Sheets Integration for Form Submissions
 * Handles sending form data to Google Sheets via Google Apps Script
 */

class GoogleSheetsIntegration {
    constructor() {
        // Replace this with your Google Apps Script web app URL
        // Get this from: Deploy → New deployment → Web app → Copy the URL
        this.webAppUrl = 'https://script.google.com/macros/s/AKfycby2dC6bvS8GAFd_we-RoOnQQsWL53RAZ1ioqvVEij96B9kJRRd9RVLwun7B6ZaeesUb/exec';
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
            // Convert FormData to object (handle both FormData and regular objects)
            let data;
            if (formData instanceof FormData) {
                data = Object.fromEntries(formData);
            } else if (typeof formData === 'object' && formData !== null) {
                data = { ...formData };
            } else {
                throw new Error('Invalid form data provided');
            }
            
            // Add metadata
            data.form_type = formType;
            data.url = window.location.href;
            
            // Build URL with parameters for JSONP
            const params = new URLSearchParams();
            Object.keys(data).forEach(key => {
                if (data[key] !== null && data[key] !== undefined) {
                    params.append(key, data[key]);
                }
            });
            
            // Add callback parameter for JSONP
            const callbackName = 'googleSheetsCallback_' + Date.now();
            params.append('callback', callbackName);
            
            const url = `${this.webAppUrl}?${params.toString()}`;
            
            console.log('🔄 Attempting JSONP request to Google Sheets...');
            console.log('📋 URL:', url);
            
            // Create JSONP request
            return new Promise((resolve, reject) => {
                // Set up callback function
                window[callbackName] = (response) => {
                    // Clean up callback
                    delete window[callbackName];
                    
                    if (response.success) {
                        console.log('✅ Form data submitted to Google Sheets successfully (JSONP)');
                        resolve({ success: true, message: 'Data saved to Google Sheets' });
                    } else {
                        console.error('❌ Google Sheets submission failed (JSONP):', response.message);
                        resolve({ success: false, message: response.message });
                    }
                };
                
                // Create script tag for JSONP
                const script = document.createElement('script');
                script.src = url;
                script.onerror = () => {
                    delete window[callbackName];
                    console.error('❌ JSONP request failed');
                    resolve({ success: false, message: 'Network error: JSONP request failed' });
                };
                
                // Add timeout
                setTimeout(() => {
                    if (window[callbackName]) {
                        delete window[callbackName];
                        console.error('❌ JSONP request timeout');
                        resolve({ success: false, message: 'Request timeout' });
                    }
                }, 10000);
                
                // Execute JSONP request
                document.head.appendChild(script);
                
                // Clean up script tag after a delay
                setTimeout(() => {
                    if (script.parentNode) {
                        script.parentNode.removeChild(script);
                    }
                }, 1000);
            });
            
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
            
            // Use JSONP for testing (same as main submission)
            const callbackName = 'testCallback_' + Date.now();
            const url = `${this.webAppUrl}?callback=${callbackName}`;
            
            return new Promise((resolve) => {
                // Set up callback function
                window[callbackName] = (response) => {
                    // Clean up callback
                    delete window[callbackName];
                    
                    console.log('✅ Google Sheets connection test successful:', response);
                    resolve({ success: true, message: 'Connection successful' });
                };
                
                // Create script tag for JSONP
                const script = document.createElement('script');
                script.src = url;
                script.onerror = () => {
                    delete window[callbackName];
                    console.error('❌ Google Sheets connection test failed');
                    resolve({ success: false, message: 'Connection failed' });
                };
                
                // Add timeout
                setTimeout(() => {
                    if (window[callbackName]) {
                        delete window[callbackName];
                        console.error('❌ Connection test timeout');
                        resolve({ success: false, message: 'Connection timeout' });
                    }
                }, 5000);
                
                // Execute JSONP request
                document.head.appendChild(script);
                
                // Clean up script tag after a delay
                setTimeout(() => {
                    if (script.parentNode) {
                        script.parentNode.removeChild(script);
                    }
                }, 1000);
            });
            
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
