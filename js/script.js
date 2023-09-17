// Main variables declaration
const PLAY_PAUSE_BUTTON = document.getElementById("timerButton");
const TIMER_DISPLAY = document.getElementById("timerDisplay");
const TIMER_STATUS = document.getElementById("timerStatus");
const WORKTIME_INPUT = document.getElementById("workTime");
const BREAKTIME_INPUT = document.getElementById("breakTime");
const TITLE = document.getElementsByTagName("title")[0];
let workMinutesDuration = 25,
    workSecondsDuration = 0,
    breakMinutesDuration = 5,
    breakSecondsDuration = 0,
    minutesElapsed = workMinutesDuration,
    secondsElapsed = 0,
    isInBreak = false,
    intervalId = 0;

/**
 *  Function to format the numbers given into a proper time representation. Handle the case where the minutes given are higher than 59 to display hours.
 * @param {number} minutes - the number corresponding to minutes
 * @param {number} seconds - the number corresponding to seconds
 * @returns the formatted string on format (hh:)mm:ss
 */
const timeFormatting = (minutes, seconds) => {
    const HOURS_FORMATTED = minutes >= 59 ? `${Math.floor(minutes / 60)}:` : "";
    minutes = minutes % 60;
    const MINUTES_FORMATTED = minutes < 10 ? `0${minutes}` : minutes;
    const SECONDS_FORMATTED = seconds < 10 ? `0${seconds}` : seconds;
    return `${HOURS_FORMATTED}${MINUTES_FORMATTED}:${SECONDS_FORMATTED}`;
};

/**
 * Function used to start the countdown on the timer.
 * @returns the interval id created by the method setInterval
 */
const timerStart = () => {
    if (workSecondsDuration === 0) {
        minutesElapsed = workMinutesDuration - 1;
        secondsElapsed = 59;
    } else {
        minutesElapsed = workMinutesDuration;
        secondsElapsed = workSecondsDuration - 1;
    }
    isInBreak = false;
    TIMER_STATUS.textContent = "TRAVAIL";
    TIMER_STATUS.classList = "workActive";
    TITLE.textContent = `${timeFormatting(
        minutesElapsed,
        secondsElapsed
    )} | Pomodoro`;
    return setInterval(countdown, 1000);
};

/**
 * Function used to reset the timer.
 * @param {number} intervalId - the interval id from the setInterval method to clear the precedent interval and stop the countdown
 * @returns 0
 */
const timerReset = (intervalId) => {
    minutesElapsed = workMinutesDuration;
    secondsElapsed = workSecondsDuration;
    isInBreak = false;
    TIMER_STATUS.textContent = "En attente de lancement...";
    TITLE.textContent = "Pomodoro";
    TIMER_STATUS.classList = "";
    clearInterval(intervalId);
    return 0;
};

/**
 * Function used to manipulate the timer. It descreases seconds and minutes and handle the switch between work and break cycle.
 */
const countdown = () => {
    secondsElapsed--;
    TIMER_DISPLAY.textContent = timeFormatting(minutesElapsed, secondsElapsed);
    TITLE.textContent = `${TIMER_DISPLAY.textContent} | Pomodoro`;
    if (secondsElapsed === 0) {
        secondsElapsed = 60;
        if (minutesElapsed === 0 && !isInBreak) {
            TIMER_STATUS.textContent = "PAUSE";
            TIMER_STATUS.classList = "breakActive";
            isInBreak = true;
            minutesElapsed = breakMinutesDuration;
            secondsElapsed =
                breakSecondsDuration === 0 ? 60 : breakSecondsDuration;
            if (secondsElapsed != 60) return;
        } else if (minutesElapsed === 0 && isInBreak) {
            TIMER_STATUS.textContent = "TRAVAIL";
            TIMER_STATUS.classList = "workActive";
            isInBreak = false;
            minutesElapsed = workMinutesDuration;
            secondsElapsed =
                workSecondsDuration === 0 ? 60 : workSecondsDuration;
            if (secondsElapsed != 60) return;
        }
        minutesElapsed--;
    }
};

/**
 *  Block invalid inputs by replacing the edited input with its previous value and displaying a warning message.
 * @param {Event} event - Event given by the listener
 * @param {string} inputType - only "work" or "break" are accepted value
 */
const invalidInputHandler = (event, inputType) => {
    const target = event.target;
    const correctedFormat =
        inputType === "work"
            ? timeFormatting(workMinutesDuration, workSecondsDuration)
            : timeFormatting(breakMinutesDuration, breakSecondsDuration);
    target.value = correctedFormat;
    target.setCustomValidity(
        "Le format ou la valeur entrée est incorrect ! La durée entrée doit se situer entre 1:00 et 60:00 et respecter le format MM:SS."
    );
    target.reportValidity();
};

/**
 * Handle the user input and call the invalidInputHandler method to block invalid inputs.
 * @param {Event} event - Event given by the listener
 * @param {string} inputType - only "work" or "break" are accepted value
 */
const inputHandler = (event, inputType) => {
    const input = event.target.value;
    const timeInputRegex = /(^[0-5]?[1-9]|^60):[0-5]\d{1}/gm;
    const regexResult = timeInputRegex.test(input);
    if (!regexResult) return invalidInputHandler(event, inputType);
    if (inputType === "work") {
        localStorage.setItem("workTimer", input);
        [workMinutesDuration, workSecondsDuration] = input
            .split(":")
            .map(Number);
        TIMER_DISPLAY.textContent = timeFormatting(
            workMinutesDuration,
            workSecondsDuration
        );
    } else {
        localStorage.setItem("breakTimer", input);
        [breakMinutesDuration, breakSecondsDuration] = input
            .split(":")
            .map(Number);
    }
    event.target.setCustomValidity("");
    event.target.reportValidity();
};

/**
 * Function to load custom timers if they exist in the localStorage.
 */
const loadStorage = () => {
    const workTimer = localStorage.getItem("workTimer");
    const breakTimer = localStorage.getItem("breakTimer");
    if (workTimer)
        [workMinutesDuration, workSecondsDuration] = workTimer
            .split(":")
            .map(Number);
    if (breakTimer)
        [breakMinutesDuration, breakSecondsDuration] = breakTimer
            .split(":")
            .map(Number);
};

window.onload = () => {
    loadStorage();
    TIMER_DISPLAY.textContent = timeFormatting(
        workMinutesDuration,
        workSecondsDuration
    );
    WORKTIME_INPUT.value = TIMER_DISPLAY.textContent;
    BREAKTIME_INPUT.value = timeFormatting(
        breakMinutesDuration,
        breakSecondsDuration
    );
};

PLAY_PAUSE_BUTTON.addEventListener("click", () => {
    // The intervalId is returned by the function timerStart to be used in timerReset afterwards
    intervalId = PLAY_PAUSE_BUTTON.hasAttribute("button_active")
        ? timerReset(intervalId)
        : timerStart();
    // The lines bellow are needed in both timerStart and timerReset
    TIMER_DISPLAY.textContent = timeFormatting(minutesElapsed, secondsElapsed);
    PLAY_PAUSE_BUTTON.toggleAttribute("button_active");
    PLAY_PAUSE_BUTTON.classList.toggle("fa-play");
    PLAY_PAUSE_BUTTON.classList.toggle("fa-arrow-rotate-left");
});

WORKTIME_INPUT.addEventListener("change", (event) =>
    inputHandler(event, "work")
);
BREAKTIME_INPUT.addEventListener("change", (event) =>
    inputHandler(event, "break")
);
