app.service('logcat', function() {
    var self = this;

    self.JS_CONSOLE = "jsconsole";

    self.counter = 0;

    self.filter = function(filters, entry) {
        if (typeof filters === "string") {
            filters = [filters];
        }

        for (var filter in filters) {
            switch (filters[filter]) {
                case self.JS_CONSOLE:
                    if (entry.indexOf('[INFO:CONSOLE') != -1) {
                        return self.format(filters[filter], entry);
                    }
                    break;

                case "none":
                    return entry;
                    break;
            }
        }
        return null;
    }

    self.format = function(filter, entry) {
        switch (filter) {
            case self.JS_CONSOLE:
                var rg = /("(.*?)")/g;
                var f = rg.exec(entry)[0];
                return f.substr(1, f.length-2);
                break;
        }
    }

    self.listen = function(filters, callback) {
        var adb = require('adbkit');
        var client = adb.createClient();

        client.listDevices(function(err, devices) {
            devices.forEach(function(device) {
                callback.apply(this, [{event: "status", message: "device found", device: device}]);
                client.openLogcat(device.id, function(data, logcat) {
                    var reader = logcat;
                    reader.on('entry', function(entry) {
                        self.counter ++;
                        var txt = self.filter(filters, entry.message);
                        if (txt) {
                            callback.apply(this, [{type: "log", message: txt, count: self.counter,
                                timestamp: new Date(entry.date).toLocaleTimeString()}]);
                        }
                    });
                });
            });
        });
    }
});