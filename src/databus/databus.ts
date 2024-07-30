import { Agent, BootstrapOptions, ObserveAttributes } from './agent';

let agent: Agent | null;

export function bootstrap(options?: BootstrapOptions) {
    if (agent) {
        throw new Error('The agent is already running, call dispose() to bootstrap()');
    }

    if (!options || typeof options !== 'object') {
        throw new Error('The provided "options" are invalid, expect an object to bootstrap()');
    }

    if (!options.hasOwnProperty('enabled')) {
        throw new Error('The provided "options#enabled" is invalid, expect a boolean to bootstrap()');
    }

    if (!options.hasOwnProperty('baseUrl') || !options.baseUrl) {
        throw new Error('The provided "options#baseUrl" is invalid, expect a string to bootstrap()');
    }

    if (!options.hasOwnProperty('batchReportInterval') || !options.batchReportInterval) {
        throw new Error('The provided "options#batchReportInterval" is invalid, expect a positive integer to bootstrap()');
    }

    agent = new Agent(options);
}

export function observe(media: HTMLVideoElement | null, attributes?: ObserveAttributes) {
    if (!agent) {
        throw new Error('The agent is not running, call bootstrap() to observe()');
    }

    if (!(media instanceof HTMLMediaElement)) {
        throw new Error('The provided "media" is invalid, expect a HTMLMediaElement to observe()');
    }

    if (!attributes || typeof attributes !== 'object') {
        throw new Error('The provided "attributes" are invalid, expect an object to observe()');
    }

    if (!attributes.hasOwnProperty('mediaId') || !attributes.mediaId) {
        throw new Error('The provided "attributes#mediaId" is invalid, expect a a string to observe()');
    }

    agent.observe(media, attributes);
}

export function dispose() {
    // TODO: Print a warning in case of no agent, no need to throw an error.
    if (!agent) {
        return;
    }

    agent.dispose();
    agent = null;
}

export const VERSION = '0.1.0';
