/**
 * A/B Testing Analytics Dashboard
 * Provides a simple interface to view test results
 */

class ABAnalyticsDashboard {
    constructor() {
        this.init();
    }

    init() {
        // Create dashboard button
        this.createDashboardButton();
        
        // Create dashboard modal
        this.createDashboardModal();
    }

    createDashboardButton() {
        // Only show in development or if explicitly enabled
        if (this.shouldShowDashboard()) {
            const button = document.createElement('button');
            button.innerHTML = '📊 AB Test Results';
            button.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                background: #d6ff48;
                color: #0f0f0f;
                border: none;
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: 600;
                cursor: pointer;
                font-size: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            `;
            
            button.addEventListener('click', () => {
                this.showDashboard();
            });
            
            document.body.appendChild(button);
        }
    }

    shouldShowDashboard() {
        // Show dashboard if:
        // 1. URL contains 'localhost' or '127.0.0.1'
        // 2. URL contains 'dev' or 'test'
        // 3. localStorage has 'show_ab_dashboard' set to true
        const url = window.location.href.toLowerCase();
        const isLocal = url.includes('localhost') || url.includes('127.0.0.1');
        const isDev = url.includes('dev') || url.includes('test');
        const showDashboard = localStorage.getItem('show_ab_dashboard') === 'true';
        
        return isLocal || isDev || showDashboard;
    }

    createDashboardModal() {
        const modal = document.createElement('div');
        modal.id = 'ab-dashboard-modal';
        modal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10001;
            padding: 20px;
            box-sizing: border-box;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                max-width: 800px;
                margin: 0 auto;
                border-radius: 12px;
                padding: 24px;
                max-height: 90vh;
                overflow-y: auto;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <h2 style="margin: 0; color: #0f0f0f;">A/B Test Analytics Dashboard</h2>
                    <button id="close-dashboard" style="
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #666;
                    ">×</button>
                </div>
                
                <div id="dashboard-content">
                    <div style="margin-bottom: 24px;">
                        <h3>Current Test Status</h3>
                        <div id="current-status"></div>
                    </div>
                    
                    <div style="margin-bottom: 24px;">
                        <h3>Test Results</h3>
                        <div id="test-results"></div>
                    </div>
                    
                    <div style="margin-bottom: 24px;">
                        <h3>Actions</h3>
                        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                            <button id="export-data" style="
                                background: #d6ff48;
                                color: #0f0f0f;
                                border: none;
                                padding: 8px 16px;
                                border-radius: 6px;
                                cursor: pointer;
                                font-weight: 600;
                            ">Export Data</button>
                            <button id="reset-test" style="
                                background: #ff4444;
                                color: white;
                                border: none;
                                padding: 8px 16px;
                                border-radius: 6px;
                                cursor: pointer;
                                font-weight: 600;
                            ">Reset Test</button>
                            <button id="set-variation" style="
                                background: #4444ff;
                                color: white;
                                border: none;
                                padding: 8px 16px;
                                border-radius: 6px;
                                cursor: pointer;
                                font-weight: 600;
                            ">Set Variation</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        document.getElementById('close-dashboard').addEventListener('click', () => {
            this.hideDashboard();
        });
        
        document.getElementById('export-data').addEventListener('click', () => {
            this.exportData();
        });
        
        document.getElementById('reset-test').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset the test? This will clear all data.')) {
                window.abTesting.resetTest();
                this.updateDashboard();
            }
        });
        
        document.getElementById('set-variation').addEventListener('click', () => {
            this.showVariationSelector();
        });
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideDashboard();
            }
        });
    }

    showDashboard() {
        const modal = document.getElementById('ab-dashboard-modal');
        modal.style.display = 'block';
        this.updateDashboard();
    }

    hideDashboard() {
        const modal = document.getElementById('ab-dashboard-modal');
        modal.style.display = 'none';
    }

    updateDashboard() {
        if (!window.abTesting) return;
        
        const results = window.abTesting.getResults();
        const currentVariation = window.abTesting.currentVariation;
        const winner = window.abTesting.getWinner();
        
        // Update current status
        const currentStatusDiv = document.getElementById('current-status');
        const currentVariationData = results[currentVariation];
        currentStatusDiv.innerHTML = `
            <div style="background: #f5f5f5; padding: 16px; border-radius: 8px;">
                <p><strong>Current Variation:</strong> ${currentVariation}</p>
                <p><strong>Current Title:</strong> "${currentVariationData ? currentVariationData.title : 'Unknown'}"</p>
                <p><strong>Page Views:</strong> ${currentVariationData ? currentVariationData.pageViews : 0}</p>
                <p><strong>Form Submissions:</strong> ${currentVariationData ? currentVariationData.formSubmissions : 0}</p>
                <p><strong>Conversion Rate:</strong> ${currentVariationData ? (currentVariationData.conversionRate * 100).toFixed(2) : 0}%</p>
                ${winner === currentVariation ? '<p style="color: #00aa00; font-weight: bold;">🏆 WINNER!</p>' : ''}
            </div>
        `;
        
        // Update test results
        const testResultsDiv = document.getElementById('test-results');
        let resultsHTML = '<div style="display: grid; gap: 12px;">';
        
        Object.keys(results).forEach(variationId => {
            const result = results[variationId];
            const isWinner = winner === variationId;
            const isCurrent = currentVariation === variationId;
            
            resultsHTML += `
                <div style="
                    background: ${isWinner ? '#e8f5e8' : isCurrent ? '#fff3cd' : '#f8f9fa'};
                    border: 2px solid ${isWinner ? '#00aa00' : isCurrent ? '#ffc107' : '#dee2e6'};
                    padding: 16px;
                    border-radius: 8px;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                        <h4 style="margin: 0;">${variationId} ${isWinner ? '🏆' : ''} ${isCurrent ? '(Current)' : ''}</h4>
                        <span style="font-size: 12px; color: #666;">${result.events} total events</span>
                    </div>
                    <p style="margin: 0 0 8px 0; font-weight: 600;">"${result.title}"</p>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px; font-size: 14px;">
                        <div><strong>Views:</strong> ${result.pageViews}</div>
                        <div><strong>Submissions:</strong> ${result.formSubmissions}</div>
                        <div><strong>Rate:</strong> ${(result.conversionRate * 100).toFixed(2)}%</div>
                    </div>
                </div>
            `;
        });
        
        resultsHTML += '</div>';
        testResultsDiv.innerHTML = resultsHTML;
    }

    exportData() {
        if (!window.abTesting) return;
        
        const data = {
            analytics: window.abTesting.analytics,
            results: window.abTesting.getResults(),
            currentVariation: window.abTesting.currentVariation,
            winner: window.abTesting.getWinner(),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `ab-test-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    showVariationSelector() {
        const variations = window.abTesting.variations;
        const currentVariation = window.abTesting.currentVariation;
        
        let selectorHTML = '<div style="margin-bottom: 16px;"><h4>Select Variation:</h4>';
        variations.forEach(variation => {
            const isCurrent = variation.id === currentVariation;
            selectorHTML += `
                <label style="display: block; margin-bottom: 8px; cursor: pointer;">
                    <input type="radio" name="variation" value="${variation.id}" ${isCurrent ? 'checked' : ''} style="margin-right: 8px;">
                    <strong>${variation.id}</strong> ${isCurrent ? '(Current)' : ''}<br>
                    <span style="color: #666; font-size: 14px;">"${variation.title}"</span>
                </label>
            `;
        });
        selectorHTML += '</div>';
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10002;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 24px; border-radius: 12px; max-width: 500px; width: 100%;">
                <h3 style="margin-top: 0;">Set Test Variation</h3>
                ${selectorHTML}
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button id="cancel-variation" style="
                        background: #666;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 6px;
                        cursor: pointer;
                    ">Cancel</button>
                    <button id="apply-variation" style="
                        background: #d6ff48;
                        color: #0f0f0f;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 600;
                    ">Apply</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('cancel-variation').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        document.getElementById('apply-variation').addEventListener('click', () => {
            const selectedVariation = document.querySelector('input[name="variation"]:checked');
            if (selectedVariation) {
                window.abTesting.setVariation(selectedVariation.value);
                this.updateDashboard();
                document.body.removeChild(modal);
            }
        });
    }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.abAnalyticsDashboard = new ABAnalyticsDashboard();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ABAnalyticsDashboard;
}
