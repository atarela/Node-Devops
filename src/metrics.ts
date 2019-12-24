import {LevelDB} from './leveldb'
import WriteStream from 'level-ws'
var d3 = require("d3")

//Class Metric to create a metric
export class Metric {
  public username: string
  public timestamp: string
  public value: number

  constructor(username: string, ts: string, v: number) {
    this.username = username
    this.timestamp = ts
    this.value = v
  }
}

//Class to handle a metric
export class MetricsHandler {
  private db: any 

  //connect to database
  constructor(dbPath: string) {
    this.db = LevelDB.open(dbPath)
  }

  //close connection to database
  public closeDB(){
    this.db.close();
  }

  //Add a metric in database
  public save(key: number, metrics: Metric[], callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db)
    stream.on('error', callback)
    stream.on('close', callback)
    metrics.forEach((m: Metric) => {
      stream.write({ key: `metric:${key}:${m.timestamp}`, value: m.value })
    })
    stream.end()
  }

  //Get a metric
  public get(key: string, callback: (err: Error | null, result?: Metric[]) => void) {
    const stream = this.db.createReadStream()
    var met: Metric[] = []
    
    stream.on('error', callback)
      .on('data', (data: any) => {
        const username = data.username
        const [_, k, timestamp] = data.key.split(":")
        const value = data.value
        if (key != k) {
          console.log(`LevelDB error: ${data} does not match key ${key}`)
        } else {
          met.push(new Metric(username, timestamp, value))
        }
      })
      .on('end', (err: Error) => {
        callback(null, met)
      })
  }

  //Get all metrics
  public getAll(
    callback: (error: Error | null, result: any | null) => void 
   ) {
      // Read
      //defining a global Metric array
      let metrics: Metric[] = []
      const rs = this.db.createReadStream()
      .on('data', function (data) {
        //we split our key with ':'
        let timestamp: string = data.key.split(':')[2]   //we take ALL
        let metric: Metric = new Metric(data.username, timestamp, data.value)
        //console.log(data.key, '=', data.value)
        metrics.push(metric)
        //callback(null, data)
      })
      .on('error', function (err) {
        console.log('Oh my!', err)
        callback(err, null)
      })
      .on('close', function () {
        console.log('Stream closed')
      })
      .on('end', function () {
        callback(null, metrics)
        console.log('Stream ended')
      })
    }

  //Get one metric
  public getOne(
    callback: (error: Error | null, result: any | null) => void 
   ) {
      // Read
      //defining a global Metric array
      let metrics: Metric[] = []
      const rs = this.db.createReadStream()
      .on('data', function (data) {
        //we split our key with ':'
        let timestamp: string = data.key.split(':')[1]   //we take ONE
        let metric: Metric = new Metric(data.username, timestamp, data.value)
        //console.log(data.key, '=', data.value)
        metrics.push(metric)
        //callback(null, data)
      })
      .on('error', function (err) {
        console.log('Oh my!', err)
        callback(err, null)
      })
      .on('close', function () {
        console.log('Stream closed')
      })
      .on('end', function () {
        callback(null, metrics)
        console.log('Stream ended')
      })
    }

    //Delete a specific metric
    public delete(key: string, metrics: Metric[], callback: (error: Error | null, result: any | null) => void) {
      const stream = WriteStream(this.db)
      stream.on('error', callback)
      stream.on('close', callback)
      var position: number = 0
      metrics.forEach((m: Metric) => {
        if(m.timestamp === key) {
          metrics.splice(position, 1)
        }
        position++
      })
      //stream.write(metrics)
      stream.end()
    }

    //Display metrics on histogram
    public histogram(key: number, metrics: Metric[], callback: (error: Error | null) => void) {
      const stream = WriteStream(this.db)
      stream.on('error', callback)
      stream.on('close', callback)
      var chartdata=[];
      metrics.forEach((m: Metric) => {
        //chartdata.push(m.timestamp)
      })
      d3.select("body").selectAll("div")
        .data(metrics)
        .enter()
        .append("div")
        .attr("class", "bar")
        .style("height", function(d){
            return d + "px"
      });
      stream.end()
    }
}
