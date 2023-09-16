// Main variables declaration
const PLAY_PAUSE_BUTTON = document.getElementById("timerButton");
const TIMER_DISPLAY = document.getElementById("timerDisplay");
let workDuration = 25,
    breakDuration = 5,
    seconds = 0;

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

window.onload = () => {
    TIMER_DISPLAY.textContent = timeFormatting(workDuration, seconds);
};
