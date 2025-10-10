/**
 * A/B Testing System for Title Variations
 * Tests multiple title variations and tracks performance
 */

class ABTestingSystem {
    constructor() {
        this.testName = 'title-variations';
        this.variations = [
            {
                id: 'original',
                title: 'Your automation assistant for less than a junior.',
                weight: 1
            },
            {
                id: 'cost-effective',
                title: 'AI automation that costs less than hiring a junior.',
                weight: 1
            },
            {
                id: 'affordable',
                title: 'Affordable AI automation for your business.',
                weight: 1
            },
            {
                id: 'budget-friendly',
                title: 'Budget-friendly automation that actually works.',
                weight: 1
            },
            {
                id: 'smart-investment',
                title: 'Smart automation investment for growing businesses.',
                weight: 1
            },
            {
                id: 'value-focused',
                title: 'Maximum automation value, minimum cost.',
                weight: 1
            },
            {
                id: 'efficient',
                title: 'Efficient automation without the junior price tag.',
                weight: 1
            },
            {
                id: 'practical',
                title: 'Practical automation solutions for real businesses.',
                weight: 1
            }
        ];
        
        this.currentVariation = null;
        this.analytics = this.loadAnalytics();
        this.init();
    }

    init() {
        // Check if user already has a variation assigned
        const storedVariation = localStorage.getItem(`${this.testName}_variation`);
        
        if (storedVariation) {
            this.currentVariation = storedVariation;
        } else {
            // Assign new variation based on weights
            this.currentVariation = this.assignVariation();
            localStorage.setItem(`${this.testName}_variation`, this.currentVariation);
        }

        // Apply the variation
        this.applyVariation();
        
        // Track page view
        this.trackEvent('page_view');
    }

    assignVariation() {
        const totalWeight = this.variations.reduce((sum, variation) => sum + variation.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const variation of this.variations) {
            random -= variation.weight;
            if (random <= 0) {
                return variation.id;
            }
        }
        
        // Fallback to first variation
        return this.variations[0].id;
    }

    applyVariation() {
        const variation = this.variations.find(v => v.id === this.currentVariation);
        if (!variation) return;

        // Update all title elements
        const titleElements = document.querySelectorAll('.title, .hero-title, h1');
        titleElements.forEach(element => {
            if (element.textContent.includes('Your automation assistant for less than a junior')) {
                element.textContent = variation.title;
            }
        });

        // Update meta title if it contains the original title
        const metaTitle = document.querySelector('title');
        if (metaTitle && metaTitle.textContent.includes('Your automation assistant for less than a junior')) {
            metaTitle.textContent = metaTitle.textContent.replace(
                'Your automation assistant for less than a junior',
                variation.title
            );
        }

        // Add data attribute for tracking
        document.body.setAttribute('data-ab-variation', this.currentVariation);
    }

    trackEvent(eventType, additionalData = {}) {
        const event = {
            timestamp: new Date().toISOString(),
            variation: this.currentVariation,
            eventType: eventType,
            url: window.location.href,
            userAgent: navigator.userAgent,
            ...additionalData
        };

        // Store in localStorage for persistence
        if (!this.analytics.events) {
            this.analytics.events = [];
        }
        this.analytics.events.push(event);
        this.saveAnalytics();

        // Send to analytics service (if available)
        this.sendToAnalytics(event);

        console.log('AB Test Event:', event);
    }

    trackFormSubmission(formData) {
        const variation = this.variations.find(v => v.id === this.currentVariation);
        
        // Add the winning title to form data
        if (formData instanceof FormData) {
            formData.append('ab_test_variation', this.currentVariation);
            formData.append('ab_test_title', variation.title);
        } else if (typeof formData === 'object') {
            formData.ab_test_variation = this.currentVariation;
            formData.ab_test_title = variation.title;
        }

        this.trackEvent('form_submission', {
            variation: this.currentVariation,
            title: variation.title
        });

        return formData;
    }

    sendToAnalytics(event) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'ab_test_event', {
                'event_category': 'ab_testing',
                'event_label': event.variation,
                'custom_parameter_1': event.eventType,
                'custom_parameter_2': event.variation
            });
        }

        // Google Analytics Universal
        if (typeof ga !== 'undefined') {
            ga('send', 'event', 'AB Test', event.eventType, event.variation);
        }

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('trackCustom', 'ABTestEvent', {
                variation: event.variation,
                eventType: event.eventType
            });
        }
    }

    loadAnalytics() {
        try {
            const stored = localStorage.getItem(`${this.testName}_analytics`);
            return stored ? JSON.parse(stored) : { events: [], conversions: {} };
        } catch (e) {
            return { events: [], conversions: {} };
        }
    }

    saveAnalytics() {
        try {
            localStorage.setItem(`${this.testName}_analytics`, JSON.stringify(this.analytics));
        } catch (e) {
            console.warn('Could not save analytics data:', e);
        }
    }

    getResults() {
        const results = {};
        
        this.variations.forEach(variation => {
            const events = this.analytics.events.filter(e => e.variation === variation.id);
            const pageViews = events.filter(e => e.eventType === 'page_view').length;
            const formSubmissions = events.filter(e => e.eventType === 'form_submission').length;
            const conversions = formSubmissions / Math.max(pageViews, 1);
            
            results[variation.id] = {
                title: variation.title,
                pageViews: pageViews,
                formSubmissions: formSubmissions,
                conversionRate: conversions,
                events: events.length
            };
        });

        return results;
    }

    getWinner() {
        const results = this.getResults();
        let winner = null;
        let bestConversionRate = 0;

        Object.keys(results).forEach(variationId => {
            const result = results[variationId];
            if (result.conversionRate > bestConversionRate && result.pageViews >= 10) {
                bestConversionRate = result.conversionRate;
                winner = variationId;
            }
        });

        return winner;
    }

    // Method to manually set a variation (for testing)
    setVariation(variationId) {
        if (this.variations.find(v => v.id === variationId)) {
            this.currentVariation = variationId;
            localStorage.setItem(`${this.testName}_variation`, variationId);
            this.applyVariation();
            this.trackEvent('manual_variation_change', { newVariation: variationId });
        }
    }

    // Method to reset the test (for testing)
    resetTest() {
        localStorage.removeItem(`${this.testName}_variation`);
        localStorage.removeItem(`${this.testName}_analytics`);
        this.analytics = { events: [], conversions: {} };
        this.currentVariation = null;
        this.init();
    }
}

// Initialize the A/B testing system
window.abTesting = new ABTestingSystem();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ABTestingSystem;
}
