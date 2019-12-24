"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var leveldb_1 = require("./leveldb");
var level_ws_1 = __importDefault(require("level-ws"));
var d3 = require("d3");
//Class Metric to create a metric
var Metric = /** @class */ (function () {
    function Metric(username, ts, v) {
        this.username = username;
        this.timestamp = ts;
        this.value = v;
    }
    return Metric;
}());
exports.Metric = Metric;
//Class to handle a metric
var MetricsHandler = /** @class */ (function () {
    //connect to database
    function MetricsHandler(dbPath) {
        this.db = leveldb_1.LevelDB.open(dbPath);
    }
    //close connection to database
    MetricsHandler.prototype.closeDB = function () {
        this.db.close();
    };
    //Add a metric in database
    MetricsHandler.prototype.save = function (key, metrics, callback) {
        var stream = level_ws_1.default(this.db);
        stream.on('error', callback);
        stream.on('close', callback);
        metrics.forEach(function (m) {
            stream.write({ key: "metric:" + key + ":" + m.timestamp, value: m.value });
        });
        stream.end();
    };
    //Get a metric
    MetricsHandler.prototype.get = function (key, callback) {
        var stream = this.db.createReadStream();
        var met = [];
        stream.on('error', callback)
            .on('data', function (data) {
            var username = data.username;
            var _a = data.key.split(":"), _ = _a[0], k = _a[1], timestamp = _a[2];
            var value = data.value;
            if (key != k) {
                console.log("LevelDB error: " + data + " does not match key " + key);
            }
            else {
                met.push(new Metric(username, timestamp, value));
            }
        })
            .on('end', function (err) {
            callback(null, met);
        });
    };
    //Get all metrics
    MetricsHandler.prototype.getAll = function (callback) {
        // Read
        //defining a global Metric array
        var metrics = [];
        var rs = this.db.createReadStream()
            .on('data', function (data) {
            //we split our key with ':'
            var timestamp = data.key.split(':')[2]; //we take ALL
            var metric = new Metric(data.username, timestamp, data.value);
            //console.log(data.key, '=', data.value)
            metrics.push(metric);
            //callback(null, data)
        })
            .on('error', function (err) {
            console.log('Oh my!', err);
            callback(err, null);
        })
            .on('close', function () {
            console.log('Stream closed');
        })
            .on('end', function () {
            callback(null, metrics);
            console.log('Stream ended');
        });
    };
    //Get one metric
    MetricsHandler.prototype.getOne = function (callback) {
        // Read
        //defining a global Metric array
        var metrics = [];
        var rs = this.db.createReadStream()
            .on('data', function (data) {
            //we split our key with ':'
            var timestamp = data.key.split(':')[1]; //we take ONE
            var metric = new Metric(data.username, timestamp, data.value);
            //console.log(data.key, '=', data.value)
            metrics.push(metric);
            //callback(null, data)
        })
            .on('error', function (err) {
            console.log('Oh my!', err);
            callback(err, null);
        })
            .on('close', function () {
            console.log('Stream closed');
        })
            .on('end', function () {
            callback(null, metrics);
            console.log('Stream ended');
        });
    };
    //Delete a specific metric
    MetricsHandler.prototype.delete = function (key, metrics, callback) {
        var stream = level_ws_1.default(this.db);
        stream.on('error', callback);
        stream.on('close', callback);
        var position = 0;
        metrics.forEach(function (m) {
            if (m.timestamp === key) {
                metrics.splice(position, 1);
            }
            position++;
        });
        //stream.write(metrics)
        stream.end();
    };
    //Display metrics on histogram
    MetricsHandler.prototype.histogram = function (key, metrics, callback) {
        var stream = level_ws_1.default(this.db);
        stream.on('error', callback);
        stream.on('close', callback);
        var chartdata = [];
        metrics.forEach(function (m) {
            //chartdata.push(m.timestamp)
        });
        d3.select("body").selectAll("div")
            .data(metrics)
            .enter()
            .append("div")
            .attr("class", "bar")
            .style("height", function (d) {
            return d + "px";
        });
        stream.end();
    };
    return MetricsHandler;
}());
exports.MetricsHandler = MetricsHandler;
