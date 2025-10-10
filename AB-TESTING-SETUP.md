# A/B Testing Setup Guide

## Overview
This A/B testing system allows you to test different title variations for "Your automation assistant for less than a junior." and automatically submit the winning title with form submissions.

## Features
- **8 Title Variations**: Tests different messaging approaches
- **Automatic Assignment**: Users are randomly assigned to variations
- **Performance Tracking**: Tracks page views and form submissions
- **Analytics Dashboard**: View results and export data
- **Form Integration**: Automatically includes winning title in form submissions
- **Persistent Testing**: Users see the same variation across sessions

## Title Variations Being Tested

1. **Original**: "Your automation assistant for less than a junior."
2. **Cost-effective**: "AI automation that costs less than hiring a junior."
3. **Affordable**: "Affordable AI automation for your business."
4. **Budget-friendly**: "Budget-friendly automation that actually works."
5. **Smart-investment**: "Smart automation investment for growing businesses."
6. **Value-focused**: "Maximum automation value, minimum cost."
7. **Efficient**: "Efficient automation without the junior price tag."
8. **Practical**: "Practical automation solutions for real businesses."

## How It Works

### 1. User Experience
- When a user visits your site, they're randomly assigned to one of the 8 title variations
- The title is displayed consistently across their session
- When they submit a form, the A/B test data is included

### 2. Data Collection
- **Page Views**: Tracked when users visit pages with the title
- **Form Submissions**: Tracked when users submit forms
- **Conversion Rate**: Calculated as submissions ÷ views
- **Winner Determination**: Variation with highest conversion rate (minimum 10 views)

### 3. Analytics Dashboard
- Accessible via the "📊 AB Test Results" button (visible in development)
- Shows current variation, performance metrics, and winner
- Allows data export and manual variation setting

## Setup Instructions

### 1. Files Added
- `js/ab-testing.js` - Core A/B testing system
- `js/form-ab-integration.js` - Form integration
- `js/ab-analytics-dashboard.js` - Analytics dashboard

### 2. HTML Files Updated
- `index-alt.html` - Main homepage
- `index-grid.html` - Grid portfolio page  
- `Documentation/index.html` - Documentation page

### 3. PHP Integration
- `vendor/contact-mailer.php` - Updated to handle A/B test data

## Usage

### Viewing Results
1. Open your site in development mode (localhost, dev, or test URL)
2. Look for the "📊 AB Test Results" button in the top-right corner
3. Click to view the analytics dashboard

### Manual Testing
1. Open the analytics dashboard
2. Click "Set Variation" to manually test specific titles
3. Use "Reset Test" to clear all data and start fresh

### Data Export
1. Open the analytics dashboard
2. Click "Export Data" to download JSON file with all test data
3. Use this data for further analysis

## Customization

### Adding New Title Variations
Edit `js/ab-testing.js` and add new variations to the `variations` array:

```javascript
{
    id: 'new-variation',
    title: 'Your new title here.',
    weight: 1
}
```

### Changing Test Parameters
- **Weights**: Adjust the `weight` property to control distribution
- **Minimum Views**: Change the minimum views required for winner determination
- **Test Name**: Modify the `testName` property

### Analytics Integration
The system automatically integrates with:
- Google Analytics 4 (gtag)
- Google Analytics Universal (ga)
- Facebook Pixel (fbq)

## Technical Details

### Storage
- Uses localStorage for persistence
- Data survives browser sessions
- No server-side storage required

### Performance
- Lightweight JavaScript implementation
- No external dependencies
- Minimal impact on page load time

### Privacy
- No personal data collected
- Only tracks anonymous usage patterns
- GDPR compliant

## Troubleshooting

### Dashboard Not Showing
- Ensure you're on localhost, dev, or test URL
- Or set `localStorage.setItem('show_ab_dashboard', 'true')`

### Forms Not Working
- Check browser console for JavaScript errors
- Ensure all script files are loaded correctly
- Verify form IDs match the integration code

### Data Not Persisting
- Check if localStorage is enabled
- Clear browser cache and try again
- Check for JavaScript errors in console

## Support

For issues or questions:
1. Check browser console for errors
2. Verify all files are properly included
3. Test with a fresh browser session
4. Export data before making changes

## Next Steps

1. **Monitor Performance**: Check the dashboard regularly to see which titles perform best
2. **Analyze Results**: Look for patterns in conversion rates
3. **Iterate**: Add new variations based on insights
4. **Scale**: Consider implementing server-side A/B testing for larger scale

The system is designed to be simple, effective, and easy to maintain while providing valuable insights into which messaging resonates best with your audience.
