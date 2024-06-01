
export const DEBOUNCE_TIMEOUT = 321;

export const debounceAction = (action, debounceTimeout = DEBOUNCE_TIMEOUT) => {
    const timers = {};

    return (...args) => {
        const key = JSON.stringify(args);
        console.log("Ключ в дебаунсере: " + key);
        console.log("Таймер в дебаунсере: " + timers[key]);
        if (timers[key]) {
            clearTimeout(timers[key]);
            return { type: "DEBOUNCED"}
        } else {
            timers[key] = setTimeout(() => {
                timers[key] = undefined
            }, debounceTimeout);
            return action(...args)
        }
    };
};
