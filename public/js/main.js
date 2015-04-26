(function () {
    "use strict";

    function renderCalendar () {
        var calendar = new Calendar();
        calendar.render(document.body);
    }

    document.addEventListener("DOMContentLoaded", renderCalendar);
})();
