# Technical Documentation

This document explains the technical implementation of my **Assignment 3 Interactive Portfolio Website**, what I accomplished, and areas for improvement.

---

## 1. Code Overview

### **HTML (index.html)**

- **Header & Navigation**
  - Contains a `<header>` with a `<nav>` element including the site logo and navigation links.
  - Uses anchor links (`href="#section"`) for smooth internal navigation.

- **Introduction Section**
  - Displays a welcome message with my name.
  - Connected to JavaScript to show a personalized, time-based greeting using a toast notification.

- **About Section**
  - Includes a short biography and a list of taglines.
  - Uses semantic HTML (`<section>`, `<h2>`, `<ul>`, `<p>`).

- **Projects Section**
  - Shows projects as responsive cards in a masonry layout.
  - Each card contains:
    1. `.card-media` → project image  
    2. `.card-body` → title and description  
    3. `.card-actions` → a button to toggle extra project details  
  - Includes:
    - **Filter buttons**
    - **Live search**
    - **Sorting by date or A–Z**

- **Favorite Books Section**
  - Fetches programming books from the **Google Books API**.
  - Displays book cover, title, and author.
  - Handles missing thumbnails and shows an error message if fetch fails.

- **Contact Section**
  - Contains a form with fields for Name, Email, and Message.
  - Uses native form validation with custom messages and displays a success confirmation.

- **Footer**
  - Has a "Back to Top" button.
  - Displays current year, updated dynamically via JavaScript.

---

### **CSS (css/styles.css)**

- **Theme System**
  - Uses CSS variables (`:root`) for light and dark themes.
  - Styles switch based on `data-theme` attribute set by JavaScript.

- **Layout**
  - `.section` provides spacing and max width.
  - `.nav` uses Flexbox to align logo and links.
  - `.projects-grid` uses `column-count` to create a masonry layout.
  - `.card` has hover effects, shadows, and transitions.

- **Interactive Elements**
  - `.filter` styles buttons and search input.
  - `.btn.active` highlights selected filter.

- **Form Styling**
  - `.grid-2` makes a two-column layout on larger screens.
  - Inputs have consistent spacing, borders, and focus outlines.
  - `.error` and `.success` classes show validation feedback.

- **Books Grid**
  - `.books-grid` arranges fetched books responsively.
  - `.book-card` includes hover animations and consistent image sizing.

- **Toast Notification**
  - `.toast` provides a small floating notification for the greeting.
  - `.toast.show` handles fade-in and fade-out animation.

---

### **JavaScript (js/script.js)**

- **Greeting System**
  - Uses the current time to generate “Good Morning”, “Good Afternoon”, or “Good Evening”.
  - Saves the visitor’s name in `localStorage`.
  - Shows the greeting in a **custom toast popup**.

- **Filter, Search, and Sort**
  - Filters projects by category.
  - Live search checks project text content.
  - Sorts by:
    - **A–Z** 
    - **Newest First** 
  - Re-renders cards dynamically.

- **Card Details Toggle**
  - Expands or collapses extra project information.
  - Ensures only one project is open at a time.

- **Theme Switcher**
  - Light/Dark buttons update `data-theme`.
  - Saves user preference in `localStorage`.

- **Google Books API**
  - Fetches up to 5 programming books.
  - Skips books without images.
  - Handles API errors with a visible message.

- **Timer**
  - Tracks how long the user has been on the page (mm:ss format).
  - Updates every second using `setInterval()`.

- **Contact Form Validation**
  - Uses HTML5 validation plus custom messages.
  - Shows success text and resets the form after submission.

---

## 2. Current Strengths

- Clean and semantic HTML structure.  
- Fully responsive layout on all screen sizes.  
- Sorting, filtering, and searching work smoothly together.  
- Personalized user experience (toast greeting + saved theme).  
- Dynamic content loaded from an external API.  
- Clear and user-friendly form validation.  

---

## 3. Future Improvements

- **Projects**
  - Add links to GitHub repositories or live demos.
  - Include project tags to improve filtering.

- **Contact Form**
  - Connect to a backend such as EmailJS, Formspree, or a custom server.
  - Add loading indicators and success animations.

- **Navigation**
  - Add a mobile hamburger menu.
  - Highlight the active section while scrolling.


- **Accessibility**
  - Improve ARIA attributes.
  - Add keyboard navigation enhancements.

---

## 4. Known Issues

- Sorting requires all projects to have valid `data-date` and `data-title` attributes.  
- Contact form does not send real messages (no backend).  
- More accessibility testing is required for keyboard-only users.  

---

