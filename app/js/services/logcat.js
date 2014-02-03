app.service('logcat', function() {
    var self = this;
    var adb = require('adbkit');
    var Connection = require('adbkit/lib/adb/connection');

    self.JS_CONSOLE = "jsconsole";

    /** current log filter */
    self.logFilters = "none";

    /** num logcat entries */
    self.counter = 0;

    /** limit to shown entries */
    self.limit = 100;

    /** raw/unfiltered logcat entries */
    self.rawEntries = [];

    /** entries */
    self.entries = [];

    /**
     * logcat entry filter
     * @param filters
     * @param entry
     * @returns {*}
     */
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

    /**
     * format logcat entry
     * @param filter
     * @param entry
     * @returns {string}
     */
    self.format = function(filter, entry) {
        switch (filter) {
            case self.JS_CONSOLE:
                var pos = { start: entry.indexOf("] \"") +3, end: entry.indexOf("\", source")}
                return entry.substr(pos.start, pos.end - pos.start);
                break;
        }
    }

    /**
     * add a listener to dispatch logcat events
     * @param callback
     */
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

    /**
     * start the adb server
     */
    self.startADBServer = function() {
        self._client.connection().startServer(self._openlogcat);
    }

    /**
     * open logcat
     * @param id
     * @private
     */
    self._openlogcat = function(id) {
        self._client.openLogcat(id, function(err, logcat) {
            if (err) {
                self._callback.apply(this, [{event: "status", message: err.message}]);
            } else {
                 var reader = logcat;
                 reader.on('entry', function(entry) {
                     self.counter ++;
                     self.rawEntries.push(entry);
                     var txt = self.filter(self.logFilters, entry.message);
                     if (txt) {
                         self.entries.push( {message: txt, count: self.counter,
                             timestamp: new Date(entry.date).toLocaleTimeString()});
                         self._callback.apply(this, [{event: "log" }]);
                     }

                     if (self.entries.length > self.limit) {
                         self.entries.splice(self.entries.length-self.limit, self.entries.length)
                     }
                 });
            }
        });
    }

    /**
     * get entries based on current filter
     * @param limit
     * @returns {Array}
     */
    self.refreshEntries = function() {
        var c = self.rawEntries.length -1;
        self.entries = [];
        while (self.entries.length < self.limit && c > 0) {
            var txt = self.filter(self.logFilters, self.rawEntries[c].message);
            if (txt) {
                self.entries.push({type: "log", message: txt, count: self.counter,
                    timestamp: new Date(self.rawEntries[c].date).toLocaleTimeString()} );
            }
            c--;
        }
        self._callback.apply(this, [{event: "log" }]);
    }
});