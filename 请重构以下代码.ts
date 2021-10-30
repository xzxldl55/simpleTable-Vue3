// 请使用优化以下代码：

// 假设已经存在以下3个函数，3个函数的功能都是向服务器上传文件，根据不同的上传类型参数都会不一样。内容的实现这里无须关注
// 请重新设计一个功能，根据不同文件的后缀名，上传到不同的服务器。
// txt 上传到 ftp
// exe 上传到 sftp
// doc 上传到 http

const LOGTAG = 'UPLOADFILE'
const logger = {
  info: console.info.bind(LOGTAG),
  error: console.error.bind(LOGTAG),
  warn: console.warn.bind(LOGTAG),
}

type TSupportType = 'exe' | 'txt' | 'doc'


function uploadByFtp(file: string): Promise<boolean> {
  logger.info(`upload ${file} by ftp`)
  return new Promise(resolve => resolve(true))
}
function uploadBySftp(file: string[], cb: (ret: boolean) => void): void {
  logger.info(`upload ${file} by sftp`)
  cb(true)
}
function uploadByHttp(file: string): boolean {
  logger.info(`upload ${file} by http`)
  return true
}

// 当前可支持文件类型
const supportExt: Array<TSupportType> = ['txt', 'exe', 'doc']

const execUpload = {
  txt: (file: string) => uploadByFtp(file),
  exe: (file: string) => {
    return new Promise((resolve, reject) => {
      uploadBySftp([file], ret => {
        ret ? resolve(true): reject()
      })
    })
  },
  doc: (file: string) => Promise.resolve(uploadByHttp(file)),
}

// 根据文件后缀 执行不同上传方法
const execUploadFn = (file: string): Promise<unknown> => {
  const ext = file.match(/\.(\w+)$/)?.[1] as TSupportType
  return execUpload[ext](file)
}

// 实现如下
export function upload(files: string[]): Promise<boolean> {
  return Promise.all(
    files.filter(file => {
      const ext = file.match(/\.(\w+)$/)?.[1] || ''

      if (supportExt.includes(ext)) {
        return true
      }
      logger.warn(`${file} the file type (${ext}) is not support`)
      return false
    }).map((file: string) => execUploadFn(file)))
    .then(() => {
      logger.info('upload files success')
      return true
    })
}


