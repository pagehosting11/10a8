const calendar =
    document.getElementById("calendar");

const monthYear =
    document.getElementById("monthYear");

const previousMonth =
    document.getElementById("previousMonth");

const nextMonth =
    document.getElementById("nextMonth");

const eventOverlay =
    document.getElementById("eventOverlay");

const closeEvent =
    document.getElementById("closeEvent");

const selectedDate =
    document.getElementById("selectedDate");

const eventType =
    document.getElementById("eventType");

const eventTitle =
    document.getElementById("eventTitle");

const eventDescription =
    document.getElementById("eventDescription");

const saveEvent =
    document.getElementById("saveEvent");


let currentDate = new Date();

let selectedDateKey = null;

let events = {};


// =========================
// LOAD SAVED EVENTS
// =========================

try {

    events =
        JSON.parse(
            localStorage.getItem(
                "hwCalendarEvents"
            )
        ) || {};

} catch (error) {

    events = {};

}


// =========================
// CREATE CALENDAR
// =========================

function createCalendar() {

    calendar.innerHTML = "";


    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();


    const firstDay =
        new Date(
            year,
            month,
            1
        );


    const lastDay =
        new Date(
            year,
            month + 1,
            0
        );


    let startingDay =
        firstDay.getDay();


    // Monday = first day

    startingDay =
        (startingDay + 6) % 7;


    const daysInMonth =
        lastDay.getDate();


    // Month title

    monthYear.textContent =
        currentDate.toLocaleString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );


    // Empty boxes

    for (
        let i = 0;
        i < startingDay;
        i++
    ) {

        const emptyDay =
            document.createElement(
                "div"
            );


        emptyDay.className =
            "day empty";


        calendar.appendChild(
            emptyDay
        );

    }


    // Actual days

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const dayElement =
            document.createElement(
                "div"
            );


        dayElement.className =
            "day";


        // Date key

        const dateKey =
            year +
            "-" +
            String(
                month + 1
            ).padStart(2, "0") +
            "-" +
            String(day).padStart(2, "0");


        // Day number

        const dayNumber =
            document.createElement(
                "div"
            );


 dayNumber.textContent =
  String(day).padStart(2, "0") + "/" +
  String(month + 1).padStart(2, "0");


        dayElement.appendChild(
            dayNumber
        );


        // Today

        const today =
            new Date();


        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {

            dayElement.classList.add(
                "today"
            );

        }


        // =========================
        // EVENTS
        // =========================

        if (events[dateKey]) {

            events[dateKey].forEach(
                function(event, eventIndex) {

                    const eventElement =
                        document.createElement(
                            "div"
                        );


                   eventElement.className =
  "event " + (event.type === "PROJECT" ? "project" : "");


                    // TYPE

                    const typeElement =
                        document.createElement(
                            "div"
                        );


                    typeElement.className =
                        "event-type";


                    typeElement.textContent =
                        event.type;


                    // TITLE

                    const titleElement =
                        document.createElement(
                            "div"
                        );


                    titleElement.className =
                        "event-title";


                    titleElement.textContent =
                        event.title;


                    // Force title bold

                    titleElement.style.fontWeight =
                        "700";


                    // DESCRIPTION

                    const descriptionElement =
                        document.createElement(
                            "div"
                        );


                    descriptionElement.className =
                        "event-description";


                    descriptionElement.textContent =
                        event.description ||
                        "No description";


                    // =========================
                    // DELETE BUTTON
                    // =========================

                    const deleteButton =
                        document.createElement(
                            "button"
                        );


                    deleteButton.className =
                        "delete-event";


                    deleteButton.textContent =
                        "×";


                    deleteButton.title =
                        "Delete this event";


                    deleteButton.addEventListener(
                        "click",
                        function(clickEvent) {

                            // Stop the date popup

                            clickEvent.stopPropagation();


                            const confirmed =
                                confirm(
                                    "Delete this event?"
                                );


                            if (!confirmed) {

                                return;

                            }


                            // Delete event

                            events[dateKey].splice(
                                eventIndex,
                                1
                            );


                            // Remove empty date

                            if (
                                events[dateKey].length === 0
                            ) {

                                delete events[dateKey];

                            }


                            // Save changes

                            localStorage.setItem(
                                "hwCalendarEvents",
                                JSON.stringify(events)
                            );


                            // Refresh calendar

                            createCalendar();

                        }
                    );


                    // Add elements

                    eventElement.appendChild(
                        typeElement
                    );


                    eventElement.appendChild(
                        titleElement
                    );


                    eventElement.appendChild(
                        descriptionElement
                    );


                    eventElement.appendChild(
                        deleteButton
                    );


                    dayElement.appendChild(
                        eventElement
                    );

                }
            );

        }


        // =========================
        // CLICK DATE
        // =========================

        dayElement.addEventListener(
            "click",
            function() {

                openEventWindow(
                    dateKey,
                    year,
                    month,
                    day
                );

            }
        );


        calendar.appendChild(
            dayElement
        );

    }

}


// =========================
// OPEN POPUP
// =========================

function openEventWindow(
    dateKey,
    year,
    month,
    day
) {

    selectedDateKey =
        dateKey;


    const date =
        new Date(
            year,
            month,
            day
        );


    selectedDate.textContent =
        date.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );


    eventTitle.value = "";

    eventDescription.value = "";

    eventType.value = "HW";


    eventOverlay.classList.add(
        "active"
    );

}


// =========================
// CLOSE POPUP
// =========================

closeEvent.addEventListener(
    "click",
    function() {

        eventOverlay.classList.remove(
            "active"
        );

    }
);


// Click outside popup

eventOverlay.addEventListener(
    "click",
    function(event) {

        if (
            event.target === eventOverlay
        ) {

            eventOverlay.classList.remove(
                "active"
            );

        }

    }
);


// =========================
// SAVE EVENT
// =========================

saveEvent.addEventListener(
    "click",
    function() {

        const title =
            eventTitle.value.trim();


        const description =
            eventDescription.value.trim();


        const type =
            eventType.value;


        if (title === "") {

            alert(
                "Please enter a title."
            );

            return;

        }


        if (!events[selectedDateKey]) {

            events[selectedDateKey] = [];

        }


        events[selectedDateKey].push({

            type: type,

            title: title,

            description: description

        });


        // Save

        localStorage.setItem(
            "hwCalendarEvents",
            JSON.stringify(events)
        );


        // Close popup

        eventOverlay.classList.remove(
            "active"
        );


        // Refresh

        createCalendar();

    }
);


// =========================
// PREVIOUS MONTH
// =========================

previousMonth.addEventListener(
    "click",
    function() {

        currentDate.setMonth(
            currentDate.getMonth() - 1
        );


        createCalendar();

    }
);


// =========================
// NEXT MONTH
// =========================

nextMonth.addEventListener(
    "click",
    function() {

        currentDate.setMonth(
            currentDate.getMonth() + 1
        );


        createCalendar();

    }
);


// =========================
// START
// =========================

createCalendar();