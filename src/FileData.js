/***********************************************
Copyright 2017 - 2018
***********************************************/
/* v1.0.0 */

/*------------------------------------------------
  ファイル管理クラス FileContainer
------------------------------------------------*/
export class FileData {
  constructor (file) {
    if (file instanceof FileData) {
      this.file = file.getFileData
    } else {
      this.file = {
        filename: file && file.filename ? file.filename : '',
        fileType: file && file.fileType ? file.fileType : 'txt',
        type: file && file.type ? file.type : 'text/plain',
        language: file && file.language ? file.language : 'Markdown',
        size: file && file.size ? file.size : 0,
        truncated: file && file.truncated ? file.truncated : false,
        content: file && file.content ? file.content : '',
        description: file && file.description ? file.description : ''
      }
      this.editorData = {}
      if (file && file.filename) this.setAutoType (file.filename)
      // this.monaco = _monaco
      // if (this.monaco) this.editorData.source.model.setValue(this.file.content)
    }
  }

  addEditorData (key, caption, type, model) {
    if(!this.editorData[key]) {
        this.editorData[key] = {
            caption : caption,
            model: model,
            state: null,
            decorations : []
        }
    }
  }

  setLanguage (language) {
    this.file.language = language
  }

  getLanguage () {
    return this.file.language
  }

  setFileType (fileType) {
    this.file.fileType = fileType
  }

  getFileType () {
    return this.file.fileType
  }

  setType (type) {
    this.file.type = type
  }

  getType () {
    return this.file.type
  }

  getSize () {
    return this.file.size
  }

  setContent (content) {
    this.file.content = content
    return content
  }

  getContent () {
    return this.file.content
  }

  setFilename (filename) {
    this.file.filename = filename
    this.setAutoType (filename)
  }

  setAutoType (filename) {
    if (filename.match(/md$/)) {
      this.setType('text/plain')
      this.setLanguage('Markdown')
       return
    } else if (filename.match(/markdown$/)) {
      this.setType('text/plain')
      this.setLanguage('Markdown')
      return
    } else if (filename.match(/txt$/)) {
      this.setType('text/plain')
      this.setLanguage('text')
      return
    } else if (filename.match(/json$/)) {
      this.setType('application/json')
      this.setLanguage('json')
      return
    } else if (filename.match(/ahtml$/)) {
      this.setType('text/html')
      this.setLanguage('ahtml')
      return
    } else if (filename.match(/htm.?$/)) {
      this.setType('text/html')
      this.setLanguage('html')
      return
    } else if (filename.match(/js$/)) {
      this.setType('text/javascript')
      this.setLanguage('JavaScript')
      return
    } else if (filename.match(/es6$/)) {
      this.setType('text/javascript')
      this.setLanguage('JavaScript')
      return
    } else if (filename.match(/scss$/)) {
      this.setType('text/scss')
      this.setLanguage('scss')
      return
    } else if (filename.match(/css$/)) {
      this.setType('text/css')
      this.setLanguage('css')
      return
    }
    return
  }

  getFilename () {
    return this.file.filename
  }

  setDescription (description) {
    this.file.description = description
  }

  getDescription () {
    return this.file.description
  }

  setEditorData (data) {
    this.editorData = data
  }

  getEditorData () {
    return this.editorData
  }

  getFileData () {
    return this.file
  }

  getFileDataJson () {
    return JSON.stringify(this.getFileData())
  }

  remove () {
    this.file.content = ''
    this.file.truncated = true
  }
}
export default FileData

if (typeof window !== 'undefined') {
  !window.FileData && (window.FileData = FileData)
}