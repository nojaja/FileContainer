/***********************************************
Copyright 2017 - 2018
***********************************************/
/* v1.0.0 */

/*------------------------------------------------
  monacoEditorと連携した場合の、ファイル管理クラス EditorFileData
------------------------------------------------*/

import FileData, { FileDataRaw } from './FileData';

export interface EditorDataObj {
  caption: string;
  model: any;
  state: any;
  decorations: any[];
}

export class EditorFileData extends FileData {
  protected editorData: Partial<EditorDataObj>;
  protected monaco: any;

  constructor(file?: Partial<FileDataRaw> | FileData, _monaco?: any) {
    super(file);
    this.editorData = {};
    this.monaco = _monaco;
    if (file && (file as any).filename) {
      this.setEditorDatas((file as any).filename);
      (this.editorData as EditorDataObj).model.setValue(this.file.content);
    }
  }

  addEditorData(caption: string, type: string, model: any): void {
    if (!(this.editorData as EditorDataObj).model) {
      this.editorData = {
        caption: caption,
        model: model,
        state: null,
        decorations: []
      };
    }
    if (!model) (this.editorData as EditorDataObj).model = this.monaco.editor.createModel('', type);
  }

  setContent(content: string): string {
    (this.editorData as EditorDataObj).model.setValue(content);
    return super.setContent(content);
  }

  getContent(): string {
    return (this.editorData as EditorDataObj).model.getValue() || '';
  }

  setEditorData(data: EditorDataObj): boolean {
    const value = data.model.getValue();
    if (this.file.content !== value) {
      this.editorData = data;
      this.file.content = data.model.getValue();
      return true;
    }
    return false;
  }

  getEditorData(): Partial<EditorDataObj> {
    return this.editorData;
  }

  setFilename(filename: string): void {
    super.setFilename(filename);
    this.setEditorDatas(filename);
  }

  setEditorDatas(filename: string): void {
    if (filename.match(/json$/)) {
      this.addEditorData(filename, 'json', (globalThis as any).monaco.editor.createModel('', 'application/json'));
    } else if (filename.match(/ahtml$/)) {
      this.addEditorData(filename, 'html', (globalThis as any).monaco.editor.createModel('', 'text/html'));
    } else if (filename.match(/htm.?$/)) {
      this.addEditorData(filename, 'html', (globalThis as any).monaco.editor.createModel('', 'text/html'));
    } else if (filename.match(/js$/)) {
      this.addEditorData(filename, 'html', (globalThis as any).monaco.editor.createModel('', 'text/javascript'));
    } else if (filename.match(/es6$/)) {
      this.addEditorData(filename, 'javascript', (globalThis as any).monaco.editor.createModel('', 'text/javascript'));
    } else if (filename.match(/scss$/)) {
      this.addEditorData(filename, 'scss', (globalThis as any).monaco.editor.createModel('', 'text/scss'));
    } else if (filename.match(/css$/)) {
      this.addEditorData(filename, 'css', (globalThis as any).monaco.editor.createModel('', 'text/css'));
    } else {
      this.addEditorData(filename, 'txt', (globalThis as any).monaco.editor.createModel('', 'text/plain'));
    }
  }
}

export default EditorFileData;

if (typeof window !== 'undefined') {
  !(window as any).EditorFileData && ((window as any).EditorFileData = EditorFileData);
}
