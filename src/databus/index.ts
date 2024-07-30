import { VERSION, bootstrap, observe, dispose } from './databus';

function wrapDatabusFunction(func: (...args: any) => void): (...args: any) => void {
    return (...args: any) => {
        try {
            func.apply(null, args);
        } catch (error: any) {
            console.error(`Databus: ${error.message}`);
        }
    };
}

export const Databus = {
    VERSION,
    bootstrap: wrapDatabusFunction(bootstrap),
    observe: wrapDatabusFunction(observe),
    dispose: wrapDatabusFunction(dispose),
}
