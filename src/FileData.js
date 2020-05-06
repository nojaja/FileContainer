/***********************************************
Copyright 2017 - 2018
***********************************************/
/* v1.0.0 */

/*------------------------------------------------
  ファイル管理クラス FileContainer
------------------------------------------------*/
export class FileData {
  // constructor (file,_monaco) {
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
      if (file && file.filename) this.setFilename(file.filename)
      // this.monaco = _monaco
      // if (this.monaco) this.editorData.source.model.setValue(this.file.content)
    }
  }

  addEditorData (key, caption, type, model) {
    this.editorData[key] = {
      caption : caption,
      model: model,
      state: null,
      decorations : []
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
    // if (this.monaco) {
    //   this.editorData.source.model.setValue(content)
    // } else {
    //   this.file.content = content
    // }
    this.file.content = content
    return content
  }

  getContent () {
    // return (this.monaco) ? this.editorData.source.model.getValue() : this.file.content
    return this.file.content
  }

  setFilename (filename) {
    this.file.filename = filename
    if (filename.match(/md$/)) {
      this.setType('text/plain')
      this.setLanguage('Markdown')
      // this.addEditorData('source', filename, 'txt', (this.monaco) ? this.monaco.editor.createModel('', type) : null)
      // this.addEditorData('html', 'result(html)', 'html', (this.monaco) ? this.monaco.editor.createModel('', type) : null)
      return
    }
    if (filename.match(/markdown$/)) {
      this.setType('text/plain')
      this.setLanguage('Markdown')
      // this.addEditorData('source', filename, 'txt', (this.monaco) ? this.monaco.editor.createModel('', type) : null)
      // this.addEditorData('html', 'result(html)', 'html', (this.monaco) ? this.monaco.editor.createModel('', type) : null)
      return
    }
    if (filename.match(/txt$/)) {
      this.setType('text/plain')
      this.setLanguage('text')
      // this.addEditorData('source', filename, 'txt', (this.monaco) ? this.monaco.editor.createModel('', type) : null)
      return
    }
    if (filename.match(/json$/)) {
      this.setType('application/json')
      this.setLanguage('json')
      // this.addEditorData('source', filename, 'json', (this.monaco) ? this.monaco.editor.createModel('', type) : null)
      return
    }
    if (filename.match(/ahtml$/)) {
      this.setType('text/html')
      this.setLanguage('ahtml')
      // this.addEditorData('source', filename, 'html', (this.monaco) ? this.monaco.editor.createModel('', type) : null)
      // this.addEditorData('dom', 'dom tree', 'json', (this.monaco) ? this.monaco.editor.createModel('', type) : null)
      // this.addEditorData('component', 'js component.js', 'javascript', (this.monaco) ? this.monaco.editor.createModel('', type) : null)
      // this.addEditorData('app', 'js app.js', 'javascript', (this.monaco) ? this.monaco.editor.createModel('', type) : null)
      // this.addEditorData('html', 'result(html)', 'html', (this.monaco) ? this.monaco.editor.createModel('', type) : null)
      return
    }
    if (filename.match(/htm.?$/)) {
      this.setType('text/html')
      this.setLanguage('html')
      // this.addEditorData('source', filename, 'html', (this.monaco) ? this.monaco.editor.createModel('', type) : null)
      return
    }
    if (filename.match(/js$/)) {
      this.setType('text/javascript')
      this.setLanguage('JavaScript')
      // this.addEditorData('source', filename, 'javascript', (this.monaco) ? this.monaco.editor.createModel('', type) : null)
      // this.addEditorData('compiled', 'JS Compiled', 'javascript', (this.monaco) ? this.monaco.editor.createModel('', type) : null)
      return
    }
    if (filename.match(/es6$/)) {
      this.setType('text/javascript')
      this.setLanguage('JavaScript')
      // this.addEditorData('source', filename, 'javascript', (this.monaco) ? this.monaco.editor.createModel('', type) : null)
      // this.addEditorData('compiled', 'JS Compiled', 'javascript', (this.monaco) ? this.monaco.editor.createModel('', type) : null)
      return
    }
    if (filename.match(/scss$/)) {
      this.setType('text/scss')
      this.setLanguage('scss')
      // this.addEditorData('source', filename, 'scss', (this.monaco) ? this.monaco.editor.createModel('', type) : null)
      // this.addEditorData('compiled', 'CSS Compiled', 'css', (this.monaco) ? this.monaco.editor.createModel('', type) : null)
      return
    }
    if (filename.match(/css$/)) {
      this.setType('text/css')
      this.setLanguage('css')
      // this.addEditorData('source', filename, 'css', (this.monaco) ? this.monaco.editor.createModel('', type) : null)
      return
    }
    // this.addEditorData('source', filename, 'txt', (this.monaco) ? this.monaco.editor.createModel('', type) : null)
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
    // if (this.monaco) this.file.content = this.editorData.source.model.getValue()
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