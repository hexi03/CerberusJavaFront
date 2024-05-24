

export const DEBOUNCE_TIMEOUT = 321;

export const debounceAction = (action, debounceTimeout = DEBOUNCE_TIMEOUT) => {
    const timers = {};

    return (...args) => {
        const key = JSON.stringify(args);

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
