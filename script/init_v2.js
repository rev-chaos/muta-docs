const fs = require('fs')
const path = require('path')
const { input, output, dataNameTpl, dataMenu, dataDefault } = require('./configuration_v2')
const { markdown2html } = require('../src/utils/markdown2html')

const generateFilesMapByLanguage = language => {
  const json = {
    language,
    dicts: {
      //
    },
    menus: '',
    default: '',
  }
  const menuFile = dataMenu.replace('[language]', language)
  if (fs.existsSync(menuFile)) {
    const menus = markdown2html(fs.readFileSync(menuFile).toString())
    json.menus = menus
  }

  const defaultFile = dataDefault.replace('[language]', language)
  if (fs.existsSync(defaultFile)) {
    json.default = defaultFile.replace(input, '')
  }

  const appendJson = p => {
    const stat = fs.statSync(p)
    if (stat.isFile()) {
      if (p.endsWith('.md')) {
        json.dicts[p.replace(input, '')] = {
          title: p.replace(input, ''),
          path: p.replace(input, ''),
          markdown: fs.readFileSync(p).toString(),
        }
      }
    } else if (stat.isDirectory()) {
      const list = fs.readdirSync(p)
      list.forEach(d => {
        appendJson(path.join(p, d))
      })
    }
  }
  appendJson(path.join(input, language))
  const file = dataNameTpl.replace('[language]', language)

  fs.writeFileSync(file, JSON.stringify(json))
  // return file.substr(file.lastIndexOf(path.sep) + 1)
  // return json
}

const generateFilesMap = () => {
  const list = fs.readdirSync(input)
  list.forEach(language => {
    generateFilesMapByLanguage(language)
  })
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
  const paths = fs.readdirSync(src)
  paths.forEach(filePath => {
    const from = `${src}/${filePath}`
    const to = `${dst}/${filePath}`
    fs.stat(from, (err, stats) => {
      if (err) throw err
      if (stats.isFile()) {
        const readable = fs.createReadStream(from)
        const writable = fs.createWriteStream(to)
        readable.pipe(writable)
      } else if (stats.isDirectory()) {
        checkDirectory(from, to, copy)
      }
    })
  })
}

const deleteAll = deletePath => {
  let files = []
  if (fs.existsSync(deletePath)) {
    files = fs.readdirSync(deletePath)
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const curPath = path.join(deletePath, file)
      if (fs.statSync(curPath).isDirectory()) {
        deleteAll(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    }
    fs.rmdirSync(deletePath)
  }
}

deleteAll(output)

checkDirectory(input, output, copy)

generateFilesMap()

// console.info(json)
