export var frequency = function (wallEvent, next) {
    if (wallEvent.type.includes('ERROR')) {
        wallEvent.isUpload = false;
        if (Math.random() < wallEvent.options.frequency) {
            wallEvent.isUpload = true;
        }
    }
    next();
};
//# sourceMappingURL=frequency.js.map