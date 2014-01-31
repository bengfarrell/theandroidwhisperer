app.service('logcat', function() {
    var self = this;
    var adb = require('adbkit');
    var Connection = require('adbkit/lib/adb/connection');
    self.JS_CONSOLE = "jsconsole";
    self.logFilters = "none";

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
                var pos = { start: entry.indexOf("] \"") +3, end: entry.indexOf("\", source")}
                return entry.substr(pos.start, pos.end - pos.start);
                break;
        }
    }

    self.listen = function(callback) {
        self._callback = callback;
        self._client = adb.createClient();

        self._client.listDevices(function(err, devices) {
            devices.forEach(function(device) {
                self._callback.apply(this, [{event: "status", message: "Device found " + device.id, device: device}]);
                self._openlogcat(device.id);
            });
        });
    }

    self.startADBServer = function() {
        self._client.connection().startServer(self._openlogcat);
    }

    self._openlogcat = function(id) {
        self._client.openLogcat(id, function(err, logcat) {
            if (err) {
                self._callback.apply(this, [{event: "status", message: err.message}]);
            } else {
                 var reader = logcat;
                 reader.on('entry', function(entry) {
                     self.counter ++;
                     var txt = self.filter(self.logFilters, entry.message);
                     if (txt) {
                         self._callback.apply(this, [{type: "log", message: txt, count: self.counter,
                        timestamp: new Date(entry.date).toLocaleTimeString()}]);
                     }
                 });
            }
        });
    }
});