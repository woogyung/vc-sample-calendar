(function () {
    "use strict";

    // Days and Months Constants
    var DAYS = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    var MONTHS = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    var DAYS_IN_MONTHS = [
        31,
        28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
    ];

    // Date Calculation helpers
    function getCurrentDay (date) {
        return date.getDay();
    }

    function getCurrentDate (date) {
        return date.getDate();
    }

    function getCurrentMonth (date) {
        return date.getMonth();
    }

    function getCurrentYear (date) {
        return date.getFullYear();
    }

    function getFirstDayOfMonth (year, month) {
        var firstDate = new Date(year, month, 1);
        return firstDate.getDay();
    }

    function getLastDateOfMonth (month) {
        return DAYS_IN_MONTHS[month];
    }

    // DOM Element helpers
    function isValidDateElement (el) {
        return el.tagName === "TD" && Number(el.textContent);
    }

    function isPrevButton (el) {
        return el.className === "prev";
    }

    function isNextButton (el) {
        return el.className === "next";
    }

    function createElementWithClass (className) {
        var element = document.createElement("div");
        element.classList.add(className);
        return element;
    }

    function createTableElementWithClass (className) {
        var element = document.createElement("table");
        element.classList.add(className);
        return element;
    }

    // Today View UI Constructor
    function TodayViewUI (date, day) {
        var node = createElementWithClass("today-view");
        var children = {
            day: null,
            date: null
        };

        function renderTemplate () {
            var template = "<div>" + DAYS[day] + "</div> \
                            <h1>" + date + "</h1>";
            node.innerHTML = template;
            children.day = node.querySelector("div");
            children.date = node.querySelector("h1");
        }

        this.render = function (targetEl) {
            renderTemplate();
            targetEl.appendChild(node);
        };

        this.update = function (date, day) {
            children.day.innerHTML = DAYS[day];
            children.date.innerHTML = date;
        };
    }

    // Calendar View Header Constructor
    function CalendarViewHeaderUI (year, month) {
        var node = createElementWithClass("header");
        var children = {
            monthAndYear: null
        };

        function renderTemplate () {
            var template = "<span class='prev'> < </span> \
                            <span class='month-year'>" + MONTHS[month] + " " + year + "</span> \
                            <span class='next'> > </span>";
            node.innerHTML = template;
            children.monthAndYear = node.querySelector(".month-year");
        }

        this.render = function (targetEl) {
            renderTemplate();
            targetEl.appendChild(node);
        };

        this.update = function (date) {
            children.monthAndYear.innerHTML = MONTHS[date.month] + " " + date.year;
        };
    }

    // Calendar Days View Constructor
    function CalendarDaysViewUI () {
        var node = createTableElementWithClass("days");

        function renderTemplate () {
            var template = "<td>S</td> \
                            <td>M</td> \
                            <td>T</td> \
                            <td>W</td> \
                            <td>T</td> \
                            <td>F</td> \
                            <td>S</td>";
            node.innerHTML = template;
        }

        this.render = function (targetEl) {
            renderTemplate();
            targetEl.appendChild(node);
        }
    }

    // Calendar Dates View Constructor
    function CalendarDatesViewUI (currentDate) {
        var node = createElementWithClass("calendar-table");

        function addEmptyCell (template, firstDayOfMonth) {
            for (var i = 0; i < firstDayOfMonth; i++) {
                template += "<td></td>";
            }
            return template;
        }

        function addValidDateCell (template, firstDayOfMonth) {
            var lastDateOfMonth = getLastDateOfMonth(currentDate.month);
            for (var j = 1; j <= lastDateOfMonth; j++) {
                template += ("<td>" + j + "</td>");
                if ((firstDayOfMonth + j) % 7 === 0) {
                    template += "</tr><tr>";
                }
            }
            return template;
        }

        function generateTemplate (firstDayOfMonth) {
            var template = "<table><tbody><tr>";
            template = addEmptyCell(template, firstDayOfMonth);
            template = addValidDateCell(template, firstDayOfMonth);
            template += "</tr></tbody></table>";
            return template;
        }

        function renderTemplate (date) {
            var firstDayOfMonth = getFirstDayOfMonth(date.year, date.month);
            var template = generateTemplate(firstDayOfMonth);
            node.innerHTML = template;
        }

        this.render = function (targetEl) {
            renderTemplate(currentDate);
            targetEl.appendChild(node);
        };

        this.update = function (date) {
            renderTemplate(date);
        };

        this.highlightSelectedDate = function (selectedDate) {
            var prevSelectedNode = node.querySelector(".selected");
            if (prevSelectedNode) {
                prevSelectedNode.classList.remove("selected");
            }

            var tableDataCellElements = node.querySelectorAll("td");
            for (var i = 0; i < tableDataCellElements.length; i++) {
                if (Number(tableDataCellElements[i].textContent) === selectedDate) {
                    tableDataCellElements[i].classList.add("selected");
                }
            }
        };
    }

    // Calendar View Constructor
    function CalendarViewUI (currentDate) {
        var node = createElementWithClass("calendar-view");
        var children = {
            header: null,
            dates: null
        };

        function renderHeader () {
            children.header = new CalendarViewHeaderUI(currentDate.year, currentDate.month);
            children.header.render(node);
        }

        function renderDays () {
            var calendarDaysView = new CalendarDaysViewUI();
            calendarDaysView.render(node);
        }

        function renderDates () {
            children.dates = new CalendarDatesViewUI(currentDate);
            children.dates.render(node);
        }

        function renderSubComponents () {
            renderHeader();
            renderDays();
            renderDates();
        }

        function updateHeader (date) {
            children.header.update(date);
        }

        function updateDates (date) {
            children.dates.update(date);
        }

        this.render = function (targetEl) {
            renderSubComponents();
            targetEl.appendChild(node);
        };

        this.update = function (date) {
            updateHeader(date);
            updateDates(date);
        };

        this.highlightSelectedDate = function (selectedDate) {
            children.dates.highlightSelectedDate(selectedDate);
        };
    }

    // Top Level Calendar Constructor
    function CalendarUI () {
        var node = createElementWithClass("calendar");
        var children = {
            todayView: null,
            calendarView: null
        };
        var date = new Date();
        var currentDate = {
            day: getCurrentDay(date),
            date: getCurrentDate(date),
            month: getCurrentMonth(date),
            year: getCurrentYear(date)
        };

        function renderTodaysView (date, day) {
            children.todayView = new TodayViewUI(date, day);
            children.todayView.render(node);
        }

        function renderCalendarView (date) {
            children.calendarView = new CalendarViewUI(date);
            children.calendarView.render(node);
            children.calendarView.highlightSelectedDate(date.date);
        }

        function renderSubComponents (date) {
            renderTodaysView(date.date, date.day);
            renderCalendarView(date);
        }

        function getSelectedDate (selectedDate) {
            var d = new Date(currentDate.year, currentDate.month, selectedDate);
            currentDate.date = selectedDate;
            currentDate.day = d.getDay();
        }

        function calculatePrevMonth () {
            currentDate.month--;
            if (currentDate.month < 0) {
                currentDate.month = 11;
                currentDate.year--;
            }
        }

        function calculateNextMonth () {
            currentDate.month++;
            if (currentDate.month > 11) {
                currentDate.month = 0;
                currentDate.year++;
            }
        }

        function updateTodayView () {
            children.todayView.update(currentDate.date, currentDate.day);
        }

        function highlightSelectedDate () {
            children.calendarView.highlightSelectedDate(currentDate.date);
        }

        function updateCalendarMonth () {
            children.calendarView.update(currentDate);
        }

        function addCalendarEventManager () {
            node.addEventListener("click", function (ev) {
                if (isValidDateElement(ev.target)) {
                    getSelectedDate(Number(ev.target.textContent));
                    updateTodayView();
                    highlightSelectedDate();
                } else if (isPrevButton(ev.target)) {
                    calculatePrevMonth();
                    updateCalendarMonth();
                } else if (isNextButton(ev.target)) {
                    calculateNextMonth();
                    updateCalendarMonth();
                }

                ev.stopPropagation();
            });
        }

        this.render = function (targetEl) {
            renderSubComponents(currentDate);
            targetEl.appendChild(node);
            addCalendarEventManager();
        };
    }

    window.CalendarUI = CalendarUI;
})();
