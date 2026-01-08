# Reusable Components

This directory contains reusable HTML components that can be included in multiple pages across the website.

## Available Components

### 1. Testimonials Section (`testimonials.html`)
A complete testimonials section featuring customer reviews with:
- Swiper slider for testimonial cards
- Star ratings
- Customer photos and names
- Navigation arrows and pagination
- Responsive design (1 slide on mobile, 2 on tablet, 3 on desktop)

### 2. Blog Section (`blog-section.html`)
A blog posts section displaying:
- Section heading with subtitle
- 3 featured blog posts in a grid
- Blog post images, categories, dates, and comments
- "View all" button linking to the blog page
- Responsive grid layout

## How to Use Components

### Method 1: Using the Component Loader (Recommended)

1. **Include the component loader script** in your HTML page (before the closing `</body>` tag):
```html
<script src="components/component-loader.js"></script>
```

2. **Add a placeholder div** where you want the component to appear:
```html
<!-- For testimonials -->
<div data-component="testimonials"></div>

<!-- For blog section -->
<div data-component="blog-section"></div>
```

3. **Complete example**:
```html
<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
    <!-- Your CSS files -->
</head>
<body>
    <!-- Your content -->
    
    <!-- Load testimonials component -->
    <div data-component="testimonials"></div>
    
    <!-- Load blog section component -->
    <div data-component="blog-section"></div>
    
    <!-- Your existing scripts -->
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/js/swiper.min.js"></script>
    <script src="assets/js/wow.min.js"></script>
    <!-- ... other scripts ... -->
    
    <!-- Component loader (add this last) -->
    <script src="components/component-loader.js"></script>
</body>
</html>
```

### Method 2: Server-Side Include (PHP, Node.js, etc.)

If you're using a server-side language, you can include the components directly:

**PHP Example:**
```php
<?php include 'components/testimonials.html'; ?>
<?php include 'components/blog-section.html'; ?>
```

**Node.js/Express Example:**
```javascript
// Using EJS template engine
<%- include('components/testimonials.html') %>
<%- include('components/blog-section.html') %>
```

### Method 3: Manual Copy-Paste

Simply copy the HTML content from the component files and paste it into your page where needed.

## Dependencies

These components require the following libraries (already included in the main site):

- **jQuery** - For DOM manipulation
- **Swiper.js** - For the testimonial slider
- **WOW.js** - For scroll animations
- **Bootstrap** - For responsive grid system
- **Custom CSS** - Main stylesheet (`assets/css/main.css`)

## Customization

### Modifying Testimonials

To add, remove, or edit testimonials, edit `testimonials.html`:

```html
<div class="swiper-slide right-swipe">
    <div class="testimonial-item">
        <div class="testimonial-content">
            <div class="testimonial-quote">
                <i class="tji-right-quote"></i>
            </div>
            <div class="desc">
                <p>Your testimonial text here...</p>
            </div>
        </div>
        <div class="tj-testimonial-author">
            <div class="author-images">
                <img src="path/to/image.jpg" alt="Customer Name">
            </div>
            <div class="author-content">
                <div class="author-rating">
                    <div class="star-ratings">
                        <div class="fill-ratings" style="width: 100%">
                            <span>★★★★★</span>
                        </div>
                        <div class="empty-ratings">
                            <span>★★★★★</span>
                        </div>
                    </div>
                </div>
                <div class="author-text">
                    <h4 class="author-name">Customer Name</h4>
                    <span class="sub-title">Customer Title</span>
                </div>
            </div>
        </div>
    </div>
</div>
```

### Modifying Blog Posts

To change blog posts, edit `blog-section.html`:

```html
<div class="col-xl-4 col-md-6">
    <div class="blog-style-3 style-5 wow fadeInUp" data-wow-delay="0.2s">
        <div class="blog-images">
            <a href="blog-details.html"><img src="path/to/image.jpg" alt="Blog Title"></a>
            <div class="blog_category">
                <ul>
                    <li><a href="blog-grid.html">Category Name</a></li>
                </ul>
            </div>
        </div>
        <div class="blog-content">
            <div class="blog-three-meta">
                <ul>
                    <li>Date</li>
                    <li>Comments Count</li>
                </ul>
            </div>
            <h4 class="title under-line">
                <a href="blog-details.html">Your Blog Title</a>
            </h4>
            <div class="blog-button">
                <a class="blog-btn blog-btn-2" href="blog-details.html">
                    <span class="btn-icon"><i class="tji-arrow-right"></i></span>
                    <span class="btn-text">Read more</span>
                </a>
            </div>
        </div>
    </div>
</div>
```

## Notes

- The component loader uses the Fetch API, which requires the page to be served via HTTP/HTTPS (not `file://`)
- For local development, use a local server (e.g., Live Server extension in VS Code)
- All animations and sliders will be automatically initialized when components are loaded
- Components maintain the same styling and functionality as the original sections

## Troubleshooting

**Components not loading:**
- Check browser console for errors
- Ensure you're running the site on a web server (not opening HTML files directly)
- Verify the component paths are correct relative to your HTML file

**Slider not working:**
- Ensure Swiper.js is loaded before the component loader
- Check that the Swiper initialization code in `component-loader.js` matches your Swiper version

**Animations not triggering:**
- Ensure WOW.js is loaded
- The component loader automatically re-initializes WOW.js after loading components
