# IMPTEL Website - Project Handoff Document

## 🚀 Quick Start - Running the Site Locally

To view the site with all features working properly (including SVG animations), you need to run a local web server:

### Using Python (Recommended):
```bash
# Navigate to project directory
cd /mnt/d/Projects/imptel

# Python 3
python -m http.server 8000

# OR Python 2
python -m SimpleHTTPServer 8000
```

Then open `http://localhost:8000` in your browser.

### Alternative Methods:
- **Node.js**: `npx http-server -p 8000`
- **VS Code**: Install and use the "Live Server" extension
- **PHP**: `php -S localhost:8000`

**Why is this needed?** Modern browsers block loading local files (like SVGs) due to CORS security policies. A local server serves files with proper HTTP headers.

---

## 📋 Project Overview

**IMPTEL** (Instituto Médio Privado de Tecnologia) is a technical education institute website featuring:

- **3 Main Sections**: Computer Science (Informática), Electronics & Telecommunications (Eletrônica), and General Information (Visitante)
- **Bilingual Support**: Portuguese (PT) and English (EN) with dynamic language switching
- **Modern Design**: Theme-based styling with unique visual effects for each section
- **Responsive Layout**: Mobile-first design with custom breakpoint at 916px

### Site Structure:
```
index.html          - Landing page with course selection
informatica.html    - Computer Science course page
eletronica.html     - Electronics & Telecommunications page  
visitante.html      - General information, about, facilities
```

---

## 🎨 Key Features Implemented

### 1. **Dynamic Language System**
- Real-time language switching without page reload
- Translations stored in `assets/js/translations.js`
- Handles both text content and HTML content (for line breaks)
- Language preference saved in localStorage

### 2. **Theme System**
- Each section has unique color scheme and animations:
  - **Informática**: Green theme with Matrix rain effect
  - **Eletrônica**: Blue theme with animated circuit paths
  - **Visitante**: Purple gradient theme with floating particles

### 3. **Interactive Elements**
- **Back to Top Button**: Circular button appears after scrolling past hero section
- **Animated Cards**: Hover effects and entrance animations
- **Number Counters**: Animated statistics (years, students, employment rate)
- **Mobile Navigation**: Custom hamburger menu with smooth animations

### 4. **Responsive Design Features**
- Custom breakpoint at 916px for tablet/mobile
- Stacking layouts for cards and grids on mobile
- Responsive typography scaling
- Touch-friendly interface elements

### 5. **Performance Optimizations**
- Lazy loading for images
- Debounced scroll events
- RequestAnimationFrame for smooth animations
- Intersection Observer for scroll-triggered animations

### 6. **Accessibility Features**
- Skip to main content links
- ARIA labels on interactive elements
- Keyboard navigation support
- Animation intensity controls
- Respects prefers-reduced-motion

---

## 📁 Project Structure

```
imptel/
├── index.html                 # Landing page
├── informatica.html          # Computer Science page
├── eletronica.html           # Electronics page
├── visitante.html            # Visitor/General info page
├── assets/
│   ├── css/
│   │   ├── reset.css        # CSS reset/normalize
│   │   ├── styles.css       # Main styles
│   │   ├── themes.css       # Theme-specific styles
│   │   ├── animations.css   # Animation definitions
│   │   └── responsive.css   # Responsive breakpoints
│   ├── js/
│   │   ├── main.js          # Core functionality
│   │   ├── utils.js         # Utility functions
│   │   ├── translations.js  # Language translations
│   │   ├── language-switcher.js    # Language toggle logic
│   │   ├── matrix-rain.js          # Matrix effect (CS page)
│   │   ├── circuit-path-electrons-enhanced.js  # Circuit animation
│   │   ├── visitor-hero-particles.js    # Particle effects
│   │   └── form-handler.js         # Form submissions
│   └── images/
│       ├── imptellogo.jpg   # Institute logo
│       └── circuit-lines.svg # Circuit SVG for electronics
```

---

## 🔧 Recent Updates & Fixes

### Latest Session Changes:
1. **Hamburger Menu Breakpoint**: Changed from 768px to 916px across all files
2. **Responsive Improvements**:
   - Hero content sizing for screens < 415px
   - Innovation Lab cards stack on mobile
   - Laboratories section responsive layout
   - Newsletter form stacks vertically on mobile
3. **Button Fixes**: Fixed btn-theme pseudo-element overflow issue
4. **Card Alignment**: Aligned card buttons horizontally using flexbox
5. **Clickable Cards**: Made entire selector cards clickable, not just buttons
6. **Back to Top Button**: Added circular semi-transparent button with up arrow
7. **Navigation Updates**:
   - Home links → index.html
   - About/Facilities/Programs/Admissions → visitante.html sections

### Previous Updates:
- Fixed translation system to handle HTML content (for <br> tags)
- Added dynamic SVG placeholder generation for missing images
- Implemented animation intensity controls
- Fixed mobile menu behavior and body scroll locking
- Added proper language switcher functionality

---

## 🗺️ Google Maps Setup Instructions

The visitor page (visitante.html) includes a Google Maps integration to show IMPTEL's location. Currently, it's using a placeholder API key that needs to be replaced.

### How to Fix Google Maps Errors:

1. **Get a Google Maps API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project (or select an existing one)
   - Navigate to "APIs & Services" → "Library"
   - Search for and enable "Maps JavaScript API"
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy your new API key

2. **Replace the Placeholder**:
   - Open `visitante.html`
   - Find line ~1090 (near the bottom):
   ```html
   <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap&loading=async&libraries=marker"></script>
   ```
   - Replace `YOUR_API_KEY` with your actual API key

3. **Fix the Style/MapId Conflict**:
   - In the `initMap` function (around line 1041), remove this line:
   ```javascript
   mapId: 'IMPTEL_MAP_ID', // Remove this line
   ```
   - The map uses custom styles which conflict with mapId

4. **Secure Your API Key** (Important!):
   - In Google Cloud Console, go to your API key settings
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domain (e.g., `https://imptel.ao/*`)
   - Under "API restrictions", select "Restrict key" and choose only "Maps JavaScript API"

### Alternative: Remove Google Maps
If you don't want to use Google Maps:
- Comment out the Google Maps script tag
- Consider using free alternatives like Leaflet.js with OpenStreetMap

---

## ⚠️ Known Issues & Improvements Needed

### High Priority:
1. **Navigation Architecture**: All nav links lead to visitante.html - consider dedicated pages
2. **Performance**: Multiple CSS files cause render blocking - needs bundling
3. **SEO**: Missing meta tags, structured data, sitemap
4. **Forms**: No client-side validation or error handling
5. **Accessibility**: Some color contrasts may fail WCAG standards

### Medium Priority:
1. **Dark Mode**: No dark theme support
2. **Loading States**: No skeleton loaders or proper loading indicators
3. **Error Handling**: No offline fallbacks or error states
4. **Image Optimization**: No WebP format or proper lazy loading
5. **Print Styles**: No optimized print stylesheets

### Nice to Have:
1. **PWA Features**: Add service worker for offline support
2. **Search Functionality**: No way to search courses or content
3. **Interactive Elements**: Virtual tour, course calculator, chatbot
4. **Social Proof**: Integration with reviews, testimonials
5. **Analytics**: No tracking implementation

---

## 🚀 Recommended Next Steps

### Immediate Actions:
1. **Bundle Assets**: Combine and minify CSS/JS files
2. **Add Meta Tags**: Implement Open Graph and Twitter Cards
3. **Form Validation**: Add client-side validation with error messages
4. **Fix Navigation**: Create proper page structure instead of single-page sections
5. **Optimize Images**: Convert to WebP, implement proper lazy loading

### Architecture Improvements:
1. **Component System**: Consider migrating to React/Vue/Web Components
2. **Build Process**: Set up Webpack/Vite for asset optimization
3. **CSS Architecture**: Implement CSS-in-JS or CSS Modules
4. **State Management**: Add proper state management for complex interactions
5. **API Integration**: Prepare for backend integration

### Testing & Deployment:
1. **Cross-browser Testing**: Test on all major browsers
2. **Performance Audit**: Run Lighthouse tests
3. **Accessibility Audit**: Use axe DevTools
4. **Set up CI/CD**: Automate testing and deployment
5. **Monitor Analytics**: Implement privacy-respecting analytics

---

## 📝 Development Guidelines

### CSS Conventions:
- Use CSS custom properties for theming
- Follow BEM naming convention
- Avoid inline styles (currently needs major refactoring)
- Mobile-first approach for media queries

### JavaScript Guidelines:
- Use ES6+ features
- Implement proper error handling
- Add JSDoc comments for functions
- Keep animations performant (60fps)

### Git Workflow:
- Use feature branches
- Write descriptive commit messages
- Test before pushing
- Document breaking changes

---

## 📞 Contact & Resources

### Useful Resources:
- [MDN Web Docs](https://developer.mozilla.org/)
- [Can I Use](https://caniuse.com/) - Browser compatibility
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Google Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Color Palette:
- **Informática (Green)**: #00FF41, #008F11, #32CD32
- **Eletrônica (Blue)**: #1E3A8A, #1E40AF, #3B82F6
- **Visitante (Purple)**: #6366F1, #64748B, #8B5CF6

---

## 🎯 Final Notes

This project is a solid foundation for a modern educational institution website. The bilingual support, theme system, and responsive design are well-implemented. However, there's significant technical debt with inline styles and architectural decisions that should be addressed for long-term maintainability.

The immediate priority should be improving performance (asset bundling, lazy loading) and fixing the navigation architecture. After that, focus on adding modern features like PWA support, proper SEO, and interactive elements that enhance the user experience.

Good luck with the project! 🚀