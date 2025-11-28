(() => {
    class t extends HTMLElement {
        constructor() {
            super(), this.initAnchorBtn(), this.initStickyActions();
        }
        setupListerners() {}
        initAnchorBtn() {
            const t = this.querySelector("[data-variant-anchor]"),
                e = document.querySelector("[data-product-variants]");
            t &&
                t.addEventListener("click", function () {
                    e.scrollIntoView({ block: "end" });
                });
        }
        initStickyActions() {
            const t = document.querySelector("[data-product-form]"),
                e = this.querySelector("[data-asp-add-to-cart]"),
                i = this,
                n = document.querySelector("[data-product-submit-button]");
            if (e) {
                const c = { root: null, rootMargin: "8px", threshold: 0 };
                function o(t, e) {
                    t.forEach((t) => {
                        0 === t.intersectionRatio ? i.classList.add("is-visible") : i.classList.remove("is-visible");
                    });
                }
                e.addEventListener("click", function () {
                    n.click();
                });
                new IntersectionObserver(o, c).observe(t);
            }
        }
    }
    customElements.define("sticky-product", t);
})();
