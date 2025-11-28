# Project Map: Personal Portfolio

## Overview
This project is a personal portfolio website built with a modular, component-based architecture using vanilla HTML, CSS (Tailwind + Custom), and JavaScript. It uses a custom component loader to assemble the page from HTML fragments.

## Directory Structure

### Root
- **`index.html`**: The main entry point. It defines the basic HTML structure, loads global assets (CSS, JS libraries), and contains placeholders for components.
- **`load-components.js`**: A script that fetches HTML component files from the `components/` directory and injects them into the placeholders in `index.html`.

### Assets (`/assets`)
- **`css/`**:
    - **`main-modular.css`**: The main stylesheet. It imports `theme.css` and component-specific CSS files.
    - **`theme.css`**: Defines CSS variables for colors, fonts, and other theme settings.
    - **`components/`**: Contains CSS files for individual components (e.g., `hero.css`, `navigation.css`).
- **`js/`**:
    - **`app.js`**: The main application logic. It initializes global features and component-specific logic after the HTML components are loaded.
    - **`config.js`**: Handles loading content from `config/portfolio.json` and populating the DOM.
    - **`components/`**: Contains JavaScript modules for individual components (e.g., `navigation.js`, `heroThree.js`).

### Components (`/components`)
Contains HTML fragments for each section of the website.
- `navigation.html`
- `hero.html`
- `about.html`
- `services.html`
- `experience.html`
- `work.html`
- `projects.html`
- `testimonials-new.html`
- `faq.html`
- `contact.html`
- `footer.html`

### Config (`/config`)
- **`portfolio.json`**: General content (profile, social links, etc.).
- **`hero-config.json`**: Configuration for the Hero section (colors, video background).
- **`services-config.json`**: Configuration for the Services section.
- **`loader-config.json`**: Configuration for the initial page loader.

## Architecture

### Component Loading
1. `index.html` loads `load-components.js`.
2. `load-components.js` iterates through a list of components, fetches their HTML content, and injects it into the corresponding `#placeholder` div.
3. It also executes any `<script>` tags found within the injected HTML.

### Styling
- **Tailwind CSS**: Used for utility classes.
- **Custom CSS**: Component-specific styles are defined in `assets/css/components/` and imported via `main-modular.css`.
- **Theming**: `theme.css` defines CSS variables for consistent styling.

### JavaScript Logic
- **Initialization**: `app.js` waits for components to be loaded (via `window.initializeApp` or event listeners) and then initializes various modules.
- **Modules**: Logic is split into small, focused modules in `assets/js/components/`.
- **Configuration**: `config.js` allows for easy content updates without changing code.

## Key Libraries
- **GSAP**: Used extensively for animations (ScrollTrigger, ScrollTo).
- **Lucide Icons**: Used for iconography.
- **Notyf**: Used for toast notifications.
