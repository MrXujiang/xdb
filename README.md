# xdb
基于indexedDB API二次封装的支持过期时间，且采用promise封装的存储库

# 使用
### 1.初始化数据库
``` js
// 连接indexedDB数据库并创建表
var tableName = 'cacheTable'
window.db = xdb.loadDB({ 
  name: 'cacheDB',
  onUpdate(e) {
    console.log('update', e)
    db.createTable(tableName, { keyPath: 'path'})
  },
  onSuccess(e) {
    console.log('success', e)
  }
})
```
### 2.获取表中的数据
``` js
db.get(tableName, 'keypath').then(res => {})
// 或者在async函数中
const res = await db.get(tableName, 'keypath')
```
### 3.添加table行数据
``` js
// 第三个参数为过期时间
db.add(tableName, data, 24 * 60 * 60 * 1000)
```

### 4. 删除数据
``` js
db.del(tableName, keyVal)
```

### 5. 清空table
``` js
db.clear()
```

### 6.更新行
``` js
db.update(tableName, data)
```
