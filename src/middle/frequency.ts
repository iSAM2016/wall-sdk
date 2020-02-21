import { EventInterface, NextInterface } from '../types';

export const frequency = (wallEvent: EventInterface, next: NextInterface) => {
    if (wallEvent.type && wallEvent.type.includes('ERROR')) {
        wallEvent.isUpload = false;
        if (Math.random() < wallEvent.options.frequency) {
            wallEvent.isUpload = true;
        }
    }
    next();
};
