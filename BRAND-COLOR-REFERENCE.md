# Brand Color Reference

## Current Brand Color: #d6ff48

This is a bright lime-green color that serves as the main accent color throughout the website.

## Files That Use This Color:

### HTML Files:
- `index-alt.html` - Main homepage with form
- `index-grid.html` - Grid portfolio page
- `Documentation/index.html` - Documentation page

### JavaScript Files:
- `js/ab-analytics-dashboard.js` - A/B testing dashboard
- `google-apps-script.js` - Google Sheets integration

### CSS Files:
- `grid/css/style.css` - Grid page styles

## How to Change the Brand Color:

### Method 1: Global Find & Replace (Recommended)
1. Open your code editor
2. Use "Find and Replace All" (Ctrl+Shift+H or Cmd+Shift+H)
3. Find: `#d6ff48`
4. Replace with: `#YOUR_NEW_COLOR`
5. Replace all occurrences

### Method 2: Individual File Updates
Update each file individually by searching for `#d6ff48` and replacing with your new color.

## Key Locations with Comments:

### Main Brand Color Definition:
```css
.panel--green { background: #d6ff48; /* BRAND COLOR - Main neon accent color (change this to update brand color) */ }
```

### Form Section:
```css
.get-started { background: #d6ff48; /* BRAND COLOR - Form section background */ }
```

### Google Sheets Integration:
```javascript
headerRange.setBackground('#d6ff48'); // BRAND COLOR - Google Sheets header background
```

## Color Usage:

- **Backgrounds**: Main hero panel, form sections, buttons
- **Text**: Links, hover states, accent text
- **Borders**: Button borders, form elements
- **Accents**: Badges, icons, highlights

## Testing Your New Color:

1. Update the color using Method 1 above
2. Refresh your website
3. Check all pages to ensure the color looks good
4. Test form submissions to ensure everything still works
5. Check Google Sheets integration (if using)

## Color Suggestions:

- **Bright Green**: `#00FF88`
- **Electric Blue**: `#0088FF`
- **Hot Pink**: `#FF0088`
- **Orange**: `#FF8800`
- **Purple**: `#8800FF`

## Notes:

- The color is used in 54+ locations across all files
- All instances are consistently updated when using global find & replace
- The color works well with the dark background (#0f0f0f) and white text
- Consider accessibility when choosing new colors (contrast ratios)
