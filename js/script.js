
document.addEventListener("DOMContentLoaded", function () {

    const venueCards = document.querySelectorAll(".photoBox");
    const mainBoxes = document.querySelector(".mainBoxes");

    if (!venueCards.length || !mainBoxes || !window.gsap) return;

    // THREE COLUMNS
    const columns = [[], [], []];

    venueCards.forEach((card, index) => {
        const column = index % 3;
        columns[column].push(card);
    });

    const columnTweens = [];

    // SET UP EACH COLUMN
    columns.forEach((cards, columnIndex) => {

        const columnPositions = [-210, 0, 210];
        const speed = [28, 36, 44][columnIndex];
        const spacing = 950 / cards.length;
        cards.forEach((card, index) => {

            gsap.set(card, {
                position: "absolute",
                left: "50%",
                top: 0,
                x: columnPositions[columnIndex],
                xPercent: -50,
                y: index * spacing,
                width: 460,
                height: 760,
                scale: 0.5,
                zIndex: 1,
                opacity: 1
            });

            // CONTINUOUS DOWNWARD MOVEMENT
            const movement = gsap.to(card, {
                y: "+=750",
                duration: speed,
                ease: "none",
                repeat: -1,
                modifiers: {
                    y: gsap.utils.unitize(value => {
                        const position = parseFloat(value);
                        return ((position % 750) + 750) % 750;
                    })
                }
            });

            columnTweens[columnIndex] = movement;
        });
    });

    
// HOVER EFFECT
venueCards.forEach(card => {

    card.addEventListener("mouseenter", function () {

        const column = columns.findIndex(cards =>
            cards.includes(card)
        );

        // Stop the entire column
        columnTweens[column].pause();

        gsap.to(venueCards, {
            opacity: 0.3,
            duration: 0.3
        });

        gsap.to(card, {
            scale: 0.65,
            opacity: 1,
            zIndex: 100,
            duration: 0.4,
            ease: "power2.out"
        });
    });

    card.addEventListener("mouseleave", function () {

        const column = columns.findIndex(cards =>
            cards.includes(card)
        );

        columnTweens[column].resume();

        gsap.to(card, {
            scale: 0.5,
            zIndex: 1,
            duration: 0.4
        });

        gsap.to(venueCards, {
            opacity: 1,
            duration: 0.4
        });
    });

});

// TICKET POPUP
const ticketModal = document.getElementById("ticketModal");
const closeTicket = document.getElementById("closeTicket");
const selectedVenue = document.getElementById("selectedVenue");
const selectedCity = document.getElementById("selectedCity");

document.querySelectorAll(".buy-ticket").forEach(button => {

    button.addEventListener("click", function (event) {

        event.stopPropagation();

        const card = button.closest(".photoBox");

        selectedVenue.textContent =
            card.querySelector("h2").textContent;

        selectedCity.textContent =
            card.querySelector(".venue-info p").textContent;

        ticketModal.classList.add("active");
    });

});

closeTicket.addEventListener("click", function () {
    ticketModal.classList.remove("active");
});

ticketModal.addEventListener("click", function (event) {
    if (event.target === ticketModal) {
        ticketModal.classList.remove("active");
    }
});
