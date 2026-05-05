/***********************************************
Copyright 2017 - 2018
***********************************************/
/* v1.0.0 */

/*------------------------------------------------
  monacoEditorと連携した場合の、ファイル管理クラス EditorFileData
------------------------------------------------*/

import FileData, { FileDataRaw } from './FileData';

/** エディタデータの構造を表すインターフェース */
export interface EditorDataObj {
  caption: string;
  model: any;
  state: any;
  decorations: any[];
}

/** 拡張子とエディタモードのマッピングエントリ */
interface EditorTypeEntry {
  pattern: RegExp;
  mode: string;
  mimeType: string;
}

/** 拡張子→エディタモードのマッピングテーブル */
const EDITOR_TYPE_MAP: EditorTypeEntry[] = [
  { pattern: /json$/,  mode: 'json',       mimeType: 'application/json' },
  { pattern: /ahtml$/, mode: 'html',       mimeType: 'text/html' },
  { pattern: /htm.?$/, mode: 'html',       mimeType: 'text/html' },
  { pattern: /js$/,    mode: 'html',       mimeType: 'text/javascript' },
  { pattern: /es6$/,   mode: 'javascript', mimeType: 'text/javascript' },
  { pattern: /scss$/,  mode: 'scss',       mimeType: 'text/scss' },
  { pattern: /css$/,   mode: 'css',        mimeType: 'text/css' },
];

/**
 * 処理名: エディタファイルデータクラス
 *
 * 処理概要:
 * Monaco Editor と連携したファイルデータクラス。
 * FileData を継承し、エディタモデル（ITextModel）の管理を追加する。
 *
 * 実装理由:
 * Monaco Editor のモデルとファイルデータを同期させ、
 * エディタ上の編集内容をコンテナへ反映するため。
 */
export class EditorFileData extends FileData {
  /** @protected エディタデータオブジェクト */
  protected editorData: Partial<EditorDataObj>;
  /** @protected Monaco Editor インスタンス */
  protected monaco: any;

  /**
   * 処理名: コンストラクタ
   *
   * 処理概要: ファイルデータとMonaco Editorインスタンスで初期化する。
   *
   * 実装理由: エディタモデルをファイルデータと紐付けて初期化するため。
   * @param {Partial<FileDataRaw> | FileData} [file] - 初期化データ
   * @param {any} [_monaco] - Monaco Editor インスタンス
   */
  constructor(file?: Partial<FileDataRaw> | FileData, _monaco?: any) {
    super(file);
    this.editorData = {};
    this.monaco = _monaco;
    if (file && (file as any).filename) {
      this.setEditorDatas((file as any).filename);
      (this.editorData as EditorDataObj).model.setValue(this.file.content);
    }
  }

  /**
   * 処理名: エディタデータ追加
   *
   * 処理概要:
   * エディタデータが未設定の場合にeditorDataを初期化する。
   * modelがnullの場合はMonaco Editorでモデルを生成する。
   *
   * 実装理由: エディタモデルを一度だけ生成し二重生成を防ぐため。
   * @param {string} caption - キャプション（ファイル名）
   * @param {string} type - エディタモード文字列
   * @param {any} model - Monaco Editor ITextModel
   * @returns {void}
   */
  addEditorData(caption: string, type: string, model: any): void {
    if (!(this.editorData as EditorDataObj).model) {
      this.editorData = { caption, model, state: null, decorations: [] };
    }
    if (!model) {
      (this.editorData as EditorDataObj).model = this.monaco.editor.createModel('', type);
    }
  }

  /**
   * 処理名: コンテンツ設定（オーバーライド）
   *
   * 処理概要: エディタモデルとFileDataの両方にコンテンツを設定する。
   *
   * 実装理由: エディタモデルとFileDataのコンテンツを常に同期させるため。
   * @param {string} content - 設定するコンテンツ
   * @returns {string} 設定したコンテンツ
   */
  setContent(content: string): string {
    (this.editorData as EditorDataObj).model.setValue(content);
    return super.setContent(content);
  }

  /**
   * 処理名: コンテンツ取得（オーバーライド）
   *
   * 処理概要: エディタモデルから現在のコンテンツを取得して返す。
   *
   * 実装理由: エディタ上の最新内容をFileDataより優先して返すため。
   * @returns {string} コンテンツ文字列
   */
  getContent(): string {
    return (this.editorData as EditorDataObj).model.getValue() || '';
  }

  /**
   * 処理名: エディタデータ設定
   *
   * 処理概要:
   * エディタデータを外部から設定する。
   * モデルのコンテンツがFileDataと異なる場合のみ更新してtrueを返す。
   *
   * 実装理由: エディタ側の変更をFileDataへ反映し、不要な更新を避けるため。
   * @param {EditorDataObj} data - 設定するエディタデータ
   * @returns {boolean} 更新が発生した場合はtrue
   */
  setEditorData(data: EditorDataObj): boolean {
    const value = data.model.getValue();
    if (this.file.content === value) return false;
    this.editorData = data;
    this.file.content = data.model.getValue();
    return true;
  }

  /**
   * 処理名: エディタデータ取得
   *
   * 処理概要: 現在のエディタデータオブジェクトを返す。
   *
   * 実装理由: エディタの状態（decorations等）を外部から参照できるようにするため。
   * @returns {Partial<EditorDataObj>} エディタデータオブジェクト
   */
  getEditorData(): Partial<EditorDataObj> {
    return this.editorData;
  }

  /**
   * 処理名: ファイル名設定（オーバーライド）
   *
   * 処理概要: ファイル名を設定し、エディタモードも更新する。
   *
   * 実装理由: ファイル名変更時にエディタのシンタックスモードを連動させるため。
   * @param {string} filename - 設定するファイル名
   * @returns {void}
   */
  setFilename(filename: string): void {
    super.setFilename(filename);
    this.setEditorDatas(filename);
  }

  /**
   * 処理名: エディタデータ自動設定
   *
   * 処理概要: ファイル名の拡張子からエディタモードを判定し、addEditorDataを呼び出す。
   *
   * 実装理由: 拡張子→エディタモードのマッピングをテーブル化し保守性を高めるため。
   * @param {string} filename - 判定対象のファイル名
   * @returns {void}
   */
  setEditorDatas(filename: string): void {
    const entry = EDITOR_TYPE_MAP.find(({ pattern }) => pattern.test(filename));
    const mode = entry ? entry.mode : 'txt';
    const mimeType = entry ? entry.mimeType : 'text/plain';
    this.addEditorData(filename, mode, (globalThis as any).monaco.editor.createModel('', mimeType));
  }
}

export default EditorFileData;

if (typeof window !== 'undefined') {
  !(window as any).EditorFileData && ((window as any).EditorFileData = EditorFileData);
}

