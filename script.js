// Function to toggle the theme
function toggleTheme() {
  const body = document.body;
  const themeToggleButton = document.querySelector(".theme-toggle");

  // Toggle dark theme class on body
  body.classList.toggle("dark-theme");

  // Toggle dark theme class on theme toggle button
  themeToggleButton.classList.toggle("dark-theme");
}

