document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // VENUE CAROUSEL
    // =====================================

    const venueCards = document.querySelectorAll(".photoBox");
    const columns = [[], [], []];
    const columnTweens = [[], [], []];

    // Arrange venues into three columns
    venueCards.forEach((card, index) => {
        columns[index % 3].push(card);
    });

    // Start carousel
    if (window.gsap && venueCards.length) {

        columns.forEach((cards, columnIndex) => {

            const columnPositions = [-210, 0, 210];
            const speed = [28, 36, 44][columnIndex];
            const spacing = 420;
            const cycle = spacing * cards.length;

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

                const movement = gsap.to(card, {
                    y: `+=${cycle}`,
                    duration: speed,
                    ease: "none",
                    repeat: -1,
                    modifiers: {
                        y: gsap.utils.unitize(value => {
                            const position = parseFloat(value);
                            return ((position % cycle) + cycle) % cycle;
                        })
                    }
                });

                columnTweens[columnIndex].push(movement);
            });
        });

        // Pause column and enlarge card on hover
        venueCards.forEach(card => {

            card.addEventListener("mouseenter", function () {

                const column = columns.findIndex(cards =>
                    cards.includes(card)
                );

                columnTweens[column].forEach(tween => tween.pause());

                gsap.to(venueCards, {
                    opacity: 0.3,
                    duration: 0.3
                });

                gsap.to(card, {
                    scale: 0.65,
                    opacity: 1,
                    zIndex: 100,
                    duration: 0.4
                });
            });

            card.addEventListener("mouseleave", function () {

                const column = columns.findIndex(cards =>
                    cards.includes(card)
                );

                columnTweens[column].forEach(tween => tween.resume());

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
    }


    // =====================================
    // TICKET POPUP
    // =====================================

    const ticketModal = document.getElementById("ticketModal");
    const closeTicket = document.getElementById("closeTicket");

    const selectedVenue = document.getElementById("selectedVenue");
    const selectedCity = document.getElementById("selectedCity");

    const reservationScreen = document.getElementById("reservationScreen");
    const paymentScreen = document.getElementById("paymentScreen");
    const paymentSuccess = document.getElementById("paymentSuccess");

    const purchaseButton = document.getElementById("purchaseTicket");
    const paymentForm = document.getElementById("paymentForm");
    const finishCheckout = document.getElementById("finishCheckout");


    // Reset popup to the first screen
    function resetCheckout() {

        if (reservationScreen) {
            reservationScreen.style.display = "flex";
        }

        if (paymentScreen) {
            paymentScreen.classList.remove("active");
        }

        if (paymentSuccess) {
            paymentSuccess.classList.remove("active");
        }

        if (paymentForm) {
            paymentForm.reset();
        }
    }


    // Open popup when BUY A TICKET is clicked
    document.addEventListener("click", function (event) {

        const button = event.target.closest(".buy-ticket");

        if (!button || !ticketModal) return;

        event.preventDefault();
        event.stopPropagation();

        const card = button.closest(".photoBox");

        if (!card) return;

        selectedVenue.textContent =
            card.querySelector("h2").textContent;

        selectedCity.textContent =
            card.querySelector(".venue-info p").textContent;

        resetCheckout();

        ticketModal.classList.add("active");
    });


    // =====================================
    // MOVE TO PAYMENT SCREEN
    // =====================================

    if (purchaseButton) {

        purchaseButton.addEventListener("click", function () {

            const quantity = document.getElementById("ticketQuantity");

            if (!quantity || !quantity.value) {
                alert("Please select your ticket quantity.");
                return;
            }

            document.getElementById("paymentVenue").textContent =
                selectedVenue.textContent;

            document.getElementById("paymentCity").textContent =
                selectedCity.textContent;

            document.getElementById("paymentQuantity").textContent =
                "QUANTITY: " + quantity.value;

            reservationScreen.style.display = "none";
            paymentScreen.classList.add("active");
        });
    }


    // =====================================
    // SUBMIT PAYMENT
    // =====================================

    if (paymentForm) {

        paymentForm.addEventListener("submit", function (event) {

            event.preventDefault();

            paymentScreen.classList.remove("active");
            paymentSuccess.classList.add("active");
        });
    }


    // =====================================
    // CLOSE POPUP
    // =====================================

    if (closeTicket && ticketModal) {

        closeTicket.addEventListener("click", function () {
            ticketModal.classList.remove("active");
            resetCheckout();
        });

        ticketModal.addEventListener("click", function (event) {

            if (event.target === ticketModal) {
                ticketModal.classList.remove("active");
                resetCheckout();
            }
        });

        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {
                ticketModal.classList.remove("active");
                resetCheckout();
            }
        });
    }


    // =====================================
    // FINISH CHECKOUT
    // =====================================

    if (finishCheckout) {

        finishCheckout.addEventListener("click", function () {

            ticketModal.classList.remove("active");
            resetCheckout();
        });
    }

});
