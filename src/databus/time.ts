export function startTicker(cb: () => void, interval: number) {
    let tickId: any = setInterval(cb, interval);

    return () => {
        clearInterval(tickId);
        tickId = 0;
    };
};
