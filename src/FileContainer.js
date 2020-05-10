/***********************************************
Copyright 2017 - 2018
***********************************************/
/* v1.0.0 */
import FileData from './FileData.js'
import {EventEmitter} from 'events'

/* ------------------------------------------------
  ファイル管理クラス FileContainer
------------------------------------------------ */
export class FileContainer {
  constructor () {
    this.container = {
      v: 0.1,
      id: null,
      files: {},
      public: true,
      createdTime: new Date().getTime(),
      lastUpdatedTime: new Date().getTime(),
      // created_at: '2017-10-29T05:45:01Z',
      // updated_at: '2017-11-14T12:41:14Z',
      projectName: '',
      description: ''
    }
    this.fileObjects = {}
    this.ev = new EventEmitter ()
  }

  onChangeFiles (callback) {
    this.ev.on('change', callback)
  }

  onOpenFile (callback) {
    this.ev.on('open', callback)
  }

  onCloseFile (callback) {
    this.ev.on('close', callback)
  }

  setId (id) {
    this.container.id = id
  }

  getId () {
    return this.container.id
  }

  setProjectName (projectName) {
    this.container.projectName = projectName
  }

  getProjectName () {
    return this.container.projectName
  }

  getFiles ( parentPath = null) {
    // 配列のキーを取り出す
    let ret = []
    for (let key in this.container.files) {
      if (!this.container.files[key].truncated) {
        if (!parentPath) {
          ret.push(key)
        } else {
          if(key.indexOf(parentPath)==0 && key.indexOf('/', parentPath.length)==-1 ) {
            ret.push(key)
          }
        }
      }
    }
    return ret
  }

  getOpenFiles ( parentPath = null) {
    // 配列のキーを取り出す
    let ret = []
    for (let key in this.fileObjects) {
      if (!this.container.files[key].truncated) {
        if (!parentPath) {
          ret.push(key)
        } else {
          if(key.indexOf(parentPath)==0 && key.indexOf('/', parentPath.length)==-1 ) {
            ret.push(key)
          }
        }
      }
    }
    return ret
  }

  getFile (filename, fileCls, ...constructorParam) {
    let Cls = fileCls || FileData
    if (filename in this.container.files) {
      return new Cls(this.container.files[filename],...constructorParam)
    }
    return false
  }

  getFileRaw (filename) {
    if (filename in this.container.files) {
      return this.container.files[filename]
    }
    return false
  }

  openFile (filename, fileCls, ...constructorParam) {
    if (filename in this.container.files) {
      if (!(filename in this.fileObjects)) {
        this.fileObjects[filename] = this.getFile(filename, fileCls, ...constructorParam)
      }
      this.ev.emit('open', filename, this.fileObjects[filename])
      return this.fileObjects[filename]
    }
    return false
  }

  closeFile (filename) {
    if (filename in this.container.files) {
      if (filename in this.fileObjects) {
        const ret = this.fileObjects[filename]
        delete this.fileObjects[filename]
        this.ev.emit('close', filename)
        return ret
      }
    }
    return null
  }

  saveFile (filename) {
    if (filename in this.container.files) {
      if (!(filename in this.fileObjects)) {
        return this.putFile(this.fileObjects[filename])
      }
    }
    return false
  }

  putFile (file) {
    const filename = file.getFilename()
    this.container.files[filename] = file.getFileData()
    this.container.lastUpdatedTime = new Date().getTime()
    this.ev.emit('change', filename)
    return true
  }

  renameFile (filename, newName) {
    if (filename in this.container.files) {
      let file = new FileData(this.container.files[filename])
      file.setFilename(newName)
      delete this.container.files[filename]
      this.putFile(file)
      this.container.lastUpdatedTime = new Date().getTime()
      return true
    }
    return false
  }

  removeFile (filename) {
    if (filename in this.container.files) {
      let file = new FileData(this.container.files[filename])
      file.remove()
      delete this.container.files[filename]
      delete this.fileObjects[filename]
      this.putFile(file)
      this.container.lastUpdatedTime = new Date().getTime()
      return true
    }
    return false
  }

  init () {
    this.container = {
      v: 0.1,
      id: '',
      files: {},
      public: true,
      createdTime: new Date().getTime(),
      lastUpdatedTime: new Date().getTime(),
      // created_at: '2017-10-29T05:45:01Z',
      // updated_at: '2017-11-14T12:41:14Z',
      description: ''
    }
    this.fileObjects = {}
  }

  setPublic (bool) {
    this.container.public = bool
  }

  getPublic () {
    return this.container.public
  }

  setDescription (description) {
    this.container.description = description
  }

  getDescription () {
    return this.container.description
  }

  setContainer (container) {
    this.container = container
    this.fileObjects = {}
    this.ev.emit('change', null)
  }

  getContainer () {
    return this.container
  }

  setContainerJson (container) {
    this.setContainer(JSON.parse(container))
    this.fileObjects = {}
  }

  getContainerJson () {
    return JSON.stringify(this.getContainer())
  }

  getGistData () {
    let gistdata = {
      description: this.container.projectName + '\n' + this.container.description,
      public: this.container.public,
      files: this.container.files
    }
    return gistdata
  }

  getGistJsonData () {
    return JSON.stringify(this.getGistData())
  }

  getCreatedTime () {
    return this.container.createdTime
  }

  getLastUpdatedTime () {
    return this.container.lastUpdatedTime
  }

  setCreatedTime (createdTime) {
    this.container.createdTime = createdTime
  }

  setLastUpdatedTime (lastUpdatedTime) {
    this.container.lastUpdatedTime = lastUpdatedTime
  }
}
export default FileContainer
if (typeof window !== 'undefined') {
  !window.FileContainer && (window.FileContainer = FileContainer)
}