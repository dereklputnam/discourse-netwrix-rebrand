import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("1.8.0", (api) => {
  // Nuclear approach to resize category icons on homepage and fix a.subcategory height
  const enlargeCategoryIcons = function() {
    // Target ONLY the main category icons within the subcategory boxes (both div and a versions)
    // Exclude lock icons and subcategory list icons

    // 1. Target div-based subcategory boxes
    const divCategoryBoxes = document.querySelectorAll('body.categories-list .subcategory.with-subcategories .category-title-link .badge-category.--style-icon');

    // 2. Target a-based subcategory boxes
    const aCategoryBoxes = document.querySelectorAll('body.categories-list a.subcategory .badge-category.--style-icon');

    // Combine both into one array
    const allCategoryBoxes = [...divCategoryBoxes, ...aCategoryBoxes];

    allCategoryBoxes.forEach(function(badge) {
      // Get all SVG icons within this badge
      const icons = badge.querySelectorAll('svg.d-icon');

      icons.forEach(function(icon) {
        const useElement = icon.querySelector('use');
        if (useElement) {
          const href = useElement.getAttribute('href');
          // Resize lock icons to 1em, other icons to 2.5em
          if (href && (href.includes('lock') || href.includes('restricted'))) {
            icon.style.width = '1em';
            icon.style.height = '1em';
            icon.style.minWidth = '1em';
            icon.style.minHeight = '1em';
          } else if (href) {
            icon.style.width = '2.5em';
            icon.style.height = '2.5em';
            icon.style.minWidth = '2.5em';
            icon.style.minHeight = '2.5em';
          }
        }
      });
    });

    // Fix height for a.subcategory boxes to match div.subcategory boxes
    const aSubcategoryLinks = document.querySelectorAll('body.categories-list a.subcategory:not(.with-subcategories)');
    aSubcategoryLinks.forEach(function(link) {
      link.style.height = '168px';
      link.style.minHeight = '168px';
      link.style.maxHeight = '168px';
      link.style.overflow = 'hidden';
    });
  };

  // Run on page change
  api.onPageChange(function() {
    // Only run on categories list page
    if (document.body.classList.contains('categories-list')) {
      enlargeCategoryIcons();

      // Run multiple times to catch late-loading icons
      setTimeout(enlargeCategoryIcons, 100);
      setTimeout(enlargeCategoryIcons, 300);
      setTimeout(enlargeCategoryIcons, 500);
      setTimeout(enlargeCategoryIcons, 1000);
    }
  });

  // Also use MutationObserver to catch dynamically added icons
  api.onPageChange(function() {
    if (!document.body.classList.contains('categories-list')) {
      return;
    }

    const observer = new MutationObserver(function(mutations) {
      let hasNewIcons = false;
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) {
            if (node.classList && (node.classList.contains('d-icon') || node.classList.contains('svg-icon'))) {
              hasNewIcons = true;
            }
            if (node.querySelectorAll) {
              const icons = node.querySelectorAll('.d-icon, .svg-icon');
              if (icons.length > 0) {
                hasNewIcons = true;
              }
            }
          }
        });
      });

      if (hasNewIcons) {
        enlargeCategoryIcons();
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
