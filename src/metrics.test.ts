import {expect} from 'chai'
import { Metric, MetricsHandler } from './metrics'
import { LevelDB } from "./leveldb"

const a: number = 0
const dbPath: string = 'db_test'
var dbMet: MetricsHandler


describe('Metrics', function () {
  //Prepare database connection
  before(function () {
    LevelDB.clear(dbPath)
    dbMet = new MetricsHandler(dbPath)
  })

  after(function () {
    dbMet.closeDB()
  })

  describe('Metrics', function () {
    it('should save and get', function () {
      expect(a).to.equal(0)
    })
  })

  //Test db#get
  describe('#get', function () {
    it('should get empty array on non existing group', function () {
      //the test of 'get'
      dbMet.get("0", function (err: Error | null, result?: Metric[]) { //0 is a value that we put into database
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.be.empty
      })
    })
  })

  //Test db#getTest run for 1000
  describe('#getTest', function () {
    it('should get empty array on non existing group', function (done) {
      //the test of 'get'
      setTimeout( () =>{
        dbMet.get("0", function (err: Error | null, result?: Metric[]) { //0 is a value that we put into database
          expect(err).to.be.null
          expect(result).to.not.be.undefined
          expect(result).to.be.empty
          done()
        })
      }, 1000 )
    })
  })

})