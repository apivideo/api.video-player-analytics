import { Agent } from '../../databus/agent';
import { bootstrap, dispose, observe } from '../../databus/databus';

jest.mock('../../databus/agent');

const MOCK_OPTIONS_ENABLED = true;
const MOCK_OPTIONS_BASE_URL = 'https://foo.bar';
const MOCK_OPTIONS_BATCH_REPORT_INTERVAL = 100;

const MOCK_BOOTSTRAP_OPTIONS = {
    enabled: MOCK_OPTIONS_ENABLED,
    baseUrl: MOCK_OPTIONS_BASE_URL,
    batchReportInterval: MOCK_OPTIONS_BATCH_REPORT_INTERVAL,
};

const MOCK_ATTRIBUTES = {
    mediaId: 'vId',
};

describe('Databus', () => {
    const media = document.createElement('video');

    beforeEach(() => {
        dispose();
    });

    describe('dispose()', () => {
        test('should call dispose() on the running agent', () => {
            bootstrap(MOCK_BOOTSTRAP_OPTIONS);
            dispose();

            expect(Agent.prototype.dispose).toHaveBeenCalled();
        });
    });

    describe('observe()', () => {
        test('should throw an error if the agent is not running', () => {
            expect(() => {
                observe(media, MOCK_ATTRIBUTES);
            }).toThrow();
        });

        test('should throw an error if media is invalid', () => {
            expect(() => {
                observe(null, MOCK_ATTRIBUTES);
            }).toThrow();
        });

        test('should throw an error if attributes are invalid', () => {
            expect(() => {
                observe(media, undefined);
            }).toThrow();
        });

        test('should throw an error if attributes#mediaId is invalid', () => {
            expect(() => {
                observe(media, {
                    mediaId: '',
                });
            }).toThrow();
        });

        test('should call observe() on the running agent', () => {
            bootstrap(MOCK_BOOTSTRAP_OPTIONS);
            observe(media, MOCK_ATTRIBUTES);

            expect(Agent.prototype.observe).toHaveBeenCalledWith(media, MOCK_ATTRIBUTES);
        })
    });

    describe('bootstrap()', () => {
        test('should throw an error when the agent is already running', () => {
            expect(() => {
                bootstrap(MOCK_BOOTSTRAP_OPTIONS);
                bootstrap(MOCK_BOOTSTRAP_OPTIONS);
            }).toThrow();
        });

        test('should throw an error if options are invalid', () => {
            expect(() => {
                bootstrap(undefined);
            }).toThrow();
        });

        test('should throw an error if options#enabled is invalid', () => {
            expect(() => {
                // @ts-ignore
                bootstrap({
                    baseUrl: MOCK_OPTIONS_BASE_URL,
                    batchReportInterval: MOCK_OPTIONS_BATCH_REPORT_INTERVAL,
                });
            }).toThrow();
        });

        test('should throw an error if options#baseUrl is invalid', () => {
            expect(() => {
                // @ts-ignore
                bootstrap({
                    enabled: MOCK_OPTIONS_ENABLED,
                    baseUrl: '',
                    batchReportInterval: MOCK_OPTIONS_BATCH_REPORT_INTERVAL,
                });
            }).toThrow();
        });

        test('should throw an error if options#batchReportInterval is invalid', () => {
            expect(() => {
                // @ts-ignore
                bootstrap({
                    enabled: MOCK_OPTIONS_ENABLED,
                    baseUrl: MOCK_OPTIONS_BASE_URL,
                    batchReportInterval: 0,
                });
            }).toThrow();
        });

        test('should bootstrap the agent with the options', () => {
            bootstrap(MOCK_BOOTSTRAP_OPTIONS);

            expect(Agent.prototype.constructor).toHaveBeenCalledWith(MOCK_BOOTSTRAP_OPTIONS);
        });
    });
});
