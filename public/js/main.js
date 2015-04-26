(function () {
    "use strict";

    function renderCalendar () {
        var calendar = new CalendarUI();
        calendar.render(document.body);
    }

    document.addEventListener("DOMContentLoaded", renderCalendar);
})();
