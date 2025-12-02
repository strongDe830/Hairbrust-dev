document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll(".section-text-grid");

  sections.forEach((section) => {
    const tabs = section.querySelectorAll(".block-group-kickers .block-kicker");
    const mediaItems = section.querySelectorAll(".grid-block-media");
    const gridItems = section.querySelectorAll(".block-text-grid-block");

    if (!tabs.length) return;

    function activateByIndex(items, activeIndex) {
      items.forEach((item, i) => {
        if (i === activeIndex) {
          item.classList.add("active");
          item.style.display = "block";
        } else {
          item.classList.remove("active");
          item.style.display = "none";
        }
      });
    }

    function activateTab(tabs, activeIndex) {
      tabs.forEach((tab, i) => {
        if (i === activeIndex) {
          tab.classList.add("active");
        } else {
          tab.classList.remove("active");
        }
      });
    }

    // Default active index
    activateTab(tabs, 0);
    activateByIndex(mediaItems, 0);
    activateByIndex(gridItems, 0);

    // Tab click handler
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        activateTab(tabs, index);
        activateByIndex(mediaItems, index);
        activateByIndex(gridItems, index);
      });
    });
  });
});
