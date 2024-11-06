const fs = require('fs')
const path = require('path')
const stream = require('stream')
stream.s

const filePath = path.resolve(__dirname, 'test.txt')

// 比如10M
const targetSize = 10 * 1024 * 1024

const bufferSize = 1 * 1024 * 1024
const buffer = Buffer.alloc(bufferSize)

const writeStream = fs.createWriteStream(filePath)

writeStream.on('open', () => {
  let totalWritten = 0

  function writeChunk() {
    if (totalWritten >= targetSize) {
      writeStream.end()
      console.log('文件创建完成')
      return
    }

    // 计算剩余需要写入的字节数
    const bytesToWrite = Math.min(bufferSize, targetSize - totalWritten)
    const ok = writeStream.write(buffer.slice(0, bytesToWrite))

    totalWritten += bytesToWrite

    // 如果返回 false，则等待 'drain' 事件
    if (!ok) {
      writeStream.once('drain', writeChunk)
    } else {
      writeChunk()
    }
  }

  // 开始写入
  writeChunk()
})

// fs.writeFile(filePath, buffer, (err) => {
//   if (err) throw err
//   console.log('文件创建成功')
// })

// fs.writeFile(filePath, buffer)
//   .then(() => {
//     console.log('文件创建成功')
//   })
//   .catch((err) => {
//     throw err
//   })
