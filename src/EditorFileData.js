/***********************************************
Copyright 2017 - 2018
***********************************************/
/* v1.0.0 */
import FileData from './FileData.js'

/*------------------------------------------------
  monacoEditorと連携した場合の、ファイル管理クラス EditorFileData
------------------------------------------------*/
export class EditorFileData extends FileData {
  constructor (file,_monaco) {
    super(file)
    this.monaco = _monaco
    if (file && file.filename) {
        this.setEditorDatas(file.filename)
        this.editorData.source.model.setValue(this.file.content)
    }
  }

  addEditorData (key, caption, type, model) {
    super.addEditorData(key, caption, type, model) 
    if (!model) this.editorData[key].model = this.monaco.editor.createModel('', type)
  }

  setContent (content) {
    this.editorData.source.model.setValue(content)
    return content
  }

  getContent () {
    this.editorData.source.model.getValue()
  }

  setFilename (filename) {
    super.setFilename(filename)
    this.setEditorDatas (filename)
  }

  setEditorDatas (filename) {
    if (filename.match(/md$/)) {
        this.addEditorData('source', filename, 'txt', monaco.editor.createModel('', 'text/plain'))
        this.addEditorData('html', 'result(html)', 'html', monaco.editor.createModel('', 'text/html'))
    } else if (filename.match(/markdown$/)) {
        this.addEditorData('source', filename, 'txt', monaco.editor.createModel('', 'text/plain'))
        this.addEditorData('html', 'result(html)', 'html', monaco.editor.createModel('', 'text/html'))
    } else if (filename.match(/txt$/)) {
        this.addEditorData('source', filename, 'txt', monaco.editor.createModel('', 'text/plain'))
    } else if (filename.match(/json$/)) {
        this.addEditorData('source', filename, 'json', monaco.editor.createModel('', 'application/json'))
    } else if (filename.match(/ahtml$/)) {
        this.addEditorData('source', filename, 'html', monaco.editor.createModel('', 'text/html'))
        this.addEditorData('dom', 'dom tree', 'json', monaco.editor.createModel('', 'application/json'))
        this.addEditorData('component', 'js component.js', 'javascript', monaco.editor.createModel('', 'text/javascript'))
        this.addEditorData('app', 'js app.js', 'javascript', monaco.editor.createModel('', 'text/javascript'))
        this.addEditorData('html', 'result(html)', 'html', monaco.editor.createModel('', 'text/html'))
    } else if (filename.match(/htm.?$/)) {
        this.addEditorData('source', filename, 'html', monaco.editor.createModel('', 'text/html'))
    } else if (filename.match(/js$/)) {
        this.addEditorData('source', filename, 'html', monaco.editor.createModel('', 'text/javascript'))
        this.addEditorData('compiled', 'JS Compiled', 'javascript', monaco.editor.createModel('', 'text/javascript'))
    } else if (filename.match(/es6$/)) {
        this.addEditorData('source', filename, 'javascript', monaco.editor.createModel('', 'text/javascript'))
        this.addEditorData('compiled', 'JS Compiled', 'javascript', monaco.editor.createModel('', 'text/javascript'))
    } else if (filename.match(/scss$/)) {
        this.addEditorData('source', filename, 'scss', monaco.editor.createModel('', 'text/scss'))
        this.addEditorData('compiled', 'CSS Compiled', 'css', monaco.editor.createModel('', 'text/css'))
    } else if (filename.match(/css$/)) {
        this.addEditorData('source', filename, 'css', monaco.editor.createModel('', 'text/css'))
    }else{
        this.addEditorData('source', filename, 'txt', monaco.editor.createModel('', 'text/css'))
    }
  }

  setEditorData (data) {
    super.setEditorData(data)
    this.file.content = this.editorData.source.model.getValue()
  }
}
export default EditorFileData

if (typeof window !== 'undefined') {
  !window.EditorFileData && (window.EditorFileData = EditorFileData)
}