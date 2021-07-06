import { PlayerAnalytics, PlayerAnalyticsOptions } from '../index';

const FAKE_SESSION_ID = '1234'

describe('player analytics service', () => {

    test('session id is properly handled when no session id in local storage', async () => {
        const playerAnalytics = new PlayerAnalyticsTest({
            pingUrl: 'https://aa',
            videoId: 'videoid',
            videoType: 'vod'
        });

        await playerAnalytics.play();
        expect(playerAnalytics.getSessionId()).toBeUndefined();

        await playerAnalytics.updateTime(10);
        await playerAnalytics.pause();
        expect(playerAnalytics.getSessionId()).toEqual(FAKE_SESSION_ID);

        await playerAnalytics.pause();
        expect(playerAnalytics.sentPings).toHaveLength(2);
        expect(JSON.parse(playerAnalytics.sentPings[0].payload.body).session).not.toHaveProperty('session');
        expect(JSON.parse(playerAnalytics.sentPings[1].payload.body).session).toHaveProperty('session_id');
        expect(window.sessionStorage.getItem(PlayerAnalyticsTest.generateSessionIdStorageKey('videoid'))).toEqual(FAKE_SESSION_ID);

    });

    test('session id is properly handled when no session id in cache', async () => {
        window.sessionStorage.setItem(PlayerAnalyticsTest.generateSessionIdStorageKey('videoId'), FAKE_SESSION_ID);

        const playerAnalytics = new PlayerAnalyticsTest({
            pingUrl: 'https://aa',
            videoId: 'videoId',
            videoType: 'vod',
            onPing: (a) => {
                throw new Error('');
            }
        });

        await playerAnalytics.play();
        await playerAnalytics.pause();

        expect(playerAnalytics.sentPings).toHaveLength(1);
        expect(JSON.parse(playerAnalytics.sentPings[0].payload.body).session.session_id).toEqual(FAKE_SESSION_ID);
    });

    test('seek forward', async () => {
        const playerAnalytics = new PlayerAnalyticsTest({
            pingUrl: 'https://aa',
            videoId: 'videoId',
            videoType: 'vod'
        });

        await playerAnalytics.seek(10, 50);
        await playerAnalytics.pause();
        expect(playerAnalytics.sentPings).toHaveLength(1);
        expect(JSON.parse(playerAnalytics.sentPings[0].payload.body).events).toHaveLength(2);
        expect(JSON.parse(playerAnalytics.sentPings[0].payload.body).events[0]).toMatchObject({
            type: 'seek.forward',
            from: 10,
            to: 50
        });
        expect(JSON.parse(playerAnalytics.sentPings[0].payload.body).events[1].type).toEqual('pause');
    });


    test('seek backward', async () => {
        const playerAnalytics = new PlayerAnalyticsTest({
            pingUrl: 'https://aa',
            videoId: 'videoId',
            videoType: 'vod'
        });

        await playerAnalytics.seek(50, 10);
        await playerAnalytics.pause();
        expect(playerAnalytics.sentPings).toHaveLength(1);
        expect(JSON.parse(playerAnalytics.sentPings[0].payload.body).events).toHaveLength(2);
        expect(JSON.parse(playerAnalytics.sentPings[0].payload.body).events[0]).toMatchObject({
            type: 'seek.backward',
            from: 50,
            to: 10
        });
        expect(JSON.parse(playerAnalytics.sentPings[0].payload.body).events[1].type).toEqual('pause');
    });

    test('parse valid vod media url', () => {
        const playerAnalytics = new PlayerAnalyticsTest({
            mediaUrl: 'https://cdn.api.video/vod/vi5oDagRVJBSKHxSiPux5rYD/hls/manifest.m3u8',
        });

        expect(playerAnalytics.getOptions()).toMatchObject({
            videoId: 'vi5oDagRVJBSKHxSiPux5rYD',
            videoType: 'vod',
            pingUrl: 'https://collector.api.video/vod'
        });
    });

    test('parse valid live media url', () => {
        const playerAnalytics = new PlayerAnalyticsTest({
            mediaUrl: 'https://live.api.video/li6Anin2CG1eWirOCBnvYDzI.m3u8',
        });

        expect(playerAnalytics.getOptions()).toMatchObject({
            videoId: 'li6Anin2CG1eWirOCBnvYDzI',
            videoType: 'live',
            pingUrl: 'https://collector.api.video/live'
        });
    });

    test('parse invalid  media url', () => {
        expect(() => new PlayerAnalyticsTest({
            mediaUrl: 'https://mydomain/video.m3u8',
        })).toThrowError("The media url doesn't look like an api.video URL.");
    });

    test('user metadata are properly transformed', async () => {
        const playerAnalytics = new PlayerAnalyticsTest({
            mediaUrl: 'https://live.api.video/li6Anin2CG1eWirOCBnvYDzI.m3u8',
            metadata: {
                key1: 'value1',
                key2: 'value2'
            }
        });

        await playerAnalytics.play();
        await playerAnalytics.pause();

        expect(playerAnalytics.sentPings).toHaveLength(1);
        expect(JSON.parse(playerAnalytics.sentPings[0].payload.body).session.metadata).toEqual([{ key1: 'value1' }, { key2: 'value2' }]);
    });
});

class PlayerAnalyticsTest extends PlayerAnalytics {
    public sentPings: any[] = [];
    constructor(options: PlayerAnalyticsOptions) {
        super(options);

        this.fetchFunc = (a, b): Promise<Response> => {
            this.sentPings.push({ url: a, payload: b });
            return new Promise((resolve, reject) => {
                const response: Response = {
                    ...(new Response()),
                    json: () => {
                        return new Promise((res, rej) => res({ session: FAKE_SESSION_ID }))
                    }
                };

                resolve(response);
            });
        }
    }

    public static generateSessionIdStorageKey(videoId: string) {
        return PlayerAnalytics.generateSessionIdStorageKey(videoId);
    }

    public getSessionId() {
        return this.sessionId;
    }

    public getOptions() {
        return this.options;
    }

}