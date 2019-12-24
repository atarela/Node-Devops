"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var metrics_1 = require("./metrics");
var leveldb_1 = require("./leveldb");
var a = 0;
var dbPath = 'db_test';
var dbMet;
describe('Metrics', function () {
    //Prepare database connection
    before(function () {
        leveldb_1.LevelDB.clear(dbPath);
        dbMet = new metrics_1.MetricsHandler(dbPath);
    });
    after(function () {
        dbMet.closeDB();
    });
    describe('Metrics', function () {
        it('should save and get', function () {
            dbMet.get("0", function (err, result) {
                //expect(a).to.equal(0)
            });
        });
    });
    //Test db#get
    describe('#GetMetric', function () {
        it('should get empty array', function () {
            //the test of 'get'
            dbMet.get("0", function (err, result) {
                chai_1.expect(err).to.be.null;
                chai_1.expect(result).to.not.be.undefined;
                chai_1.expect(result).to.be.empty;
            });
        });
    });
    //Test db#getTest run for 1000
    describe('#getTest', function () {
        it('should get empty array on non existing group', function (done) {
            //the test of 'get'
            setTimeout(function () {
                dbMet.get("0", function (err, result) {
                    chai_1.expect(err).to.be.null;
                    chai_1.expect(result).to.not.be.undefined;
                    chai_1.expect(result).to.be.empty;
                    done();
                });
            }, 1000);
        });
    });
});
