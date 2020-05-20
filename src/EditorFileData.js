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
    this.editorData = {}
    this.monaco = _monaco
    if (file && file.filename) {
        this.setEditorDatas(file.filename)
        this.editorData.model.setValue(this.file.content)
    }
  }

  addEditorData (caption, type, model) {
    if(!this.editorData.model) {
        this.editorData = {
            caption : caption,
            model: model,
            state: null,
            decorations : []
        }
    }
    if (!model) this.editorData.model = this.monaco.editor.createModel('', type)
  }

  setContent (content) {
    this.editorData.model.setValue(content)
    return super.setContent(content)
  }

  getContent () {
    return this.editorData.model.getValue() || ''
  }

  setEditorData (data) {
    const value = data.model.getValue()
    if (this.file.content !== value) {
      this.editorData = data
      this.file.content = data.model.getValue()
      return true
    }
    return false
  }

  getEditorData () {
    return this.editorData
  }

  setFilename (filename) {
    super.setFilename(filename)
    this.setEditorDatas (filename)
  }

  setEditorDatas (filename) {
    if (filename.match(/json$/)) {
        this.addEditorData(filename, 'json', monaco.editor.createModel('', 'application/json'))
    } else if (filename.match(/ahtml$/)) {
        this.addEditorData(filename, 'html', monaco.editor.createModel('', 'text/html'))
    } else if (filename.match(/htm.?$/)) {
        this.addEditorData(filename, 'html', monaco.editor.createModel('', 'text/html'))
    } else if (filename.match(/js$/)) {
        this.addEditorData(filename, 'html', monaco.editor.createModel('', 'text/javascript'))
    } else if (filename.match(/es6$/)) {
        this.addEditorData(filename, 'javascript', monaco.editor.createModel('', 'text/javascript'))
    } else if (filename.match(/scss$/)) {
        this.addEditorData(filename, 'scss', monaco.editor.createModel('', 'text/scss'))
    } else if (filename.match(/css$/)) {
        this.addEditorData(filename, 'css', monaco.editor.createModel('', 'text/css'))
    }else{
        this.addEditorData(filename, 'txt', monaco.editor.createModel('', 'text/plain'))
    }
    console.log('setEditorDatas_2',this.editorData,this.monaco,monaco)
  }

}
export default EditorFileData

if (typeof window !== 'undefined') {
  !window.EditorFileData && (window.EditorFileData = EditorFileData)
}