import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("1.8.0", (api) => {
  function checkDarkMode() {
    const rootStyle = getComputedStyle(document.documentElement);
    const schemeType = rootStyle.getPropertyValue("--scheme-type").trim();
    const colorScheme = rootStyle.getPropertyValue("--color-scheme").trim();

    if (schemeType === "dark" || colorScheme === "dark") {
      document.documentElement.classList.add("discourse-dark-theme");
      document.body.classList.add("discourse-dark-theme");
    } else {
      document.documentElement.classList.remove("discourse-dark-theme");
      document.body.classList.remove("discourse-dark-theme");
    }
  }

  // Check on initialization
  checkDarkMode();

  // Poll at regular intervals to detect theme changes
  setInterval(checkDarkMode, 50);

  // Check on page changes
  api.onPageChange(() => {
    checkDarkMode();
  });

  // Add MutationObserver for immediate detection of style changes
  if (window.MutationObserver) {
    const observer = new MutationObserver((mutations) => {
      let shouldCheck = false;
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style"
        ) {
          shouldCheck = true;
        }
      });
      if (shouldCheck) {
        checkDarkMode();
      }
    });

    // Only observe the root element for style changes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });
  }
});
