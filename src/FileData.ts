/***********************************************
Copyright 2017 - 2018
***********************************************/
/* v1.0.0 */

/*------------------------------------------------
  ファイル管理クラス FileContainer
------------------------------------------------*/

export interface FileDataRaw {
  filename: string;
  fileType: string;
  type: string;
  language: string;
  size: number;
  truncated: boolean;
  content: string;
  description: string;
}

export class FileData {
  protected file: FileDataRaw;

  constructor(file?: Partial<FileDataRaw> | FileData) {
    if (file instanceof FileData) {
      this.file = file.getFileData();
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
      };
      if (file && file.filename) this.setAutoType(file.filename);
    }
  }

  setLanguage(language: string): void {
    this.file.language = language;
  }

  getLanguage(): string {
    return this.file.language;
  }

  setFileType(fileType: string): void {
    this.file.fileType = fileType;
  }

  getFileType(): string {
    return this.file.fileType;
  }

  setType(type: string): void {
    this.file.type = type;
  }

  getType(): string {
    return this.file.type;
  }

  getSize(): number {
    return this.file.size;
  }

  setContent(content: string): string {
    this.file.content = content;
    return content;
  }

  getContent(): string {
    return this.file.content || '';
  }

  setFilename(filename: string): void {
    this.file.filename = filename;
    this.setAutoType(filename);
  }

  setAutoType(filename: string): void {
    if (filename.match(/md$/)) {
      this.setType('text/plain');
      this.setLanguage('Markdown');
      return;
    } else if (filename.match(/markdown$/)) {
      this.setType('text/plain');
      this.setLanguage('Markdown');
      return;
    } else if (filename.match(/txt$/)) {
      this.setType('text/plain');
      this.setLanguage('text');
      return;
    } else if (filename.match(/json$/)) {
      this.setType('application/json');
      this.setLanguage('json');
      return;
    } else if (filename.match(/ahtml$/)) {
      this.setType('text/html');
      this.setLanguage('ahtml');
      return;
    } else if (filename.match(/htm.?$/)) {
      this.setType('text/html');
      this.setLanguage('html');
      return;
    } else if (filename.match(/js$/)) {
      this.setType('text/javascript');
      this.setLanguage('JavaScript');
      return;
    } else if (filename.match(/es6$/)) {
      this.setType('text/javascript');
      this.setLanguage('JavaScript');
      return;
    } else if (filename.match(/scss$/)) {
      this.setType('text/scss');
      this.setLanguage('scss');
      return;
    } else if (filename.match(/css$/)) {
      this.setType('text/css');
      this.setLanguage('css');
      return;
    }
    return;
  }

  getFilename(): string {
    return this.file.filename;
  }

  setDescription(description: string): void {
    this.file.description = description;
  }

  getDescription(): string {
    return this.file.description;
  }

  getFileData(): FileDataRaw {
    return this.file;
  }

  getFileDataJson(): string {
    return JSON.stringify(this.getFileData());
  }

  remove(): void {
    this.file.content = '';
    this.file.truncated = true;
  }
}

export default FileData;

if (typeof window !== 'undefined') {
  !(window as any).FileData && ((window as any).FileData = FileData);
}
