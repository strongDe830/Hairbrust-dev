(() => {
    class t extends HTMLElement {
        constructor() {
            super(), (this.productForm = this.closest("form")), this.addEventListener("change", this.onVariantChange);
        }
        async onVariantChange(t) {
            window.Herd.eventBus.dispatchEvent(window.Herd.EVENTS.PRODUCT.VARIANT_CHANGED, t),
                this.checkForCombinedListings(t),
                this.updateOptions(),
                this.updateOptionValues(),
                await this.renderProductInfo(),
                this.updateMasterId(),
                this.currentVariant
                    ? (this.updateMediaImage(),
                      this.updateURL(),
                      this.updateVariantInput(),
                      this.setAvailability(this.currentVariant.available))
                    : this.setAvailability(!1);
        }
        updateOptions() {
            this.options = Array.from(this.querySelectorAll("select"), (t) => t.value);
        }
        updateOptionValues() {
            this.optionValues = Array.from(
                this.querySelectorAll("select"),
                (t) => t.selectedOptions[0].dataset.optionValueId
            ).toString();
        }
        checkForCombinedListings(t) {
            const e = t.target.selectedOptions[0],
                a = e.dataset.productUrl,
                i = e.dataset.variantId;
            return a && i
                ? ((this.productUrl = a), (this.currentVariantId = parseInt(i)), !0)
                : ((this.currentVariantId = null), !1);
        }
        async updateMasterId() {
            const t = this.getVariantData();
            this.currentVariant = t.find(
                (t) =>
                    !(!this.currentVariantId || this.currentVariantId != t.id) ||
                    !t.options.map((t, e) => this.options[e] === t || "Default Title" === t).includes(!1)
            );
        }
        updateURL() {
            this.currentVariant &&
                window.history.replaceState(
                    {},
                    "",
                    `${this.productUrl ? this.productUrl : this.dataset.url}?variant=${this.currentVariantId ? this.currentVariantId : this.currentVariant.id}`
                );
        }
        updateVariantInput() {
            const t = this.productForm.querySelector('input[name="id"]');
            (t.value = this.currentVariant.id), t.dispatchEvent(new Event("change", { bubbles: !0 }));
        }
        setAvailability(t) {
            const e = window.Herd.utils.getElements("[data-product-add-to-cart]", this.productForm),
                a = window.Herd.utils.getElements("[data-product-add-to-cart-text]", this.productForm);
            e.forEach((e) => {
                t ? e.removeAttribute("disabled") : e.setAttribute("disabled", null);
            }),
                a.forEach((e) => {
                    e.textContent = t ? window.variantStrings.addToCart : window.variantStrings.soldOut;
                });
        }
        updateMediaImage() {
            const t = document.querySelector("product-media");
            t && this.currentVariant.featured_media && t.changeToVariantImage(this.currentVariant.featured_media.id);
        }
        renderProductInfo() {
            return fetch(
                `${this.productUrl ? this.productUrl : this.dataset.url}?${this.currentVariantId ? "variant=" + this.currentVariantId : "option_values=" + this.optionValues}&section_id=${this.dataset.section}`
            )
                .then((t) => t.text())
                .then((t) => {
                    const e = new DOMParser().parseFromString(t, "text/html");
                    this.productInfoToRender.forEach((t) => {
                        const a = document.getElementById(t),
                            i = e.getElementById(t);
                        if (t == `layout-product-media-${this.dataset.section}`) {
                            i && a && (a.innerHTML = i.innerHTML);
                            document.querySelector("product-media").initSlider();
                        } else i && a && (a.innerHTML = i.innerHTML);
                    });
                  
                });
        }
        getVariantData() {
            return (
                (this.variantData = JSON.parse(this.querySelector('[type="application/json"]').textContent)?.variants),
                this.variantData
            );
        }
        get productInfoToRender() {
            return [
                `submit-button-${this.dataset.section}`,
                `data-prices-${this.dataset.section}`,
                `data-product-variants-${this.dataset.section}`,
                `snippet-action-sticky-product-${this.dataset.section}`,
                `data-product-json-${this.dataset.section}`,
                `layout-product-media-${this.dataset.section}`,
                `product-form-title-${this.dataset.section}`,
                `bogo-${this.dataset.section}`,
            ];
        }
    }
    customElements.get("variant-selects") || customElements.define("variant-selects", t),
        customElements.get("variant-radios") ||
            customElements.define(
                "variant-radios",
                class extends t {
                    constructor() {
                        super();
                    }
                    updateOptions() {
                        const t = Array.from(this.querySelectorAll("fieldset"));
                        this.options = t.map(
                            (t) => Array.from(t.querySelectorAll("input")).find((t) => t.checked).value
                        );
                    }
                    updateOptionValues() {
                        const t = Array.from(this.querySelectorAll("fieldset"));
                        this.optionValues = t
                            .map(
                                (t) =>
                                    Array.from(t.querySelectorAll("input")).find((t) => t.checked).dataset.optionValueId
                            )
                            .toString();
                    }
                    async checkForCombinedListings(t) {
                        const e = t.target,
                            a = e.dataset.productUrl,
                            i = e.dataset.variantId;
                        return a && i
                            ? ((this.productUrl = a), (this.currentVariantId = parseInt(i)), !0)
                            : ((this.currentVariantId = null), !1);
                    }
                }
            );
})();
