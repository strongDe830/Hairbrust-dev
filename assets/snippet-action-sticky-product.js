function initStickyProductComponent() {
    class StickyProduct extends HTMLElement {
        constructor() {
            super();
            this.initAnchorBtn();
            this.initStickyActions();
        }

        // optional future event listeners
        setupListeners() {}

        initAnchorBtn() {
            const anchorBtn = this.querySelector("[data-variant-anchor]");
            const variantsSection = document.querySelector("[data-product-variants]");

            if (anchorBtn) {
                anchorBtn.addEventListener("click", () => {
                    variantsSection.scrollIntoView({ block: "end" });
                });
            }
        }

        initStickyActions() {
            const productForm = document.querySelector("[data-product-form]");
            const stickyAddToCart = this.querySelector("[data-asp-add-to-cart]");
            const submitButton = document.querySelector("[data-product-submit-button]");
            const self = this;

            if (stickyAddToCart) {
                const observerOptions = {
                    root: null,
                    rootMargin: "8px",
                    threshold: 0
                };

                function onIntersect(entries) {
                    entries.forEach(entry => {
                        if (entry.intersectionRatio === 0) {
                            self.classList.add("is-visible");
                        } else {
                            self.classList.remove("is-visible");
                        }
                    });
                }

                stickyAddToCart.addEventListener("click", () => {
                    submitButton.click();
                });

                new IntersectionObserver(onIntersect, observerOptions).observe(productForm);
            }
        }
    }

    if (!customElements.get("sticky-product")) {
        customElements.define("sticky-product", StickyProduct);
    }
}

initStickyProductComponent();
