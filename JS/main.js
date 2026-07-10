document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".news-carousel");
  const prevButton = document.querySelector(".prev-btn");
  const nextButton = document.querySelector(".next-btn");

  if (carousel && prevButton && nextButton) {
    const getScrollAmount = () => {
      return carousel.clientWidth;
    };

    const scrollCarousel = (direction) => {
      const amount =
        direction === "next" ? getScrollAmount() : -getScrollAmount();
      carousel.scrollBy({ left: amount, behavior: "smooth" });
    };

    prevButton.addEventListener("click", () => scrollCarousel("prev"));
    nextButton.addEventListener("click", () => scrollCarousel("next"));

    let autoScroll = setInterval(() => {
      const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
      if (carousel.scrollLeft >= maxScrollLeft - 2) {
        carousel.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollCarousel("next");
      }
    }, 5000);

    carousel.addEventListener("mouseenter", () => clearInterval(autoScroll));
    carousel.addEventListener("mouseleave", () => {
      autoScroll = setInterval(() => {
        const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
        if (carousel.scrollLeft >= maxScrollLeft - 2) {
          carousel.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollCarousel("next");
        }
      }, 5000);
    });
  }
});
