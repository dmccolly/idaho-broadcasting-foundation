# Idaho Broadcasting Foundation Style Guide

This document outlines the recommended approach for implementing the design system in this repository. It is based on the design notes provided by the foundation.

## 1. CSS Variables

Color variables are defined in `src/styles/variables.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

:root {
  /* Background Colors */
  --bg-primary: #1a1a1a;
  --bg-secondary: #2a2a2a;
  --bg-card: #f5f5f5;
  --bg-card-hover: #ffffff;

  /* Text Colors */
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
  --text-dark: #333333;
  --text-muted: #666666;

  /* Accent Colors */
  --accent-primary: #c4956c;
  --accent-hover: #b5854f;
  --accent-gold: #d4a574;

  /* Border Colors */
  --border-light: #444444;
  --border-subtle: #e0e0e0;
}
```

These variables are imported in `src/index.css` so that Tailwind classes can reference them via the custom theme configuration.

## 2. Tailwind Configuration

`tailwind.config.js` extends the default theme using the above variables and sets the primary `Inter` font family:

```js
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          card: 'var(--bg-card)',
          cardHover: 'var(--bg-card-hover)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          dark: 'var(--text-dark)',
          muted: 'var(--text-muted)',
        },
        accent: {
          primary: 'var(--accent-primary)',
          hover: 'var(--accent-hover)',
          gold: 'var(--accent-gold)',
        },
        border: {
          light: 'var(--border-light)',
          subtle: 'var(--border-subtle)',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

## 3. Global Styles

`src/index.css` now imports `variables.css` and applies the base font and background colors:

```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
@import './styles/variables.css';

body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}
```

## 4. Component Suggestions

- **Layout and Containers**: create reusable `Container`, `HeroSection`, and `ContentGrid` components in `src/components` following the layout examples from the design notes.
- **Typography**: build a `Typography.jsx` module exporting `Heading` and text components that apply the font classes.
- **UI Elements**: implement `Button.jsx` and `Card.jsx` components styled with the new Tailwind classes and CSS variables.
- **Navigation**: use a fixed navigation bar with backdrop blur and accent colors.

Refer to the design guide for specific class names and hover effects. The checklist at the end of the guide can be followed to gradually build out the full interface.
