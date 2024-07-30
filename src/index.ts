import 'whatwg-fetch';
import { Databus } from './databus';

const PLAYBACK_PING_DELAY = 5 * 1000;

export type PlayerAnalyticsOptions = WithCustomOptions | WithMediaUrl;

type WithCustomOptions = CustomOptions & CommonOptions;

type CustomOptions = {
    videoType: 'live' | 'vod';
    videoId: string;
    pingUrl: string;
};

type WithMediaUrl = {
    mediaUrl: string;
} & CommonOptions;

export type CommonOptions = {
    metadata?: { [name: string]: string };
    sequence?: {
        start: number;
        end?: number;
    };
}

export const isWithMediaUrl = (options: PlayerAnalyticsOptions): options is WithMediaUrl => {
    return !!(options as WithMediaUrl).mediaUrl;
}

export const isWithCustomOptions = (options: PlayerAnalyticsOptions): options is WithCustomOptions => {
    const asWithCustomOptions = options as WithCustomOptions;
    return !!asWithCustomOptions.pingUrl
        && !!asWithCustomOptions.videoId
        && !!asWithCustomOptions.videoType;
}


export class PlayerAnalytics {
    protected options: WithCustomOptions;


    constructor(options: WithCustomOptions | WithMediaUrl) {
        if (!isWithCustomOptions(options) && !isWithMediaUrl(options)) {
            throw new Error('Option must contains mediaUrl or pingUrl, videoId and videoType');
        }
        if (isWithMediaUrl(options)) {
            this.options = {
                ...options,
                ...PlayerAnalytics.parseMediaUrl(options.mediaUrl),
            }
        } else {
            this.options = options;
        }

        Databus.bootstrap({
            enabled: true,
            baseUrl: this.options.pingUrl,
            batchReportInterval: PLAYBACK_PING_DELAY,
        });

    }

    public static parseMediaUrl(mediaUrl: string): CustomOptions {
        const re = /https:\/.*[\/](vod|live)([\/]|[\/\.][^\/]*[\/])([^\/^\.]*)[\/\.].*/gm;
        const parsed = re.exec(mediaUrl);

        if (!parsed || parsed.length < 3 || !parsed[1] || !parsed[3]) {
            throw new Error("The media url doesn't look like an api.video URL.");
        }
        if (['vod', 'live'].indexOf(parsed[1]) === -1) {
            throw new Error("Can't termine if media URL is vod or live.");
        }

        const videoType = parsed[1] as 'vod' | 'live';
        const videoId = parsed[3];

        return {
            pingUrl: 'https://collector.api.video',
            videoId,
            videoType,
        }

    }

    public dispose() {
        Databus.dispose();
    }


    public ovbserveMedia(media: HTMLVideoElement) {
        Databus.observe(media, {
            mediaId: this.options.videoId,
        });
    }

}
