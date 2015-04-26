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

    // Today View Constructor
    function TodayViewUI (currentDate) {
        var node = createElementWithClass("today-view");

        function renderTemplate () {
            var day = DAYS[currentDate.day];
            var date = currentDate.date;
            var template = "<div>" + day + "</div> \
                            <h1>" + date + "</h1>";
            node.innerHTML = template;
        }

        this.render = function (targetEl) {
            renderTemplate();
            targetEl.appendChild(node);
        };
    }

    // Calendar View Header Constructor
    function CalendarViewHeaderUI (currentDate) {
        var node = createElementWithClass("header");

        function renderTemplate () {
            var month = MONTHS[currentDate.month];
            var year = currentDate.year;
            var template = "<span class='prev'> < </span> \
                            <span class='month-year'>" + month + " " + year + "</span> \
                            <span class='next'> > </span>";
            node.innerHTML = template;
        }

        this.render = function (targetEl) {
            renderTemplate();
            targetEl.appendChild(node);
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
                if (j === currentDate.date) {
                    template += ("<td class='selected'>" + j + "</td>");
                } else {
                    template += ("<td>" + j + "</td>");
                }

                if ((firstDayOfMonth + j) % 7 === 0) {
                    template += "</tr><tr>";
                }
            }
            return template;
        }

        function generateTemplate () {
            var template = "<table><tbody><tr>";
            var firstDayOfMonth = getFirstDayOfMonth(currentDate.year, currentDate.month);
            template = addEmptyCell(template, firstDayOfMonth);
            template = addValidDateCell(template, firstDayOfMonth);
            template += "</tr></tbody></table>";
            return template;
        }

        function renderTemplate () {
            var template = generateTemplate();
            node.innerHTML = template;
        }

        this.render = function (targetEl) {
            renderTemplate();
            targetEl.appendChild(node);
        };
    }

    // Calendar View Constructor
    function CalendarViewUI (currentDate) {
        var node = createElementWithClass("calendar-view");

        function renderHeader () {
            var headerView = new CalendarViewHeaderUI(currentDate);
            headerView.render(node);
        }

        function renderDays () {
            var calendarDaysView = new CalendarDaysViewUI();
            calendarDaysView.render(node);
        }

        function renderDates () {
            var calendarDatesView = new CalendarDatesViewUI(currentDate);
            calendarDatesView.render(node);
        }

        function renderSubComponents () {
            renderHeader();
            renderDays();
            renderDates();
        }

        this.render = function (targetEl) {
            renderSubComponents();
            targetEl.appendChild(node);
        };
    }

    // Top Level Calendar Constructor
    function CalendarUI () {
        var node = createElementWithClass("calendar");
        var date = new Date();
        var currentDate = {
            day: getCurrentDay(date),
            date: getCurrentDate(date),
            month: getCurrentMonth(date),
            year: getCurrentYear(date)
        };

        function renderTodaysView () {
            var todayView = new TodayViewUI(currentDate);
            todayView.render(node);
        }

        function renderCalendarView () {
            var calendarView = new CalendarViewUI(currentDate);
            calendarView.render(node);
        }

        function renderSubComponents () {
            renderTodaysView();
            renderCalendarView();
        }

        this.render = function (targetEl) {
            renderSubComponents();
            targetEl.appendChild(node);
        };
    }

    window.CalendarUI = CalendarUI;
})();
