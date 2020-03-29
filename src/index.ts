declare global {
  interface Window { xdb: any; }
}

const xdb = (() => {
  let instance:any = null
  let dbName = ''
  let DB = function(args:any) {
    const cfg = {
      name: args.name || 'test',
      version: args.version || 1,
      onSuccess(e:Event) {
        args.onSuccess && args.onSuccess(e)
      },
      onUpdate(e:Event) {
        args.onUpdate && args.onUpdate(e)
      },
      onError(e:Event) {
        args.onError && args.onError(e)
      }
    }
    this.dbName = args.name
    this.request = null
    this.db = null
    // 打开/创建数据库
    this.init = function() {
      if (!window.indexedDB) {
        console.log('你的浏览器不支持该版本')
        return
      }

      let _this = this
      
      this.request = window.indexedDB.open(this.dbName, cfg.version)
      this.request.onerror = function (event:Event) {
        cfg.onError(event)
      }
      
      
      this.request.onsuccess = function (event:Event) {
        _this.db = _this.request.result
        cfg.onSuccess(event)
      }
      
      this.request.onupgradeneeded = function (event:any) {
        _this.db = event.target.result
        cfg.onUpdate(event)
      }
    }

    this.init()

    // 添加表
    this.createTable = function(name:string, opts:any = {}) {
      let objectStore:any
      if (!this.db.objectStoreNames.contains(name)) {
        opts = {
          keyPath: opts.keyPath,
          indexs: Array.isArray(opts.indexs) ? opts.indexs : []
        }

        // indexs = [{
        //   indexName: 'name',
        //   key: 'name',
        //   unique: true
        // }]

        objectStore = this.db.createObjectStore(name, { keyPath: opts.keyPath })

        if(opts.length) {
          opts.indexs.forEach((item:any) => {
            objectStore.createIndex(item.indexName, item.key, { unique: item.unique })
          })
        }
        return objectStore
      }
    }

    // 访问表中数据
    this.get = function(tableName:string, keyPathVal:any) {
      let _this = this
      return new Promise((resolve, reject) => {
        let transaction = this.db.transaction([tableName])
        let objectStore = transaction.objectStore(tableName)
        let request = objectStore.get(keyPathVal)
  
        request.onerror = function(event:Event) {
          reject({status: 500, msg: '事务失败', err: event})
        }
  
        request.onsuccess = function(event:Event) {
          if (request.result) {
            // 判断缓存是否过期
            if(request.result.ex < Date.now()) {
              resolve({status: 200, data: null})
              _this.del(tableName, keyPathVal)
            }else {
              resolve({status: 200, data: request.result})
            }
          } else {
            resolve({status: 200, data: null})
          }
        }
      })
    }

    // 遍历访问表中所有数据
    this.getAll = function(tableName:string) {
      return new Promise((reslove, reject) => {
        let objectStore = this.db.transaction(tableName).objectStore(tableName)
        let result:any = []
        objectStore.openCursor().onsuccess = function (event:any) {
          let cursor = event.target.result
  
          if (cursor) {
            result.push(cursor.value)
            cursor.continue()
          } else {
            reslove({status: 200, data: result})
          }
        }

        objectStore.openCursor().onerror = function (event:Event) {
          reject({status: 500, msg: '事务失败', err: event})
        }
      })
    }

    // 从表中添加一条数据
    this.add = function(tableName:string, row:any, ex:number) {
      return new Promise((reslove, reject) => {
        let request = this.db.transaction([tableName], 'readwrite')
          .objectStore(tableName)
          .add(Object.assign(row, ex ? { ex: Date.now() + ex } : {}))

        request.onsuccess = function (event:Event) {
          reslove({status: 200, msg: '数据写入成功'})
        }

        request.onerror = function (event:Event) {
          reject({status: 500, msg: '数据写入失败', err: event})
        }
      })
      
    }

    // 更新表中的数据
    this.update = function(tableName:string, row:any) {
      return new Promise((reslove, reject) => {
        let request = this.db.transaction([tableName], 'readwrite')
          .objectStore(tableName)
          .put(row)

        request.onsuccess = function (event:Event) {
          reslove({status: 200, msg: '数据更新成功'})
        }

        request.onerror = function (event:Event) {
          reject({status: 500, msg: '数据更新失败', err: event})
        }
      })
    }

    // 删除某条数据
    this.del = function(tableName:string, keyPathVal:any) {
      return new Promise((resolve, reject) => {
        let request = this.db.transaction([tableName], 'readwrite')
          .objectStore(tableName)
          .delete(keyPathVal)

        request.onsuccess = function (event:Event) {
          resolve({status: 200, msg: '数据删除成功'})
        }

        request.onerror = function (event:Event) {
          reject({status: 500, msg: '数据删除失败', err: event})
        }
      })
    }

    // 清空表数据
    this.clear = function(tableName:string) {
      return new Promise((resolve, reject) => {
        let request = this.db.transaction([tableName], 'readwrite')
          .objectStore(tableName)
          .clear()

        request.onsuccess = function (event:Event) {
          resolve({status: 200, msg: '数据表已清空'})
        }

        request.onerror = function (event:Event) {
          reject({status: 500, msg: '数据表清空失败', err: event})
        }
      })
    }
  }

  return {
    loadDB(args:any) {
      if(instance === undefined || dbName !== args.name) {
        instance = new (DB as any)(args)
      }
      return instance
    }
  }

})()

window.xdb = xdb

export default xdb