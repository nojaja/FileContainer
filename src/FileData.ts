/***********************************************
Copyright 2017 - 2018
***********************************************/
/* v1.0.0 */

/*------------------------------------------------
  ファイルデータクラス FileData
------------------------------------------------*/

/** ファイルの生データ構造を表すインターフェース */
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

/** ファイル拡張子とMIMEタイプ・言語のマッピングエントリ */
interface TypeEntry {
  pattern: RegExp;
  type: string;
  language: string;
}

/** MIMEタイプ定数 */
const MIME_TEXT_PLAIN = 'text/plain';
/** デフォルト言語定数 */
const LANG_MARKDOWN = 'Markdown';

/** デフォルトのFileDataRaw値 */
const DEFAULT_FILE_DATA: FileDataRaw = {
  filename: '', fileType: 'txt', type: MIME_TEXT_PLAIN,
  language: LANG_MARKDOWN, size: 0, truncated: false, content: '', description: '',
};

/** 拡張子とMIMEタイプ・言語のマッピングテーブル */
const AUTO_TYPE_MAP: TypeEntry[] = [
  { pattern: /md$/,       type: MIME_TEXT_PLAIN,    language: LANG_MARKDOWN },
  { pattern: /markdown$/, type: MIME_TEXT_PLAIN,    language: LANG_MARKDOWN },
  { pattern: /txt$/,      type: MIME_TEXT_PLAIN,    language: 'text' },
  { pattern: /json$/,     type: 'application/json', language: 'json' },
  { pattern: /ahtml$/,    type: 'text/html',        language: 'ahtml' },
  { pattern: /htm.?$/,    type: 'text/html',        language: 'html' },
  { pattern: /js$/,       type: 'text/javascript',  language: 'JavaScript' },
  { pattern: /es6$/,      type: 'text/javascript',  language: 'JavaScript' },
  { pattern: /scss$/,     type: 'text/scss',        language: 'scss' },
  { pattern: /css$/,      type: 'text/css',         language: 'css' },
];

/**
 * 処理名: ファイルデータ管理クラス
 *
 * 処理概要:
 * 単一ファイルのメタデータ（ファイル名・MIMEタイプ・言語・コンテンツ等）を保持・操作するクラス。
 *
 * 実装理由:
 * ファイルの属性を一元管理し、拡張子によるMIMEタイプ自動判定を提供するため。
 */
export class FileData {
  /** @protected ファイルの生データ */
  protected file: FileDataRaw;

  /**
   * 処理名: コンストラクタ
   *
   * 処理概要: ファイルデータオブジェクトまたはFileDataインスタンスから初期化する。
   *
   * 実装理由: 生オブジェクトとFileDataインスタンスの両方に対応するため。
   * @param {Partial<FileDataRaw> | FileData} [file] - 初期化データ
   */
  constructor(file?: Partial<FileDataRaw> | FileData) {
    if (file instanceof FileData) {
      this.file = file.getFileData();
      return;
    }
    const src = Object.fromEntries(
      Object.entries(file || {}).filter(function(entry) { return entry[1] !== undefined; })
    );
    this.file = Object.assign({}, DEFAULT_FILE_DATA, src) as FileDataRaw;
    if (this.file.filename) this.setAutoType(this.file.filename);
  }

  /**
   * 処理名: 言語設定
   *
   * 処理概要: ファイルの言語識別子を設定する。
   *
   * 実装理由: エディタでのシンタックスハイライト言語を外部から変更できるようにするため。
   * @param {string} language - 言語識別子
   * @returns {void}
   */
  setLanguage(language: string): void {
    this.file.language = language;
  }

  /**
   * 処理名: 言語取得
   *
   * 処理概要: ファイルの言語識別子を返す。
   *
   * 実装理由: エディタ側が現在の言語設定を参照できるようにするため。
   * @returns {string} 言語識別子
   */
  getLanguage(): string {
    return this.file.language;
  }

  /**
   * 処理名: ファイルタイプ設定
   *
   * 処理概要: ファイルタイプ（拡張子ベースの短縮形）を設定する。
   *
   * 実装理由: ファイルタイプを独立して管理するため。
   * @param {string} fileType - ファイルタイプ文字列
   * @returns {void}
   */
  setFileType(fileType: string): void {
    this.file.fileType = fileType;
  }

  /**
   * 処理名: ファイルタイプ取得
   *
   * 処理概要: ファイルタイプを返す。
   *
   * 実装理由: ファイルタイプを外部から参照できるようにするため。
   * @returns {string} ファイルタイプ
   */
  getFileType(): string {
    return this.file.fileType;
  }

  /**
   * 処理名: MIMEタイプ設定
   *
   * 処理概要: ファイルのMIMEタイプを設定する。
   *
   * 実装理由: HTTP配信時のContent-Typeに使用するMIMEタイプを管理するため。
   * @param {string} type - MIMEタイプ文字列
   * @returns {void}
   */
  setType(type: string): void {
    this.file.type = type;
  }

  /**
   * 処理名: MIMEタイプ取得
   *
   * 処理概要: ファイルのMIMEタイプを返す。
   *
   * 実装理由: 配信時のContent-Type設定に利用するため。
   * @returns {string} MIMEタイプ
   */
  getType(): string {
    return this.file.type;
  }

  /**
   * 処理名: ファイルサイズ取得
   *
   * 処理概要: ファイルサイズ（バイト）を返す。
   *
   * 実装理由: ファイルサイズ情報を外部から参照できるようにするため。
   * @returns {number} サイズ（バイト）
   */
  getSize(): number {
    return this.file.size;
  }

  /**
   * 処理名: コンテンツ設定
   *
   * 処理概要: ファイルのテキストコンテンツを設定し、設定値を返す。
   *
   * 実装理由: コンテンツを更新しつつ設定値を呼び出し元へ返すため。
   * @param {string} content - 設定するコンテンツ文字列
   * @returns {string} 設定したコンテンツ
   */
  setContent(content: string): string {
    this.file.content = content;
    return content;
  }

  /**
   * 処理名: コンテンツ取得
   *
   * 処理概要: ファイルのテキストコンテンツを返す。コンテンツが未設定の場合は空文字を返す。
   *
   * 実装理由: null/undefined を返さず常に文字列を返すことで呼び出し側の安全性を確保するため。
   * @returns {string} コンテンツ文字列
   */
  getContent(): string {
    return this.file.content || '';
  }

  /**
   * 処理名: ファイル名設定
   *
   * 処理概要: ファイル名を設定し、拡張子に基づいてMIMEタイプと言語を自動更新する。
   *
   * 実装理由: ファイル名変更時にMIMEタイプ・言語を常に整合させるため。
   * @param {string} filename - 設定するファイル名
   * @returns {void}
   */
  setFilename(filename: string): void {
    this.file.filename = filename;
    this.setAutoType(filename);
  }

  /**
   * 処理名: 自動タイプ設定
   *
   * 処理概要: ファイル名の拡張子からMIMEタイプと言語識別子を自動判定して設定する。
   *
   * 実装理由: 拡張子ごとのMIMEタイプをテーブルで一元管理し、
   * 分岐なしで判定できる設計にすることで保守性を高めるため。
   * @param {string} filename - 判定対象のファイル名
   * @returns {void}
   */
  setAutoType(filename: string): void {
    const entry = AUTO_TYPE_MAP.find(({ pattern }) => pattern.test(filename));
    if (entry) {
      this.setType(entry.type);
      this.setLanguage(entry.language);
    }
  }

  /**
   * 処理名: ファイル名取得
   *
   * 処理概要: 設定されているファイル名を返す。
   *
   * 実装理由: ファイル名を外部から参照できるようにするため。
   * @returns {string} ファイル名
   */
  getFilename(): string {
    return this.file.filename;
  }

  /**
   * 処理名: 説明設定
   *
   * 処理概要: ファイルの説明テキストを設定する。
   *
   * 実装理由: ファイルに付加情報としての説明を持たせるため。
   * @param {string} description - 説明テキスト
   * @returns {void}
   */
  setDescription(description: string): void {
    this.file.description = description;
  }

  /**
   * 処理名: 説明取得
   *
   * 処理概要: ファイルの説明テキストを返す。
   *
   * 実装理由: ファイルの説明を外部から参照できるようにするため。
   * @returns {string} 説明テキスト
   */
  getDescription(): string {
    return this.file.description;
  }

  /**
   * 処理名: ファイルデータ取得
   *
   * 処理概要: ファイルの生データオブジェクトを返す。
   *
   * 実装理由: シリアライズや他のクラスへの受け渡しに使用するため。
   * @returns {FileDataRaw} ファイル生データ
   */
  getFileData(): FileDataRaw {
    return this.file;
  }

  /**
   * 処理名: ファイルデータJSON取得
   *
   * 処理概要: ファイルの生データをJSON文字列として返す。
   *
   * 実装理由: ファイルデータをJSON形式で保存・通信するため。
   * @returns {string} JSON文字列
   */
  getFileDataJson(): string {
    return JSON.stringify(this.getFileData());
  }

  /**
   * 処理名: ファイル削除
   *
   * 処理概要: ファイルのコンテンツを空にし、truncatedフラグをtrueに設定する。
   *
   * 実装理由: ファイルを論理削除としてマークするため（物理削除はコンテナ側で行う）。
   * @returns {void}
   */
  remove(): void {
    this.file.content = '';
    this.file.truncated = true;
  }
}

export default FileData;

if (typeof window !== 'undefined') {
  !(window as any).FileData && ((window as any).FileData = FileData);
}
