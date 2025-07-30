const scrollFrame = document.getElementById("scroll-frame");

for (const card of scrollFrame.children) {
    if (card.classList.contains("scroll-card")) {
        card.onclick = () => window.location.href = card.dataset.link;
    }
}