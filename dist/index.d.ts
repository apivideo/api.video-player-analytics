import 'whatwg-fetch';
export declare type PlayerAnalyticsOptions = WithCustomOptions | WithMediaUrl;
declare type WithCustomOptions = CustomOptions & CommonOptions;
declare type CustomOptions = {
    videoType: 'live' | 'vod';
    videoId: string;
    pingUrl: string;
};
declare type WithMediaUrl = {
    mediaUrl: string;
} & CommonOptions;
export declare type CommonOptions = {
    metadata?: {
        [name: string]: string;
    };
    sequence?: {
        start: number;
        end?: number;
    };
    onSessionIdReceived?: (sessionId: string) => void;
    onPing?: (ping: PlaybackPingMessage) => void;
};
declare type PingEvent = {
    emitted_at: string;
    type: EventName;
    at?: number;
    from?: number;
    to?: number;
};
declare type PlaybackPingMessage = {
    emitted_at: string;
    session: {
        loaded_at: string;
        video_id?: string;
        live_stream_id?: string;
        referrer: string;
        metadata?: {
            [name: string]: string;
        }[];
        session_id?: string;
        navigator?: NavigatorSettings;
    };
    events: PingEvent[];
};
declare type EventName = 'play' | 'resume' | 'ready' | 'pause' | 'end' | 'seek.forward' | 'seek.backward';
declare type NavigatorSettings = {
    user_agent: string;
    connection: any;
    timing?: any;
};
export declare const isWithMediaUrl: (options: PlayerAnalyticsOptions) => options is WithMediaUrl;
export declare const isWithCustomOptions: (options: PlayerAnalyticsOptions) => options is WithCustomOptions;
export declare class PlayerAnalytics {
    protected sessionId?: string;
    protected options: WithCustomOptions;
    protected sessionIdStorageKey: string;
    protected fetchFunc: ((input: RequestInfo, init?: RequestInit) => Promise<Response>) | undefined;
    private loadedAt;
    private eventsStack;
    private alreadySentEvents;
    private currentTime;
    private pingsSendPaused;
    private pingInterval;
    constructor(options: WithCustomOptions | WithMediaUrl);
    protected static generateSessionIdStorageKey(videoId: string): string;
    play(): Promise<void>;
    resume(): Promise<void>;
    ready(): Promise<void>;
    end(): Promise<void>;
    seek(from: number, to: number): Promise<void>;
    pause(): Promise<void>;
    destroy(): Promise<void>;
    updateTime(time: number): Promise<void>;
    pushEvent(event: PingEvent): void;
    protected parseMediaUrl(mediaUrl: string): CustomOptions;
    private pushRegularEvent;
    private buildPingPayload;
    private sendPing;
    private setSessionId;
}
export {};
