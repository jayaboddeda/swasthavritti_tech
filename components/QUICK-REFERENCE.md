# Quick Reference Guide - Reusable Components

## 📦 What's Been Created

1. **`components/testimonials.html`** - Testimonials section component
2. **`components/blog-section.html`** - Blog posts section component
3. **`components/component-loader.js`** - JavaScript loader for dynamic component inclusion
4. **`components/README.md`** - Detailed documentation
5. **`component-example.html`** - Working example page

## 🚀 Quick Start (3 Steps)

### 1. Add the component loader script to your page
```html
<!-- Add before closing </body> tag -->
<script src="components/component-loader.js"></script>
```

### 2. Add component placeholders where you want them
```html
<!-- Testimonials -->
<div data-component="testimonials"></div>

<!-- Blog Section -->
<div data-component="blog-section"></div>
```

### 3. Serve your page via HTTP
Use a local server (not file://) for the components to load properly.

## 📝 Usage Examples

### Example 1: Add All Components to a Page
```html
<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
    <!-- Your CSS files -->
</head>
<body>
    <!-- Your content -->
    
    <!-- Load components -->
    <div data-component="testimonials"></div>
    <div data-component="blog-section"></div>
    <div data-component="footer"></div>
    
    <!-- Your scripts -->
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/js/swiper.min.js"></script>
    <script src="assets/js/wow.min.js"></script>
    <script src="assets/js/main.js"></script>
    
    <!-- Component loader -->
    <script src="components/component-loader.js"></script>
</body>
</html>
```

### Example 2: Add Only Testimonials
```html
<div data-component="testimonials"></div>
```

### Example 3: Add Only Blog Section
```html
<div data-component="blog-section"></div>
```

### Example 4: Add Only Footer
```html
<div data-component="footer"></div>
```

## 🎨 Customization

### Change Testimonials
Edit `components/testimonials.html` and modify the testimonial slides.

### Change Blog Posts
Edit `components/blog-section.html` and update the blog post cards.

### Add New Components
1. Create a new HTML file in `components/` folder
2. Add it to the `components` object in `component-loader.js`:
```javascript
const components = {
    'testimonials': 'components/testimonials.html',
    'blog-section': 'components/blog-section.html',
    'your-new-component': 'components/your-new-component.html'  // Add this
};
```
3. Use it: `<div data-component="your-new-component"></div>`

## 🔧 Alternative Methods

### PHP Include
```php
<?php include 'components/testimonials.html'; ?>
```

### JavaScript Fetch (Manual)
```javascript
fetch('components/testimonials.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('testimonials-container').innerHTML = html;
    });
```

### Copy-Paste
Simply copy the HTML from the component files and paste into your page.

## ⚠️ Important Notes

- **Requires HTTP Server**: Components won't load from `file://` protocol
- **Script Order**: Load component-loader.js AFTER all other scripts
- **Dependencies**: Ensure jQuery, Swiper.js, and WOW.js are loaded
- **Styling**: Components use existing CSS from `assets/css/main.css`

## 🧪 Testing

Open `component-example.html` in your browser (via HTTP server) to see a working demo.

## 📚 Full Documentation

See `components/README.md` for complete documentation including:
- Detailed usage instructions
- Customization examples
- Troubleshooting guide
- All available options

## 🆘 Troubleshooting

**Components not showing?**
- Check browser console for errors
- Verify you're using HTTP server (not file://)
- Ensure component paths are correct

**Slider not working?**
- Confirm Swiper.js is loaded
- Check that main.js is loaded before component-loader.js

**Animations not playing?**
- Ensure WOW.js is loaded
- Component loader auto-initializes WOW.js

## 📞 Need Help?

Refer to:
1. `components/README.md` - Full documentation
2. `component-example.html` - Working example
3. Browser console - Error messages
