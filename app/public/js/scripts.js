	  const profileIcon = document.getElementById("profileIcon");
  const profilePopup = document.getElementById("profilePopup");

  profileIcon.addEventListener("click", () => {
    profilePopup.style.display =
      profilePopup.style.display === "block" ? "none" : "block";
  });

  // Optional: hide on outside click
  window.addEventListener("click", (e) => {
    if (!profileIcon.contains(e.target) && !profilePopup.contains(e.target)) {
      profilePopup.style.display = "none";
    }
  });