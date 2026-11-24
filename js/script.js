
document.addEventListener("DOMContentLoaded", function () {

    const venueCards = document.querySelectorAll(".photoBox");
    const mainBoxes = document.querySelector(".mainBoxes");

    if (!venueCards.length || !mainBoxes) return;

    const columns = [[], [], []];
    let selectedCard = null;

    // ARRANGE VENUES INTO THREE COLUMNS
    venueCards.forEach((card, index) => {
        const column = index % 3;

        card.classList.add("pb-col" + column);
        columns[column].push(card);

        gsap.set(card, {
            position: "absolute",
            left: column * 410,
            top: 0,
            width: 400,
            height: 640,
            scale: 0.5,
            borderRadius: 20,
            zIndex: 1,
            opacity: 1
        });
    });

    // CREATE CONTINUOUS VERTICAL MOVEMENT
    const timelines = columns.map((cards, columnIndex) => {

        const startY = [-575, 800, 800][columnIndex];
        const endY = [800, -575, -575][columnIndex];

        const duration = [40, 35, 26][columnIndex];

        const timeline = gsap.timeline({
            repeat: -1,
            defaults: { ease: "none" }
        });

        cards.forEach((card, index) => {

            const spacing = 350;

            timeline.fromTo(
                card,
                {
                    y: startY + index * spacing,
                    rotation: -0.05
                },
                {
                    y: endY + index * spacing,
                    rotation: 0.05,
                    duration: duration
                },
                0
            );

        });

        return timeline;
    });

    // PAUSE THE SELECTED COLUMN
    function pauseColumn(card) {

        const column = [...card.classList]
            .find(className => className.startsWith("pb-col"));

        const columnIndex = Number(column.replace("pb-col", ""));

        gsap.to(timelines[columnIndex], {
            timeScale: 0,
            duration: 0.4,
            ease: "sine"
        });
    }

    // RESUME ALL COLUMNS
    function playColumns() {

        timelines.forEach(timeline => {

            gsap.to(timeline, {
                timeScale: 1,
                duration: 0.5,
                ease: "sine.in"
            });

        });
    }

    // HOVER EFFECT
    venueCards.forEach(card => {

        card.addEventListener("mouseenter", function () {

            if (selectedCard) return;

            pauseColumn(card);

            gsap.to(venueCards, {
                opacity: 0.35,
                duration: 0.3
            });

            gsap.to(card, {
                scale: 0.62,
                opacity: 1,
                zIndex: 100,
                duration: 0.3,
                ease: "power3.out"
            });

        });

        card.addEventListener("mouseleave", function () {

            if (selectedCard) return;

            gsap.to(card, {
                scale: 0.5,
                zIndex: 1,
                duration: 0.4,
                ease: "expo.out"
            });

            gsap.to(venueCards, {
                opacity: 1,
                duration: 0.4
            });

            playColumns();

        });

    });

    // CLICK TO SELECT A VENUE
    venueCards.forEach(card => {

        card.addEventListener("click", function () {

            if (selectedCard === card) {
                selectedCard = null;

                gsap.to(card, {
                    scale: 0.5,
                    duration: 0.5
                });

                gsap.to(mainBoxes, {
                    x: 0,
                    duration: 0.5
                });

                playColumns();

                return;
            }

            if (selectedCard) return;

            selectedCard = card;

            pauseColumn(card);

            gsap.to(venueCards, {
                opacity: 0.2,
                duration: 0.3
            });

            gsap.to(card, {
                scale: 0.8,
                opacity: 1,
                zIndex: 200,
                duration: 0.6,
                ease: "expo.inOut"
            });

        });

    });

    // START THE ANIMATION
    playColumns();

});
