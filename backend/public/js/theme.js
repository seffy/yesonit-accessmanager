(function() {
  const toggle = document.getElementById("darkModeToggle");
  const STORAGE_KEY = "site-theme";

  // Apply the saved theme (or default to light)
  const saved = localStorage.getItem(STORAGE_KEY) || "light";
  document.documentElement.setAttribute("data-theme", saved);
  toggle.checked = saved === "dark";

  // Listen for user toggling
  toggle.addEventListener("change", () => {
    const theme = toggle.checked ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  });
})();