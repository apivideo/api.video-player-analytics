import { NativeMediaEventType, observeMedia, ObserverMediaEventType } from '../../databus/media_observer';

// Variables and functions used to ease test writing.
const MOCK_DATE_NOW = 123;
const MOCK_CURRENT_TIME = 0.1;
const MOCK_VIDEO_WIDTH = 426;
const MOCK_VIDEO_HEIGHT = 240;
const MOCK_PAUSED = true;
const MOCK_ERROR_CODE = 0;

const createMockEvent = (observerEventType: ObserverMediaEventType) => {
    return {
        emittedAt: MOCK_DATE_NOW,
        type: observerEventType,
        currentTime: MOCK_CURRENT_TIME,
        videoWidth: MOCK_VIDEO_WIDTH,
        videoHeight: MOCK_VIDEO_HEIGHT,
        paused: MOCK_PAUSED,
        errorCode: MOCK_ERROR_CODE,
    }
};

describe('observe', () => {
    let media: HTMLVideoElement;

    beforeEach(() => {
        jest.spyOn(Date, 'now').mockReturnValue(MOCK_DATE_NOW);

        media = document.createElement('video');
        jest.spyOn(media, 'addEventListener');
        jest.spyOn(media, 'removeEventListener');
        jest.spyOn(media, 'currentTime', 'get').mockReturnValue(MOCK_CURRENT_TIME);
        jest.spyOn(media, 'videoWidth', 'get').mockReturnValue(MOCK_VIDEO_WIDTH);
        jest.spyOn(media, 'videoHeight', 'get').mockReturnValue(MOCK_VIDEO_HEIGHT);
        jest.spyOn(media, 'paused', 'get').mockReturnValue(MOCK_PAUSED);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('observeMedia()', () => {
        test('should not invoke the callback when the event is not supported', () => {
            const cb = jest.fn();

            observeMedia(media, cb);
            media.dispatchEvent(new Event('unsupported_event'));

            expect(cb).not.toHaveBeenCalled();
        });

        test('should invoke the callback when \'loadeddata\' event is dispatched', () => {
            const cb = jest.fn();

            observeMedia(media, cb);
            media.dispatchEvent(new Event(NativeMediaEventType.LOADED_DATA));

            expect(cb).toHaveBeenCalledWith(
                createMockEvent(ObserverMediaEventType.LOADED_DATA)
            );
        });

        test('should invoke the callback when \'play\' media event is dispatched', () => {
            const cb = jest.fn();

            observeMedia(media, cb);
            media.dispatchEvent(new Event(NativeMediaEventType.PLAY));

            expect(cb).toHaveBeenCalledWith(
                createMockEvent(ObserverMediaEventType.PLAY)
            );
        });

        test('should invoke the callback when \'pause\' media event is dispatched', () => {
            const cb = jest.fn();

            observeMedia(media, cb);
            media.dispatchEvent(new Event(NativeMediaEventType.PAUSE));

            expect(cb).toHaveBeenCalledWith(
                createMockEvent(ObserverMediaEventType.PAUSE)
            );
        });

        test('should invoke the callback when \'time_update\' media event is dispatched', () => {
            const cb = jest.fn();

            observeMedia(media, cb);
            media.dispatchEvent(new Event(NativeMediaEventType.TIME_UPDATE));

            expect(cb).toHaveBeenCalledWith(
                createMockEvent(ObserverMediaEventType.TIME_UPDATE)
            );
        });

        test('should invoke the callback when \'error\' media event is dispatched', () => {
            const cb = jest.fn();

            observeMedia(media, cb);
            media.dispatchEvent(new Event(NativeMediaEventType.ERROR));

            expect(cb).toHaveBeenCalledWith(
                createMockEvent(ObserverMediaEventType.ERROR)
            );
        });

        test('should invoke the callback when \'end\' media event is dispatched', () => {
            const cb = jest.fn();

            observeMedia(media, cb);
            media.dispatchEvent(new Event(NativeMediaEventType.END));

            expect(cb).toHaveBeenCalledWith(
                createMockEvent(ObserverMediaEventType.END)
            );
        });

        test('should invoke the callback when \'seek\' media event is dispatched', () => {
            const cb = jest.fn();

            observeMedia(media, cb);
            media.dispatchEvent(new Event(NativeMediaEventType.SEEK));

            expect(cb).toHaveBeenCalledWith(
                createMockEvent(ObserverMediaEventType.SEEK)
            );
        });
    });
});
