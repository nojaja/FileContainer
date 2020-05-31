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
      gistid: null,
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

  onChangeMetas (callback) {
    this.ev.on('changemeta', callback)
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
    this.ev.emit('changemeta')
  }

  getId () {
    return this.container.id || Date.now() + Math.floor(1e4 + 9e4 * Math.random())
  }

  setGistId (gistid) {
    this.container.id = gistid
    this.ev.emit('changemeta')
  }

  getGistId () {
    return this.container.gistid || null
  }

  setProjectName (projectName) {
    this.container.projectName = projectName
    this.ev.emit('changemeta')
  }

  getProjectName () {
    return this.container.projectName || null
  }

  
  getDirectories ( parentPath = null) {
    // 配列のキーを取り出す
    let ret = {}
    for (let key in this.container.files) {
      if (!this.container.files[key].truncated) {
        if (!parentPath) {
          // let mp = key.match(/((.+?\/)+).+\.[^.]+$/)
          let mp = key.match(/(.+?\/)/)
          if(mp){
            ret[mp[1]] = mp[1]
          }
        } else {
          if(key.indexOf(parentPath)==0 && key.indexOf('/', parentPath.length) > 0 ) {
            const _key = key.substring(parentPath.length)
            let mp = _key.match(/(.+?\/)/)
            if(mp){
              ret[parentPath+mp[1]] = mp[1]
            }
          }
        }
      }
    }
    return Object.keys(ret).map(key => { return {"path": key, "name": ret[key]} });
  }

  getFiles ( parentPath = null, all = false) {
    // 配列のキーを取り出す
    let ret = {}
    for (let key in this.container.files) {
      if (!this.container.files[key].truncated) {
        if (!parentPath && (all || key.indexOf('/')==-1)) { 
          // parentPathを指定してない場合 最上位階層のファイルを返す
          // all = trueの場合は全ファイルを返す
          let mp = key.match(/\/?([^\/]+\.[^.]+)$/)
          if(mp){
            ret[key] = mp[1]
          }
        } else { 
          // parentPathを指定した場合　そのpathの直配下のファイルを返す
          // all = trueの場合は全配下のファイルを返す
          if(key.indexOf(parentPath)==0 && (all || key.indexOf('/', parentPath.length)==-1 )) {
            let mp = key.match(/\/?([^\/]+\.[^.]+)$/)
            if(mp){
              ret[key] = mp[1]
            }
          }
        }
      }
    }
    return Object.keys(ret).map(key => { return {"path": key, "name": ret[key]} });
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

  existFile (filename) {
    if (filename in this.container.files) {
      return true
    }
    return false
  }

  getFile (filename, fileCls, ...constructorParam) {
    let Cls = fileCls || FileData
    if (filename in this.container.files) {
      return new Cls(this.container.files[filename],...constructorParam)
    }
    return null
  }

  getFileRaw (filename) {
    if (filename in this.container.files) {
      return this.container.files[filename]
    }
    return null
  }

  openFile (filename, fileCls, ...constructorParam) {
    if (filename in this.container.files) {
      if (!(filename in this.fileObjects)) {
        this.fileObjects[filename] = this.getFile(filename, fileCls, ...constructorParam)
      }
      this.ev.emit('open', filename, this.fileObjects[filename])
      return this.fileObjects[filename]
    }
    return null
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

  async putFile (file) {
    const filename = file.getFilename()
    this.container.files[filename] = file.getFileData()
    this.container.lastUpdatedTime = new Date().getTime()
    this.ev.emit('change', filename)
    return true
  }

  copyFile (src, dest, mode = 0 ) {
    if (src in this.container.files) {
      if (mode==1 || !dest in this.container.files) {
        let file = new FileData(this.container.files[src])
        file.setFilename(dest)
        this.putFile(file)
        this.container.lastUpdatedTime = new Date().getTime()
        return true
      }
    }
    return false
  }

  renameFile (filename, newName) {
    if (filename in this.container.files) {
      if (!(newName in this.container.files)) {
        let file = new FileData(this.container.files[filename])
        file.setFilename(newName)
        delete this.container.files[filename]
        delete this.fileObjects[filename]
        this.putFile(file)
        this.container.lastUpdatedTime = new Date().getTime()
        return true
      }
    }
    return false
  }

  removeFile (filename) {
    if (filename in this.container.files) {
      let file = new FileData(this.container.files[filename])
      file.remove()
      this.putFile(file)
      delete this.container.files[filename]
      delete this.fileObjects[filename]
      this.container.lastUpdatedTime = new Date().getTime()
      return true
    }
    return false
  }

  clear() {
    this.container = {
      v: 0.1,
      id: '',
      gistid: '',
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

  init () {
    this.clear()
  }

  setPublic (bool) {
    this.container.public = bool
    this.ev.emit('changemeta')
  }

  getPublic () {
    return this.container.public || null
  }

  setDescription (description) {
    this.container.description = description
    this.ev.emit('changemeta')
  }

  getDescription () {
    return this.container.description || null
  }

  setContainer (container) {
    this.container = container
    this.fileObjects = {}
    this.ev.emit('change', null)
    this.ev.emit('changemeta')
  }

  getContainer () {
    return this.container || null
  }

  setContainerJson (container) {
    this.setContainer(JSON.parse(container))
    this.fileObjects = {}
  }

  getContainerJson () {
    return JSON.stringify(this.getContainer())
  }

  getGistData () {
    let files = Object.entries(this.container.files).filter( (x, self) => (!x[1].content == "" && !x[1].filename.match(/^\/public\//))).map(([key, value]) => {
      return [key.replace(/\//g, '%2F'), {"filename": value.filename.replace(/\//g, '%2F'), "content": value.content}]
    })

    let gistdata = {
      description: this.container.projectName ,
      public: this.container.public,
      files: Object.fromEntries(files)
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
    this.ev.emit('changemeta')
  }

  setLastUpdatedTime (lastUpdatedTime) {
    this.container.lastUpdatedTime = lastUpdatedTime
    this.ev.emit('changemeta')
  }
}
export default FileContainer
if (typeof window !== 'undefined') {
  !window.FileContainer && (window.FileContainer = FileContainer)
}