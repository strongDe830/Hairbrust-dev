(() => {

  class StickyProduct extends HTMLElement {
    constructor() {
      super();
      this.init();
      this.observeAjaxUpdates();
    }

    init() {
      this.productForm = document.querySelector("[data-product-form]");
      this.stickyBtn = this.querySelector("[data-asp-add-to-cart]");
      this.mainBtn = document.querySelector("[data-product-submit-button]");

      if (this.stickyBtn && this.mainBtn) {
        this.stickyBtn.addEventListener("click", () => {
          this.mainBtn.click();
        });
      }
    }

    // 👉 Track AJAX updates via MutationObserver
    observeAjaxUpdates() {
      const target = document.querySelector("body"); // Theme-agnostic

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {

          // Product form replaced?
          if (mutation.type === "childList") {
            if (mutation.addedNodes.length > 0) {
              
              // Check if new ATC or form inserted
              const updatedForm = document.querySelector("[data-product-form]");
              const updatedBtn = document.querySelector("[data-product-submit-button]");

              if (updatedForm || updatedBtn) {
                this.reInitAfterAjax();
              }

            }
          }

        });
      });

      observer.observe(target, {
        childList: true,
        subtree: true
      });
    }

    reInitAfterAjax() {
      // Re-select new nodes
      this.productForm = document.querySelector("[data-product-form]");
      this.mainBtn = document.querySelector("[data-product-submit-button]");

      // Rebind sticky button
      if (this.stickyBtn && this.mainBtn) {
        this.stickyBtn.onclick = () => this.mainBtn.click();
      }
    }

  }

  customElements.define("sticky-product", StickyProduct);

})();
