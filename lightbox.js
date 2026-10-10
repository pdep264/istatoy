
/* =========================================================
   HARLEQUIN LIGHTBOX
   File: lightbox.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const images = Array.from(
        document.querySelectorAll("img.lightbox-image")
    );

    if (images.length === 0) return;

    let currentIndex = 0;
    let previousFocus = null;

    // Create the lightbox overlay
    const overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Image gallery");
    overlay.hidden = true;

    overlay.innerHTML = `
        <button class="lightbox-close"
                type="button"
                aria-label="Close image">&times;</button>

        <button class="lightbox-prev"
                type="button"
                aria-label="Previous image">&#10094;</button>

        <img class="lightbox-full-image"
             alt="">

        <button class="lightbox-next"
                type="button"
                aria-label="Next image">&#10095;</button>
    `;

    document.body.appendChild(overlay);

    const fullImage = overlay.querySelector(
        ".lightbox-full-image"
    );
    const closeButton = overlay.querySelector(
        ".lightbox-close"
    );
    const prevButton = overlay.querySelector(
        ".lightbox-prev"
    );
    const nextButton = overlay.querySelector(
        ".lightbox-next"
    );

    function showImage(index) {
        currentIndex = (index + images.length) % images.length;

        const selected = images[currentIndex];

        // Optional data-full attribute allows a separate
        // full-resolution file to be specified.
        fullImage.src = selected.dataset.full ||
                        selected.currentSrc ||
                        selected.src;

        fullImage.alt = selected.alt || "Gallery image";

        const multiple = images.length > 1;
        prevButton.hidden = !multiple;
        nextButton.hidden = !multiple;
    }

    function openLightbox(index) {
        previousFocus = document.activeElement;
        showImage(index);

        overlay.hidden = false;
        document.body.style.overflow = "hidden";
        closeButton.focus();
    }

    function closeLightbox() {
        overlay.hidden = true;
        document.body.style.overflow = "";
        fullImage.removeAttribute("src");

        if (previousFocus &&
            typeof previousFocus.focus === "function") {
            previousFocus.focus();
        }
    }

    function nextImage() {
        showImage(currentIndex + 1);
    }

    function previousImage() {
        showImage(currentIndex - 1);
    }

    // Activate gallery images
    images.forEach((img, index) => {
        img.style.cursor = "zoom-in";
        img.setAttribute("tabindex", "0");
        img.setAttribute("role", "button");
        img.setAttribute("aria-label",
            "Enlarge: " + (img.alt || "image"));

        img.addEventListener("click", () => {
            openLightbox(index);
        });

        img.addEventListener("keydown", (event) => {
            if (event.key === "Enter" ||
                event.key === " ") {
                event.preventDefault();
                openLightbox(index);
            }
        });
    });

    closeButton.addEventListener("click", closeLightbox);
    nextButton.addEventListener("click", nextImage);
    prevButton.addEventListener("click", previousImage);

    // Clicking the dark background closes the gallery
    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener("keydown", (event) => {
        if (overlay.hidden) return;

        switch (event.key) {
            case "Escape":
                closeLightbox();
                break;

            case "ArrowRight":
                nextImage();
                break;

            case "ArrowLeft":
                previousImage();
                break;

            case "Tab": {
                const controls = [
                    closeButton,
                    prevButton,
                    nextButton
                ].filter(button => !button.hidden);

                const first = controls[0];
                const last = controls[controls.length - 1];

                if (event.shiftKey &&
                    document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey &&
                           document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
                break;
            }
        }
    });
});
