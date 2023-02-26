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

### 更多产品推荐 | More Production

| name                                                                              | Description                                                                             |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [H5-Dooring](https://github.com/MrXujiang/h5-Dooring)                             | 让 H5 制作像搭积木一样简单, 轻松搭建 H5 页面, H5 网站, PC 端网站, LowCode 平台.         |
| [V6.Dooring](https://github.com/MrXujiang/v6.dooring.public)                      | 可视化大屏解决方案, 提供一套可视化编辑引擎, 助力个人或企业轻松定制自己的可视化大屏应用. |
| [dooring-electron-lowcode](https://github.com/MrXujiang/dooring-electron-lowcode) | 基于 electron 的 H5-Dooring 编辑器桌面端.                                               |
| [xijs](https://github.com/MrXujiang/xijs)                             | 开箱即用的js业务工具库                                                            |
| [DooringX](https://github.com/H5-Dooring/dooringx)                                | 快速高效搭建可视化拖拽平台.                                                             |

## 赞助 | Sponsored

开源不易, 有了您的赞助, 我们会做的更好~

<img src="http://cdn.dooring.cn/dr/WechatIMG2.jpeg" width="180px" />

## 技术反馈和交流群 | Technical feedback and communication

微信：beautifulFront
