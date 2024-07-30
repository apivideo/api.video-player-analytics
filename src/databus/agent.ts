import { Queue } from './queue';
import { observeMedia } from './media_observer';
import { postHttp } from './http';
import { startTicker } from './time';
import { uuidv4 } from './uuid';

export interface BootstrapOptions {
    enabled: boolean;
    baseUrl: string;
    batchReportInterval?: number;
}

export interface ObserveAttributes {
    mediaId: string;
    playbackId?: string;
}

export class Agent {
    public observing: boolean;
    public options: BootstrapOptions;
    public attributes: ObserveAttributes | null;
    public queue: Queue;
    public stopObserver: (() => void) | null;
    public stopTicker: (() => void) | null;

    constructor(options: BootstrapOptions) {
        this.options = options;
        this.observing = false;
        this.attributes = null;
        this.queue = new Queue(20);

        this.stopObserver = () => undefined;
        this.stopTicker = () => undefined;
    }

    public observe(media: HTMLVideoElement, attributes: ObserveAttributes) {
        if (!this.options.enabled) return;

        // The media or the attributes have eventually changed meaning that a new video is
        // being loaded -> Dequeue remaining events and report them for the actual video.
        if (this.observing) {
            // TODO: Print a warning instead of reporting an exception because it's legit
            // to reload the same video through the same media and same attributes.
            if (this.attributes && this.attributes.mediaId === attributes.mediaId) {
                throw new Error('The agent received an instruction to observe() again with the same "media" and "attributes"');
            }

            this.dispose();
        }

        this.observing = true;

        // Set the playback-id as soon as a new mediaId is observed.
        // NOTE: Do not allow override from outside -> Internal attribute.
        this.attributes = Object.assign(
            {},
            attributes,
            { playbackId: uuidv4() }
        );

        this.stopObserver = observeMedia(media, (event: any) => {
            const inLastEvent = this.queue.peekLast();

            // If the last queued event is the same type with specific props (e.g. paused) as the upcoming one, the last queued
            // event is upserted. It avoids to queue too much events of the same types like "time_update".
            // NOTE: it does not prevent a repetitive sequence to be queued (e.g pause/play spam).
            if (inLastEvent && inLastEvent.type === event.type && inLastEvent.paused === event.paused) {
                this.queue.upsertLast(event);
                return;
            }

            this.queue.enqueue(event);
        });

        this.stopTicker = startTicker(() => {
            this.report(this.queue.dequeue(), this.attributes!)
        }, this.options.batchReportInterval!);
    }

    public report(events: any, attributes: ObserveAttributes) {
        // Agent disabled or no event to send, exit.
        if (!this.options.enabled || events.length === 0) {
            return;
        }

        postHttp(this.options.baseUrl + '/watch', events, attributes);
    }

    public dispose() {
        if (!this.options.enabled) return;

        if (this.stopObserver) {
            this.stopObserver();
            this.stopObserver = null;
        }

        if (this.stopTicker) {
            this.stopTicker();
            this.stopTicker = null;
        }

        this.report(this.queue.dequeue(), this.attributes!);

        this.observing = false;
    }
}
