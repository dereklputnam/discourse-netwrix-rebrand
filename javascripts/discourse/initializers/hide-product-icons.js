import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("1.8.0", (api) => {
  // Hide square-full icons from Products categories on homepage
  // Only hides the SVG icon element - does not touch any parent containers

  const PRODUCT_CATEGORY_IDS = [
    17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 32, 33, 34,
    181, 182, 188
  ];

  const hideProductCategoryIcons = function() {
    // Find ALL square-full icons on the homepage first
    const allIcons = document.querySelectorAll('body.categories-list svg.d-icon-square-full');

    allIcons.forEach(function(icon) {
      // Walk up the DOM tree to find the nearest element with data-category-id
      let currentElement = icon.parentElement;
      let categoryId = null;

      while (currentElement && !categoryId) {
        categoryId = currentElement.getAttribute('data-category-id');
        if (!categoryId) {
          currentElement = currentElement.parentElement;
        }
      }

      // If we found a category ID and it's a product category, hide ONLY the icon
      if (categoryId && PRODUCT_CATEGORY_IDS.includes(parseInt(categoryId))) {
        icon.style.display = 'none';
      }
    });
  };

  // Run on page change
  api.onPageChange(function() {
    if (document.body.classList.contains('categories-list')) {
      hideProductCategoryIcons();

      // Run multiple times to catch late-loading icons
      setTimeout(hideProductCategoryIcons, 100);
      setTimeout(hideProductCategoryIcons, 300);
      setTimeout(hideProductCategoryIcons, 500);
      setTimeout(hideProductCategoryIcons, 1000);
    }
  });

  // Watch for dynamically added icons
  api.onPageChange(function() {
    if (!document.body.classList.contains('categories-list')) {
      return;
    }

    const observer = new MutationObserver(function(mutations) {
      let hasNewIcons = false;
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) {
            if (node.classList && node.classList.contains('d-icon-square-full')) {
              hasNewIcons = true;
            }
            if (node.querySelectorAll) {
              const icons = node.querySelectorAll('.d-icon-square-full');
              if (icons.length > 0) {
                hasNewIcons = true;
              }
            }
          }
        });
      });

      if (hasNewIcons) {
        hideProductCategoryIcons();
      }
    });

    const mainContainer = document.querySelector('#main-outlet');
    if (mainContainer) {
      observer.observe(mainContainer, {
        childList: true,
        subtree: true
      });
    }
  });
});
