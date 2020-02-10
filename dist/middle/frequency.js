export var frequency = function (event, next) {
    if (event.type.includes("ERROR")) {
        event.isUpload = false;
        if (Math.random() < event.options.frequency) {
            event.isUpload = true;
        }
    }
    next();
};
//# sourceMappingURL=frequency.js.map