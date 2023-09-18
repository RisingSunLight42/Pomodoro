// Main variables declaration
const PLAY_PAUSE_BUTTON = document.getElementById("timerButton");
const TIMER_DISPLAY = document.getElementById("timerDisplay");
const TIMER_STATUS = document.getElementById("timerStatus");
const WORKTIME_INPUT = document.getElementById("workTime");
const BREAKTIME_INPUT = document.getElementById("breakTime");
const TITLE = document.getElementsByTagName("title")[0];
const ALARM = new Audio("./audio/alarm.mp3");
let workMinutesDuration = 25,
    workSecondsDuration = 0,
    breakMinutesDuration = 5,
    breakSecondsDuration = 0,
    minutesElapsed = workMinutesDuration,
    secondsElapsed = 0,
    isInBreak = false,
    intervalId = 0,
    userClick = 0;

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
        minutesElapsed = workMinutesDuration - (1 * workMinutesDuration != 0);
        console.log(minutesElapsed);
        secondsElapsed = 59;
    } else {
        minutesElapsed = workMinutesDuration;
        secondsElapsed = workSecondsDuration - (1 * workSecondsDuration != 1);
    }
    isInBreak = false;
    TIMER_STATUS.textContent = "WORK";
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
    TIMER_STATUS.textContent = "Waiting for the launch...";
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
            TIMER_STATUS.textContent = "BREAK";
            TIMER_STATUS.classList = "breakActive";
            isInBreak = true;
            minutesElapsed = breakMinutesDuration;
            secondsElapsed =
                breakSecondsDuration === 0 ? 60 : breakSecondsDuration;
            ALARM.play();
            if (secondsElapsed != 60) return;
        } else if (minutesElapsed === 0 && isInBreak) {
            TIMER_STATUS.textContent = "WORK";
            TIMER_STATUS.classList = "workActive";
            isInBreak = false;
            minutesElapsed = workMinutesDuration;
            secondsElapsed =
                workSecondsDuration === 0 ? 60 : workSecondsDuration;
            ALARM.play();
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
    const TARGER = event.target;
    const CORRECTED_FORMAT =
        inputType === "work"
            ? timeFormatting(workMinutesDuration, workSecondsDuration)
            : timeFormatting(breakMinutesDuration, breakSecondsDuration);
    TARGER.value = CORRECTED_FORMAT;
    TARGER.setCustomValidity(
        "Le format ou la valeur entrée est incorrect ! La durée entrée doit se situer entre 00:01 et 60:00 et respecter le format MM:SS."
    );
    TARGER.reportValidity();
};

/**
 * Handle the user input and call the invalidInputHandler method to block invalid inputs.
 * @param {Event} event - Event given by the listener
 * @param {string} inputType - only "work" or "break" are accepted value
 */
const inputHandler = (event, inputType) => {
    const INPUT = event.target.value;
    const TIME_INPUT_REGEX = /(^[0-5]?\d{1}|^60):[0-5]\d{1}/gm;
    const REGEX_RESULT = TIME_INPUT_REGEX.test(INPUT);
    if (!REGEX_RESULT || INPUT === "0:00" || INPUT === "00:00")
        return invalidInputHandler(event, inputType);
    if (inputType === "work") {
        localStorage.setItem("workTimer", INPUT);
        [workMinutesDuration, workSecondsDuration] =
            INPUT.split(":").map(Number);
        TIMER_DISPLAY.textContent = timeFormatting(
            workMinutesDuration,
            workSecondsDuration
        );
    } else {
        localStorage.setItem("breakTimer", INPUT);
        [breakMinutesDuration, breakSecondsDuration] =
            INPUT.split(":").map(Number);
    }
    event.target.setCustomValidity("");
    event.target.reportValidity();
};

/**
 * Function to load custom timers if they exist in the localStorage.
 */
const loadStorage = () => {
    const WORK_TIMER = localStorage.getItem("workTimer");
    const BREAK_TIMER = localStorage.getItem("breakTimer");
    if (WORK_TIMER)
        [workMinutesDuration, workSecondsDuration] =
            WORK_TIMER.split(":").map(Number);
    if (BREAK_TIMER)
        [breakMinutesDuration, breakSecondsDuration] =
            BREAK_TIMER.split(":").map(Number);
};

/**
 * Just a dumb function to enable 42:42 timers when you click 42 times on the play/stop button
 */
const easterEgg = () => {
    userClick++;
    if (userClick != 42) return;
    workMinutesDuration =
        workSecondsDuration =
        breakMinutesDuration =
        breakSecondsDuration =
            42;
    TIMER_DISPLAY.textContent = timeFormatting(
        workMinutesDuration,
        workSecondsDuration
    );
    WORKTIME_INPUT.value = TIMER_DISPLAY.textContent;
    BREAKTIME_INPUT.value = TIMER_DISPLAY.textContent;
    localStorage.setItem("workTimer", "42:42");
    localStorage.setItem("breakTimer", "42:42");
};

/**
 * Function used to display default value for the user in the timer display and in the inputs.
 * The values displayed may be not the defaults ones if the user already personnalized their timers.
 */
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
    easterEgg();
});

WORKTIME_INPUT.addEventListener("change", (event) =>
    inputHandler(event, "work")
);
BREAKTIME_INPUT.addEventListener("change", (event) =>
    inputHandler(event, "break")
);
