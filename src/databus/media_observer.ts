export enum NativeMediaErrorCode {
    NONE = 0,
    ABORT = 1,
    NETWORK = 2,
    DECODE = 3,
    NO_SUPPORT = 4,
}

export enum NativeMediaEventType {
    LOADED_DATA = 'loadeddata',
    PLAY = 'play',
    PAUSE = 'pause',
    TIME_UPDATE = 'timeupdate',
    ERROR = 'error',
    END = 'ended',
    SEEK = 'seeking',
}

export enum ObserverMediaEventType {
    LOADED_DATA = 1,
    PLAY = 2,
    PAUSE = 3,
    TIME_UPDATE = 4,
    ERROR = 5,
    END = 6,
    SEEK = 7,
    SRC = 8,
};

// A map between native and observer media events to translate native types.
// NOTE: Not generated dynamically to limit mistakes when adding new mappings.
const eventTypeMap: any = {};
eventTypeMap[NativeMediaEventType.LOADED_DATA] = ObserverMediaEventType.LOADED_DATA;
eventTypeMap[NativeMediaEventType.PLAY] = ObserverMediaEventType.PLAY;
eventTypeMap[NativeMediaEventType.PAUSE] = ObserverMediaEventType.PAUSE;
eventTypeMap[NativeMediaEventType.TIME_UPDATE] = ObserverMediaEventType.TIME_UPDATE;
eventTypeMap[NativeMediaEventType.ERROR] = ObserverMediaEventType.ERROR;
eventTypeMap[NativeMediaEventType.END] = ObserverMediaEventType.END;
eventTypeMap[NativeMediaEventType.SEEK] = ObserverMediaEventType.SEEK;

export function observeMedia(media: HTMLVideoElement, cb: (args: any) => void) {
    const emit = (observerEventType: ObserverMediaEventType) => {
        cb({
            emittedAt: Date.now(),
            type: observerEventType,
            currentTime: media.currentTime,
            videoWidth: media.videoWidth,
            videoHeight: media.videoHeight,
            paused: media.paused,
            errorCode: media.error ? media.error.code : NativeMediaErrorCode.NONE,
        });
    };

    const onNativeMediaEvent = (event: Event) => {
        const observerEventType = eventTypeMap[event.type] || undefined;

        if (!observerEventType) {
            return;
        }

        emit(observerEventType);
    };

    const nativeEventTypes = Object.values(NativeMediaEventType);

    // Add event listeners on all entries listed in NativeMediaEventType.
    nativeEventTypes.forEach((nativeEventType) => {
        media.addEventListener(nativeEventType, onNativeMediaEvent);
    });

    // Monitor VideoElement properties mutation.
    const mutationObserver = new MutationObserver((mutationList, observer) => {
        mutationList.forEach((record) => {
            // For user-agent not supporting the attributeFilter option.
            if (record.attributeName === 'src') {
                emit(ObserverMediaEventType.SRC);
            }
        });
    });

    mutationObserver.observe(media, {
        attributes: true,
        attributeFilter: ['src']
    });

    return () => {
        // Remove event listeners on all entries listed in NativeMediaEventType.
        nativeEventTypes.forEach((nativeEventType) => {
            media.removeEventListener(nativeEventType, onNativeMediaEvent);
        });

        mutationObserver.disconnect();
    };
};
