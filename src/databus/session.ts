import { uuidv4 } from './uuid';


const SESSION_ID_KEY = 'av_databus_sid';

let sessionId: string | null = null;

export function getSessionId() {
    if(!sessionId) {
        if(sessionStorage) {
            sessionId = sessionStorage.getItem(SESSION_ID_KEY) || uuidv4();
            sessionStorage.setItem(SESSION_ID_KEY, sessionId);
        } else {
            sessionId = uuidv4();
        }
    }

    return sessionId;
};
