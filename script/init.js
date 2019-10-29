const fs = require('fs')
const path = require('path')
const { input, output, dict, version } = require('./configuration')

const generateFilesMap = () => {
  const json = {
    version,
    // datetime: new Date().getTime(),
    dicts: {
      //
    },
  }
  const appendJson = p => {
    const stat = fs.statSync(p)
    if (stat.isFile()) {
      if (p.endsWith('.md')) {
        json.dicts[p.replace(input, '')] = fs.readFileSync(p).toString()
      }
    } else if (stat.isDirectory()) {
      const list = fs.readdirSync(p)
      list.forEach(d => {
        appendJson(path.join(p, d))
      })
    }
  }
  appendJson(input)
  fs.writeFileSync(dict, JSON.stringify(json))
}

const checkDirectory = (src, dst, callback) => {
  fs.access(dst, fs.constants.F_OK, err => {
    if (err) {
      fs.mkdirSync(dst)
      callback(src, dst)
    } else {
      callback(src, dst)
    }
  })
}

const copy = (src, dst) => {
  const paths = fs.readdirSync(src) // 同步读取当前目录
  paths.forEach(filePath => {
    const from = `${src}/${filePath}`
    const to = `${dst}/${filePath}`
    fs.stat(from, (err, stats) => {
      // stats  该对象 包含文件属性
      if (err) throw err
      if (stats.isFile()) {
        // 如果是个文件则拷贝
        const readable = fs.createReadStream(from) // 创建读取流
        const writable = fs.createWriteStream(to) // 创建写入流
        readable.pipe(writable)
      } else if (stats.isDirectory()) {
        // 是目录则 递归
        checkDirectory(from, to, copy)
      }
    })
  })
}

const deleteAll = deletePath => {
  let files = []
  if (fs.existsSync(deletePath)) {
    files = fs.readdirSync(deletePath)
    files.forEach(file => {
      const curPath = path.join(deletePath, file)
      if (fs.statSync(curPath).isDirectory()) {
        deleteAll(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(deletePath)
  }
}

deleteAll(output)

checkDirectory(input, output, copy)

generateFilesMap()

// console.info(json)
