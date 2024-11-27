let slider = document.querySelector(".slider");
let cards = document.querySelectorAll(".card");
let ease = 0.1;

let currentX = 0;
let targetX = 0;

const lerp = (start, end, t) => start * (1 - t) + end * t;

const getScaleFactor = (position, viewportWidth) => {
    const quarterWidth = viewportWidth / 4;

    if (position < 0 || position > viewportWidth) return 0;
    if (position < quarterWidth) return lerp(0, 0.45, position / quarterWidth);
    if (position < 2 * quarterWidth) return lerp(0.45, 1.5, (position - quarterWidth) / quarterWidth);
    if (position < 3 * quarterWidth) return lerp(1.5, 0.45, (position - 2 * quarterWidth) / quarterWidth);
    return lerp(0.45, 0, (position - 3 * quarterWidth) / quarterWidth);
};

const updateScales = () => {
    const viewportWidth = window.innerWidth;

    cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const scaleFactor = getScaleFactor(cardCenter, viewportWidth);
        const imgScaleFactor = scaleFactor * 1.1;
        const img = card.querySelector("img");

        card.style.transform = `scale(${scaleFactor})`;
        img.style.transform = `scale(${imgScaleFactor})`;
    });
};

const update = () => {
    currentX = lerp(currentX, targetX, ease);
    slider.style.transform = `translateX(${currentX}px)`;
    updateScales();
    requestAnimationFrame(update);
};

const calculateTargetX = () => {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollProgress = window.scrollY / maxScroll;
    const sliderWidth = slider.scrollWidth;
    const viewportWidth = window.innerWidth;

    targetX = -scrollProgress * (sliderWidth - viewportWidth);
};

window.addEventListener("scroll", () => {
    calculateTargetX();
});

window.addEventListener("resize", () => {
    // Update targetX on resize
    calculateTargetX();
    updateScales();
});

// Trigger initial updates
document.addEventListener("DOMContentLoaded", () => {
    calculateTargetX();
    updateScales();
    update(); // Start animation loop
});
