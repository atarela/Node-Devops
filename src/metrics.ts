import {LevelDB} from './leveldb'
import WriteStream from 'level-ws'

export class Metric {
  public timestamp: string
  public value: number

  constructor(ts: string, v: number) {
    this.timestamp = ts
    this.value = v
  }
}

export class MetricsHandler {
  private db: any 

  constructor(dbPath: string) {
    this.db = LevelDB.open(dbPath)
  }

  public closeDB(){
    this.db.close();
  }

  public save(key: number, metrics: Metric[], callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db)
    stream.on('error', callback)
    stream.on('close', callback)
    metrics.forEach((m: Metric) => {
      stream.write({ key: `metric:${key}:${m.timestamp}`, value: m.value })
    })
    stream.end()
  }

  //get functions
  public get(key: string, callback: (err: Error | null, result?: Metric[]) => void) {
    const stream = this.db.createReadStream()
    var met: Metric[] = []
    
    stream.on('error', callback)
      .on('data', (data: any) => {
        const [_, k, timestamp] = data.key.split(":")
        const value = data.value
        if (key != k) {
          console.log(`LevelDB error: ${data} does not match key ${key}`)
        } else {
          met.push(new Metric(timestamp, value))
        }
      })
      .on('end', (err: Error) => {
        callback(null, met)
      })
  }

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
        let metric: Metric = new Metric(timestamp, data.value)
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

    //get function
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
        let metric: Metric = new Metric(timestamp, data.value)
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
  
  //delete function
    //use method from levelDB called del(to delete for that search del function on inet)
}
