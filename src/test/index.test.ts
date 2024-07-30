import { PlayerAnalytics, PlayerAnalyticsOptions } from '../index';

const FAKE_SESSION_ID = '1234'

describe('player analytics service', () => {

    test('session id is properly handled when no session id in local storage', async () => {
        const videoElt = document.createElement('video');
        const playerAnalytics = new PlayerAnalytics({
            pingUrl: 'https://aa',
            videoId: 'videoid',
            videoType: 'vod'
        });

    });

});