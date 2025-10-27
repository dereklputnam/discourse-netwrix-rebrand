import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("1.8.0", (api) => {
  // Aggressively remove custom lists dropdown from navigation to prevent gaps
  const removeCustomListsDropdown = function() {
    // Remove all custom list items from navigation
    const customListItems = document.querySelectorAll('.category-breadcrumb li.custom-list-item, li.custom-list-item');
    customListItems.forEach(function(item) {
      item.parentNode.removeChild(item);
    });
  };

  // Run on every page change
  api.onPageChange(function() {
    // Remove immediately
    removeCustomListsDropdown();

    // Remove after short delays to catch late renders
    setTimeout(removeCustomListsDropdown, 50);
    setTimeout(removeCustomListsDropdown, 100);
    setTimeout(removeCustomListsDropdown, 250);
    setTimeout(removeCustomListsDropdown, 500);
    setTimeout(removeCustomListsDropdown, 1000);
  });

  // Use MutationObserver to remove as soon as element is added to DOM
  document.addEventListener('DOMContentLoaded', function() {
    const observer = new MutationObserver(function(mutations) {
      let needsRemoval = false;
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) {
            if (node.classList && node.classList.contains('custom-list-item')) {
              needsRemoval = true;
            }
            if (node.querySelectorAll) {
              const found = node.querySelectorAll('li.custom-list-item');
              if (found.length > 0) {
                needsRemoval = true;
              }
            }
          }
        });
      });

      if (needsRemoval) {
        removeCustomListsDropdown();
      }
    });

    // Observe the entire document body for new custom list items
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
});
