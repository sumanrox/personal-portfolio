# Developer Guide: Personal Portfolio

## Getting Started

### Prerequisites
- A local web server (e.g., Live Server in VS Code, `python -m http.server`, or `npm run dev` if configured).
- Basic understanding of HTML, CSS (Tailwind), and JavaScript.

### Running the Project
Since this project uses ES modules and `fetch` to load components, **you must run it via a local server**. Opening `index.html` directly in the browser (file protocol) will fail due to CORS restrictions.

## Workflows

### 1. Adding a New Component
1.  **Create HTML**: Create a new file in `components/` (e.g., `my-component.html`).
2.  **Add Placeholder**: Add a `div` with a unique ID in `index.html` where you want the component to appear (e.g., `<div id="my-component-placeholder"></div>`).
3.  **Register Component**: Update `load-components.js` to include your new component in the `components` array:
    ```javascript
    { placeholder: '#my-component-placeholder', path: 'components/my-component.html' }
    ```
4.  **Add Styles**:
    - Create `assets/css/components/my-component.css`.
    - Import it in `assets/css/main-modular.css`.
5.  **Add Logic (Optional)**:
    - Create `assets/js/components/myComponent.js`.
    - Import and initialize it in `assets/js/app.js`.

### 2. Updating Content
- **Static Content**: Edit the HTML files in `components/`.
- **Dynamic Content**: Edit the JSON files in `config/`.
    - `portfolio.json`: General content.
    - `hero-config.json`: Hero section styling and video.
    - `services-config.json`: Services section content.
    - `loader-config.json`: Loader settings.
    - *Note*: Ensure `config.js` is set up to read the new fields if you add custom ones.
    - **Important**: The project is currently in a hybrid state. Some components (like `projects.html`) contain hardcoded HTML that overrides or ignores the dynamic logic in their corresponding JS files (e.g., `projects.js` expects `#projects-grid` which may be missing). Always check the HTML file first.

### 3. Styling
- **Tailwind**: Use utility classes directly in the HTML.
- **Custom CSS**: Use `assets/css/components/*.css` for complex styles or animations that Tailwind can't handle easily.
- **Global Theme**: Update `assets/css/theme.css` to change global colors, fonts, or variables.

## Key Concepts & Pitfalls

### Component Loading & Script Execution
- Components are loaded asynchronously.
- Scripts inside component HTML files *are* executed, but `load-components.js` handles this manually by recreating the script tags.
- **Wait for Load**: If your JS needs to manipulate the DOM of a component, you must wait until the component is loaded. `window.initializeApp` in `index.html` and `app.js` is the central place for this.

### Animations (GSAP)
- GSAP ScrollTrigger is used for scroll animations.
- **Refresh**: `ScrollTrigger.refresh()` is called in `app.js` after all components are loaded to ensure start/end positions are calculated correctly.
- If you add dynamic content that changes the page height, call `ScrollTrigger.refresh()` again.

### Icons
- Lucide Icons are used.
- They are initialized automatically after components load.
- If you add icons dynamically later, call `lucide.createIcons()`.

## Debugging
- **Console**: Check the browser console for "✅ Loaded component" messages or errors.
- **Network Tab**: Ensure all component HTML files are returning 200 OK.
