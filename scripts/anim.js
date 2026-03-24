import { animate, spring } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";

// Animate title on load
animate("#site-title", { opacity: [0, 1], scale: [0.8, 1] }, { easing: spring() });

const itemWrapper = document.querySelector('.item-wrapper');

// Animate cards as they're added dynamically
const observer = new MutationObserver((mutations) => {
    let i = 0;
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (node.nodeType === 1 && node.classList.contains('card')) {
                animate(node, { opacity: [0, 1], y: [20, 0] }, { duration: 0.4, delay: i * 0.03, easing: "ease-in" });
                i++;
            }
        }
    }
});

observer.observe(itemWrapper, { childList: true });

