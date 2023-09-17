// Main variables declaration
const PLAY_PAUSE_BUTTON = document.getElementById("timerButton");
const TIMER_DISPLAY = document.getElementById("timerDisplay");
const TIMER_STATUS = document.getElementById("timerStatus");
let workMinutesDuration = 25,
    workSecondsDuration = 0,
    breakMinutesDuration = 5,
    breakSecondsDuration = 0,
    secondsElapsed = 0,
    isInBreak = false,
    intervalId = 0,
    workCurrentMinutes = workMinutesDuration,
    breakCurrentMinutes = breakMinutesDuration;

/**
 *  Function to format the numbers given into a proper time representation. Handle the case where the minutes given are higher than 59 to display hours.
 * @param {number} minutes - the number corresponding to minutes
 * @param {number} seconds - the number corresponding to seconds
 * @returns the formatted string on format (hh:)mm:ss
 */
const timeFormatting = (minutes, seconds) => {
    const HOURS_FORMATTED = minutes >= 59 ? `${Math.floor(minutes / 60)}:` : "";
    const MINUTES_FORMATTED = minutes < 10 ? `0${minutes}` : minutes % 60;
    const SECONDS_FORMATTED = seconds < 10 ? `0${seconds}` : seconds;
    return `${HOURS_FORMATTED}${MINUTES_FORMATTED}:${SECONDS_FORMATTED}`;
};

/**
 * Function used to start the countdown on the timer.
 * @returns the interval id created by the method setInterval
 */
const timerStart = () => {
    workCurrentMinutes = workMinutesDuration - 1;
    secondsElapsed = workSecondsDuration === 0 ? 59 : workSecondsDuration - 1;
    isInBreak = false;
    TIMER_STATUS.textContent = "TRAVAIL";
    TIMER_STATUS.classList = "workActive";
    return setInterval(countdown, 1000);
};

/**
 * Function used to reset the timer.
 * @param {number} intervalId - the interval id from the setInterval method to clear the precedent interval and stop the countdown
 * @returns 0
 */
const timerReset = (intervalId) => {
    workCurrentMinutes = workMinutesDuration;
    breakCurrentMinutes = breakMinutesDuration;
    secondsElapsed = workSecondsDuration;
    isInBreak = false;
    TIMER_STATUS.textContent = "En attente de lancement...";
    TIMER_STATUS.classList = "";
    clearInterval(intervalId);
    return 0;
};

/**
 * Function used to manipulate the timer. It descreases seconds and minutes and handle the switch between work and break cycle.
 */
const countdown = () => {
    secondsElapsed--;
    TIMER_DISPLAY.textContent = timeFormatting(
        isInBreak ? breakCurrentMinutes : workCurrentMinutes,
        secondsElapsed
    );
    if (secondsElapsed === 0) {
        secondsElapsed = 60;
        if (workCurrentMinutes === 0) {
            TIMER_STATUS.textContent = "PAUSE";
            TIMER_STATUS.classList = "breakActive";
            isInBreak = true;
            breakCurrentMinutes = breakMinutesDuration;
            secondsElapsed =
                breakSecondsDuration === 0 ? 60 : breakSecondsDuration;
        } else if (breakCurrentMinutes === 0) {
            TIMER_STATUS.textContent = "TRAVAIL";
            TIMER_STATUS.classList = "workActive";
            isInBreak = false;
            workCurrentMinutes = workMinutesDuration;
            secondsElapsed =
                workSecondsDuration === 0 ? 60 : workSecondsDuration;
        }
        isInBreak ? breakCurrentMinutes-- : workCurrentMinutes--;
    }
};

window.onload = () => {
    console.log(workMinutesDuration);
    TIMER_DISPLAY.textContent = timeFormatting(
        workMinutesDuration,
        secondsElapsed
    );
};

PLAY_PAUSE_BUTTON.addEventListener("click", () => {
    // The intervalId is returned by the function timerStart to be used in timerReset afterwards
    intervalId = PLAY_PAUSE_BUTTON.hasAttribute("button_active")
        ? timerReset(intervalId)
        : timerStart();
    // The lines bellow are needed in both timerStart and timerReset
    TIMER_DISPLAY.textContent = timeFormatting(
        workCurrentMinutes,
        secondsElapsed
    );
    PLAY_PAUSE_BUTTON.toggleAttribute("button_active");
    PLAY_PAUSE_BUTTON.classList.toggle("fa-play");
    PLAY_PAUSE_BUTTON.classList.toggle("fa-arrow-rotate-left");
});
