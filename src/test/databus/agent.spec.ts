import { Agent } from '../../databus/agent';
import { postHttp } from '../../databus/http';
import { NativeMediaEventType, ObserverMediaEventType } from '../../databus/media_observer';

jest.mock('../../databus/http');

const MOCK_ENABLED = true;
const MOCK_BASE_URL = 'https://foo.bar';
const MOCK_BATCH_REPORT_INTERVAL = 100;
const MOCK_ATTRIBUTES = { mediaId: 'vId', playbackId: 'pId' };

describe('agent', () => {
    describe('Agent', () => {
        let agent: Agent;
        let media: HTMLVideoElement;

        beforeEach(() => {
            jest.resetAllMocks();
            jest.useRealTimers();

            agent = new Agent({
                enabled: true,
                baseUrl: MOCK_BASE_URL,
                batchReportInterval: MOCK_BATCH_REPORT_INTERVAL,
            });

            media = document.createElement('video');
        });

        describe('observe()', () => {
            test('should do nothing when the agent is disabled', () => {
                agent.options.enabled = false;

                agent.observe(media, MOCK_ATTRIBUTES);

                expect(agent.observing).toBe(false);
            });

            test('should throw an error when observe() is called with the same attributes', () => {
                expect(() => {
                    agent.observe(media, MOCK_ATTRIBUTES);
                    agent.observe(media, MOCK_ATTRIBUTES);
                }).toThrow(Error);
            });

            test('should enqueue an event when new', () => {
                agent.observe(media, MOCK_ATTRIBUTES);

                media.dispatchEvent(new Event(NativeMediaEventType.LOADED_DATA));

                const queueStack = agent.queue.dequeue();

                expect(queueStack.length).toEqual(1);
                expect(queueStack[0].type).toEqual(ObserverMediaEventType.LOADED_DATA);
            });

            test('should enqueue an event when new and with same type and different key props', () => {
                agent.observe(media, MOCK_ATTRIBUTES);

                media.dispatchEvent(new Event(NativeMediaEventType.TIME_UPDATE));
                jest.spyOn(media, 'paused', 'get').mockReturnValue(false);

                media.dispatchEvent(new Event(NativeMediaEventType.TIME_UPDATE));
                jest.spyOn(media, 'paused', 'get').mockReturnValue(true);

                const queueStack = agent.queue.dequeue();

                expect(queueStack.length).toEqual(2);
                expect(queueStack[0].type).toEqual(ObserverMediaEventType.TIME_UPDATE);
                expect(queueStack[1].type).toEqual(ObserverMediaEventType.TIME_UPDATE);
            });

            test('should upsert the last event when existing with the same type and the same key props', () => {
                agent.observe(media, MOCK_ATTRIBUTES);

                media.dispatchEvent(new Event(NativeMediaEventType.LOADED_DATA));

                jest.spyOn(media, 'paused', 'get').mockReturnValue(false);
                media.dispatchEvent(new Event(NativeMediaEventType.TIME_UPDATE));
                media.dispatchEvent(new Event(NativeMediaEventType.TIME_UPDATE));

                const queueStack = agent.queue.dequeue();

                expect(queueStack.length).toEqual(2);
                expect(queueStack[0].type).toEqual(ObserverMediaEventType.LOADED_DATA);
                expect(queueStack[1].type).toEqual(ObserverMediaEventType.TIME_UPDATE);
            });

            test('should report events and attributes at regular interval', () => {
                jest.useFakeTimers();

                agent.report = jest.fn();

                agent.observe(media, MOCK_ATTRIBUTES);

                media.dispatchEvent(new Event(NativeMediaEventType.LOADED_DATA));
                media.dispatchEvent(new Event(NativeMediaEventType.TIME_UPDATE));

                jest.advanceTimersByTime(MOCK_BATCH_REPORT_INTERVAL);

                expect(agent.report).toHaveBeenCalledTimes(1);
            });
        });

        describe('report()', () => {
            test('should do nothing when the agent is disabled', () => {
                agent.options.enabled = false;

                agent.report(['e1', 'e2'], MOCK_ATTRIBUTES);

                expect(postHttp).not.toHaveBeenCalled();
            });

            test('should not send events if none queued', () => {
                agent.report([], MOCK_ATTRIBUTES);

                expect(postHttp).not.toHaveBeenCalled();
            });

            test('should send events', () => {
                const events = ['e1', 'e2'];

                agent.report(events, MOCK_ATTRIBUTES);

                expect(postHttp).toHaveBeenCalledWith(
                    MOCK_BASE_URL + '/watch',
                    events,
                    MOCK_ATTRIBUTES,
                );
            });
        });

        describe('dispose()', () => {
            test('should do nothing when the agent is disabled', () => {
                agent.options.enabled = false;

                agent.dispose();

                expect(postHttp).not.toHaveBeenCalled();
            });

            test('should not report events if none', () => {
                agent.dispose();

                expect(postHttp).not.toHaveBeenCalled();
            });

            test('should stop the observer and the ticker', () => {
                agent.observe(media, MOCK_ATTRIBUTES);
                agent.dispose();

                expect(agent.stopObserver).toEqual(null);
                expect(agent.stopTicker).toEqual(null);
            });
        });
    });
});
