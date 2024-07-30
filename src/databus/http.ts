import { ObserveAttributes } from './agent';
import { getSessionId } from './session';
import { VERSION } from './databus';

export function minify(event: any) {
    return {
        eat: event.emittedAt,
        typ: event.type,
        vti: event.currentTime,
        vwi: event.videoWidth,
        vhe: event.videoHeight,
        pau: event.paused,
        eco: event.errorCode,
    }
}

export function postHttp(endpoint: string, events: any, attributes: ObserveAttributes) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint, true);

    xhr.send(
        JSON.stringify({
            sat: Date.now(),
            sid: getSessionId(),
            mid: attributes.mediaId,
            pid: attributes.playbackId,
            ref: document.referrer,
            ver: VERSION,
            eve: events.map((event: any) => minify(event)),
        })
    );
}
