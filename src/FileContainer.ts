/***********************************************
Copyright 2017 - 2018
***********************************************/
/* v1.0.0 */

/* ------------------------------------------------
  ファイル管理クラス FileContainer
------------------------------------------------ */

import FileData, { FileDataRaw } from './FileData';
import { EventEmitter } from 'events';

/** コンテナ全体のデータ構造を表すインターフェース */
export interface ContainerData {
  v: number;
  id: string | null;
  gistid: string | null;
  files: { [key: string]: FileDataRaw };
  public: boolean;
  createdTime: number;
  lastUpdatedTime: number;
  projectName?: string;
  description: string;
}

/** ディレクトリまたはファイルのパス情報 */
interface PathEntry {
  path: string;
  name: string;
}

/**
 * 処理名: ファイルコンテナクラス
 *
 * 処理概要:
 * 複数ファイルをまとめて管理するコンテナクラス。
 * ファイルの追加・削除・コピー・リネーム、イベント通知、Gist連携データ生成を担当する。
 *
 * 実装理由:
 * ファイル群をひとつのプロジェクト単位として扱い、
 * 変更イベントを通じてUI側へ差分を通知するため。
 */
export class FileContainer {
  /** @protected コンテナの生データ */
  protected container: ContainerData;
  /** @protected オープン中のファイルオブジェクトマップ */
  protected fileObjects: { [key: string]: FileData };
  /** @protected イベントエミッター */
  protected ev: EventEmitter;

  /**
   * 処理名: コンストラクタ
   *
   * 処理概要: コンテナを初期状態で生成する。
   *
   * 実装理由: 空のファイルコレクションとイベント管理を初期化するため。
   */
  constructor() {
    this.container = {
      v: 0.1,
      id: null,
      gistid: null,
      files: {},
      public: true,
      createdTime: new Date().getTime(),
      lastUpdatedTime: new Date().getTime(),
      projectName: '',
      description: '',
    };
    this.fileObjects = {};
    this.ev = new EventEmitter();
  }

  /**
   * 処理名: メタ変更イベント登録
   *
   * 処理概要: コンテナのメタデータ変更時に呼ばれるコールバックを登録する。
   *
   * 実装理由: id・projectName等の変更をUIへ伝えるため。
   * @param {(...args: any[]) => void} callback - コールバック関数
   * @returns {void}
   */
  onChangeMetas(callback: (...args: any[]) => void): void {
    this.ev.on('changemeta', callback);
  }

  /**
   * 処理名: ファイル変更イベント登録
   *
   * 処理概要: ファイルの追加・更新・削除時に呼ばれるコールバックを登録する。
   *
   * 実装理由: ファイル変更をUIへ通知するため。
   * @param {(...args: any[]) => void} callback - コールバック関数
   * @returns {void}
   */
  onChangeFiles(callback: (...args: any[]) => void): void {
    this.ev.on('change', callback);
  }

  /**
   * 処理名: ファイルオープンイベント登録
   *
   * 処理概要: ファイルがオープンされた際に呼ばれるコールバックを登録する。
   *
   * 実装理由: ファイルオープンをUIタブ等へ通知するため。
   * @param {(...args: any[]) => void} callback - コールバック関数
   * @returns {void}
   */
  onOpenFile(callback: (...args: any[]) => void): void {
    this.ev.on('open', callback);
  }

  /**
   * 処理名: ファイルクローズイベント登録
   *
   * 処理概要: ファイルがクローズされた際に呼ばれるコールバックを登録する。
   *
   * 実装理由: ファイルクローズをUIタブ等へ通知するため。
   * @param {(...args: any[]) => void} callback - コールバック関数
   * @returns {void}
   */
  onCloseFile(callback: (...args: any[]) => void): void {
    this.ev.on('close', callback);
  }

  /**
   * 処理名: ID設定
   *
   * 処理概要: コンテナのIDを設定し、メタ変更イベントを発火する。
   *
   * 実装理由: コンテナを一意に識別するIDを外部から設定できるようにするため。
   * @param {string} id - 設定するID
   * @returns {void}
   */
  setId(id: string): void {
    this.container.id = id;
    this.ev.emit('changemeta');
  }

  /**
   * 処理名: ID取得
   *
   * 処理概要: コンテナのIDを返す。IDが未設定の場合はタイムスタンプベースの一時IDを返す。
   *
   * 実装理由: 常に有効なIDを返し呼び出し側のnullチェックを不要にするため。
   * @returns {string | number} コンテナID
   */
  getId(): string | number {
    return this.container.id || Date.now() + Math.floor(1e4 + 9e4 * Math.random());
  }

  /**
   * 処理名: GistId設定
   *
   * 処理概要: GistのIDをコンテナIDフィールドに設定し、メタ変更イベントを発火する。
   *
   * 実装理由: Gist連携時に外部IDを保持するため。
   * @param {string} gistid - GistのID
   * @returns {void}
   */
  setGistId(gistid: string): void {
    this.container.id = gistid;
    this.ev.emit('changemeta');
  }

  /**
   * 処理名: GistId取得
   *
   * 処理概要: コンテナのgistidフィールドを返す。未設定の場合はnullを返す。
   *
   * 実装理由: Gist連携のIDを外部から参照できるようにするため。
   * @returns {string | null} GistID
   */
  getGistId(): string | null {
    return this.container.gistid || null;
  }

  /**
   * 処理名: プロジェクト名設定
   *
   * 処理概要: プロジェクト名を設定し、メタ変更イベントを発火する。
   *
   * 実装理由: コンテナに表示用のプロジェクト名を持たせるため。
   * @param {string} projectName - プロジェクト名
   * @returns {void}
   */
  setProjectName(projectName: string): void {
    this.container.projectName = projectName;
    this.ev.emit('changemeta');
  }

  /**
   * 処理名: プロジェクト名取得
   *
   * 処理概要: プロジェクト名を返す。未設定の場合はnullを返す。
   *
   * 実装理由: プロジェクト名をUI等で参照できるようにするため。
   * @returns {string | null} プロジェクト名
   */
  getProjectName(): string | null {
    return this.container.projectName || null;
  }

  /**
   * 処理名: ディレクトリ一覧取得
   *
   * 処理概要:
   * 指定した親パス直下のディレクトリ一覧を返す。
   * parentPathがnullの場合は最上位ディレクトリ一覧を返す。
   *
   * 実装理由: ファイルツリーのディレクトリ構造を取得するため。
   * @param {string | null} [parentPath] - 親パス（nullで最上位）
   * @returns {PathEntry[]} ディレクトリのパスと名前の配列
   */
  getDirectories(parentPath: string | null = null): PathEntry[] {
    const ret: { [key: string]: string } = {};
    this.iterateValidFiles(key => {
      if (!parentPath) this.collectRootDirectory(ret, key);
      else this.collectChildDirectory(ret, key, parentPath);
    });
    return Object.keys(ret).map(key => ({ path: key, name: ret[key] }));
  }

  /**
   * 処理名: 有効ファイル反復
   *
   * 処理概要: truncatedでないファイルにのみコールバックを呼び出す共通ループ。
   *
   * 実装理由: getDirectoriesとgetFilesの共通ループをDRY原則で共有するため。
   * @param {(key: string) => void} callback - 各ファイルキーに対して実行するコールバック
   * @returns {void}
   */
  private iterateValidFiles(callback: (key: string) => void): void {
    for (const key in this.container.files) {
      if (!this.container.files[key].truncated) callback(key);
    }
  }

  /**
   * 処理名: ルートディレクトリ収集
   *
   * 処理概要: キーが最上位ディレクトリに属する場合にretへ追加する。
   *
   * 実装理由: getDirectoriesのロジックを分割してCognitive Complexityを下げるため。
   * @param {{ [key: string]: string }} ret - 収集先マップ
   * @param {string} key - ファイルパスキー
   * @returns {void}
   */
  private collectRootDirectory(ret: { [key: string]: string }, key: string): void {
    const mp = key.match(/(.+?\/)/);
    if (mp) ret[mp[1]] = mp[1];
  }

  /**
   * 処理名: 子ディレクトリ収集
   *
   * 処理概要: キーが指定親パス直下のディレクトリに属する場合にretへ追加する。
   *
   * 実装理由: getDirectoriesのロジックを分割してCognitive Complexityを下げるため。
   * @param {{ [key: string]: string }} ret - 収集先マップ
   * @param {string} key - ファイルパスキー
   * @param {string} parentPath - 親パス
   * @returns {void}
   */
  private collectChildDirectory(ret: { [key: string]: string }, key: string, parentPath: string): void {
    if (key.indexOf(parentPath) !== 0 || key.indexOf('/', parentPath.length) <= 0) return;
    const relKey = key.substring(parentPath.length);
    const mp = relKey.match(/(.+?\/)/);
    if (mp) ret[parentPath + mp[1]] = mp[1];
  }

  /**
   * 処理名: ファイル一覧取得
   *
   * 処理概要:
   * 指定した親パス直下のファイル一覧を返す。
   * parentPathがnullの場合は最上位ファイルを返す。
   * all=trueの場合は全階層のファイルを返す。
   *
   * 実装理由: ファイルツリーのファイル一覧をパスフィルタ付きで取得するため。
   * @param {string | null} [parentPath] - 親パス（nullで最上位）
   * @param {boolean} [all] - trueで全階層を返す
   * @returns {PathEntry[]} ファイルのパスと名前の配列
   */
  getFiles(parentPath: string | null = null, all: boolean = false): PathEntry[] {
    const ret: { [key: string]: string } = {};
    this.iterateValidFiles(key => {
      if (!parentPath) this.collectRootFile(ret, key, all);
      else this.collectChildFile(ret, key, parentPath, all);
    });
    return Object.keys(ret).map(key => ({ path: key, name: ret[key] }));
  }

  /**
   * 処理名: ルートファイル収集
   *
   * 処理概要: キーが最上位階層のファイルである場合にretへ追加する。
   *
   * 実装理由: getFilesのロジックを分割してCognitive Complexityを下げるため。
   * @param {{ [key: string]: string }} ret - 収集先マップ
   * @param {string} key - ファイルパスキー
   * @param {boolean} all - 全階層対象フラグ
   * @returns {void}
   */
  private collectRootFile(ret: { [key: string]: string }, key: string, all: boolean): void {
    if (!all && key.indexOf('/') !== -1) return;
    const mp = key.match(/\/?([^/]+\.[^.]+)$/);
    if (mp) ret[key] = mp[1];
  }

  /**
   * 処理名: 子ファイル収集
   *
   * 処理概要: キーが指定親パス直下のファイルである場合にretへ追加する。
   *
   * 実装理由: getFilesのロジックを分割してCognitive Complexityを下げるため。
   * @param {{ [key: string]: string }} ret - 収集先マップ
   * @param {string} key - ファイルパスキー
   * @param {string} parentPath - 親パス
   * @param {boolean} all - 全階層対象フラグ
   * @returns {void}
   */
  private collectChildFile(ret: { [key: string]: string }, key: string, parentPath: string, all: boolean): void {
    if (key.indexOf(parentPath) !== 0) return;
    if (!all && key.indexOf('/', parentPath.length) !== -1) return;
    const mp = key.match(/\/?([^/]+\.[^.]+)$/);
    if (mp) ret[key] = mp[1];
  }

  /**
   * 処理名: オープンファイル一覧取得
   *
   * 処理概要: 現在オープン中のファイルパス一覧を返す。
   *
   * 実装理由: 開いているファイルの状態をUIで管理するため。
   * @param {string | null} [parentPath] - 親パスフィルタ（nullで全件）
   * @returns {string[]} オープン中ファイルパスの配列
   */
  getOpenFiles(parentPath: string | null = null): string[] {
    const ret: string[] = [];
    for (const key in this.fileObjects) {
      if (this.container.files[key].truncated) continue;
      if (!parentPath) {
        ret.push(key);
      } else if (key.indexOf(parentPath) === 0 && key.indexOf('/', parentPath.length) === -1) {
        ret.push(key);
      }
    }
    return ret;
  }

  /**
   * 処理名: ファイル存在確認
   *
   * 処理概要: 指定したファイル名がコンテナに存在するか確認する。
   *
   * 実装理由: ファイル操作前の存在チェックを提供するため。
   * @param {string} filename - 確認するファイル名
   * @returns {boolean} 存在する場合はtrue
   */
  existFile(filename: string): boolean {
    return filename in this.container.files;
  }

  /**
   * 処理名: ファイル取得
   *
   * 処理概要: 指定ファイル名のFileDataインスタンスを生成して返す。存在しない場合はnullを返す。
   *
   * 実装理由: ファイルデータをオブジェクトとして操作できるようにするため。
   * @param {string} filename - ファイル名
   * @param {any} [fileCls] - 使用するFileDataクラス（省略時はFileData）
   * @param {...any[]} constructorParam - クラスコンストラクタへの追加引数
   * @returns {FileData | null} FileDataインスタンスまたはnull
   */
  getFile(filename: string, fileCls?: any, ...constructorParam: any[]): FileData | null {
    const Cls = fileCls || FileData;
    if (filename in this.container.files) {
      return new Cls(this.container.files[filename], ...constructorParam);
    }
    return null;
  }

  /**
   * 処理名: ファイル生データ取得
   *
   * 処理概要: 指定ファイル名のFileDataRaw（生オブジェクト）を返す。存在しない場合はnullを返す。
   *
   * 実装理由: FileDataインスタンス化を介さず生データに直接アクセスするため。
   * @param {string} filename - ファイル名
   * @returns {FileDataRaw | null} 生データオブジェクトまたはnull
   */
  getFileRaw(filename: string): FileDataRaw | null {
    return (filename in this.container.files) ? this.container.files[filename] : null;
  }

  /**
   * 処理名: ファイルオープン
   *
   * 処理概要:
   * 指定ファイルをfileObjectsキャッシュに登録し、openイベントを発火してFileDataを返す。
   *
   * 実装理由: エディタ等でファイルを開いた状態を管理し、重複生成を防ぐため。
   * @param {string} filename - ファイル名
   * @param {any} [fileCls] - 使用するFileDataクラス
   * @param {...any[]} constructorParam - クラスコンストラクタへの追加引数
   * @returns {FileData | null} オープンしたFileDataまたはnull
   */
  openFile(filename: string, fileCls?: any, ...constructorParam: any[]): FileData | null {
    if (!(filename in this.container.files)) return null;
    if (!(filename in this.fileObjects)) {
      this.fileObjects[filename] = this.getFile(filename, fileCls, ...constructorParam)!;
    }
    this.ev.emit('open', filename, this.fileObjects[filename]);
    return this.fileObjects[filename];
  }

  /**
   * 処理名: ファイルクローズ
   *
   * 処理概要:
   * 指定ファイルをfileObjectsキャッシュから削除し、closeイベントを発火してFileDataを返す。
   *
   * 実装理由: エディタ等でファイルを閉じた状態をコンテナに反映させるため。
   * @param {string} filename - ファイル名
   * @returns {FileData | null} クローズしたFileDataまたはnull
   */
  closeFile(filename: string): FileData | null {
    if (!(filename in this.container.files)) return null;
    if (!(filename in this.fileObjects)) return null;
    const ret = this.fileObjects[filename];
    delete this.fileObjects[filename];
    this.ev.emit('close', filename);
    return ret;
  }

  /**
   * 処理名: ファイル保存
   *
   * 処理概要: 指定ファイルのfileObjectsキャッシュをコンテナに書き戻す。
   *
   * 実装理由: キャッシュ上の変更をコンテナに永続化するため。
   * @param {string} filename - ファイル名
   * @returns {Promise<boolean> | false} 保存結果
   */
  saveFile(filename: string): Promise<boolean> | false {
    if (filename in this.container.files && !(filename in this.fileObjects)) {
      return this.putFile(this.fileObjects[filename]);
    }
    return false;
  }

  /**
   * 処理名: ファイル書き込み
   *
   * 処理概要: FileDataの内容をコンテナのfilesに書き込み、changeイベントを発火する。
   *
   * 実装理由: ファイルの追加・更新を一元的に処理し変更通知を行うため。
   * @param {FileData} file - 書き込むFileDataインスタンス
   * @returns {Promise<boolean>} 常にtrueを返す
   */
  async putFile(file: FileData): Promise<boolean> {
    const filename = file.getFilename();
    this.container.files[filename] = file.getFileData();
    this.container.lastUpdatedTime = new Date().getTime();
    this.ev.emit('change', filename);
    return true;
  }

  /**
   * 処理名: ファイルコピー
   *
   * 処理概要: srcのファイルをdestにコピーする。mode=1の場合は上書きを許可する。
   *
   * 実装理由: ファイルの複製機能を提供するため。
   * @param {string} src - コピー元ファイル名
   * @param {string} dest - コピー先ファイル名
   * @param {number} [mode] - 0: 上書き禁止（デフォルト）、1: 上書き許可
   * @returns {boolean} 成功時はtrue
   */
  copyFile(src: string, dest: string, mode: number = 0): boolean {
    if (!(src in this.container.files)) return false;
    if (mode !== 1 && dest in this.container.files) return false;
    const file = new FileData(this.container.files[src]);
    file.setFilename(dest);
    this.putFile(file);
    this.container.lastUpdatedTime = new Date().getTime();
    return true;
  }

  /**
   * 処理名: ファイルリネーム
   *
   * 処理概要: 指定ファイルを新しい名前に変更する。変更先が既に存在する場合は失敗する。
   *
   * 実装理由: ファイル名の変更機能を提供するため。
   * @param {string} filename - 現在のファイル名
   * @param {string} newName - 新しいファイル名
   * @returns {boolean} 成功時はtrue
   */
  renameFile(filename: string, newName: string): boolean {
    if (!(filename in this.container.files)) return false;
    if (newName in this.container.files) return false;
    const file = new FileData(this.container.files[filename]);
    file.setFilename(newName);
    delete this.container.files[filename];
    delete this.fileObjects[filename];
    this.putFile(file);
    this.container.lastUpdatedTime = new Date().getTime();
    return true;
  }

  /**
   * 処理名: ファイル削除
   *
   * 処理概要: 指定ファイルを論理削除した後、コンテナから除去する。
   *
   * 実装理由: ファイル削除時にFileDataのremove処理を経由してputFileを呼び変更通知するため。
   * @param {string} filename - 削除するファイル名
   * @returns {boolean} 成功時はtrue
   */
  removeFile(filename: string): boolean {
    if (!(filename in this.container.files)) return false;
    const file = new FileData(this.container.files[filename]);
    file.remove();
    this.putFile(file);
    delete this.container.files[filename];
    delete this.fileObjects[filename];
    this.container.lastUpdatedTime = new Date().getTime();
    return true;
  }

  /**
   * 処理名: コンテナクリア
   *
   * 処理概要: コンテナを空の初期状態にリセットする。
   *
   * 実装理由: コンテナ全体を再初期化する手段を提供するため。
   * @returns {void}
   */
  clear(): void {
    this.container = {
      v: 0.1,
      id: '',
      gistid: '',
      files: {},
      public: true,
      createdTime: new Date().getTime(),
      lastUpdatedTime: new Date().getTime(),
      description: '',
    };
    this.fileObjects = {};
  }

  /**
   * 処理名: コンテナ初期化
   *
   * 処理概要: clearを呼び出してコンテナを初期状態にする。
   *
   * 実装理由: サブクラスがinit処理を拡張できるよう、clearをラップするメソッドを提供するため。
   * @returns {void}
   */
  init(): void {
    this.clear();
  }

  /**
   * 処理名: 公開フラグ設定
   *
   * 処理概要: コンテナの公開フラグを設定し、メタ変更イベントを発火する。
   *
   * 実装理由: Gist等の公開/非公開設定を保持するため。
   * @param {boolean} bool - 公開フラグ
   * @returns {void}
   */
  setPublic(bool: boolean): void {
    this.container.public = bool;
    this.ev.emit('changemeta');
  }

  /**
   * 処理名: 公開フラグ取得
   *
   * 処理概要: 公開フラグを返す。falsy値の場合はnullを返す。
   *
   * 実装理由: 公開フラグを外部から参照できるようにするため。
   * @returns {boolean | null} 公開フラグまたはnull
   */
  getPublic(): boolean | null {
    return this.container.public || null;
  }

  /**
   * 処理名: 説明設定
   *
   * 処理概要: コンテナの説明テキストを設定し、メタ変更イベントを発火する。
   *
   * 実装理由: コンテナに説明文を付与するため。
   * @param {string} description - 説明テキスト
   * @returns {void}
   */
  setDescription(description: string): void {
    this.container.description = description;
    this.ev.emit('changemeta');
  }

  /**
   * 処理名: 説明取得
   *
   * 処理概要: コンテナの説明テキストを返す。未設定の場合はnullを返す。
   *
   * 実装理由: コンテナの説明を外部から参照できるようにするため。
   * @returns {string | null} 説明テキストまたはnull
   */
  getDescription(): string | null {
    return this.container.description || null;
  }

  /**
   * 処理名: コンテナ設定
   *
   * 処理概要: コンテナデータを外部から丸ごと設定し、changeとchangemetaイベントを発火する。
   *
   * 実装理由: JSON等からコンテナ全体を復元するため。
   * @param {ContainerData} container - 設定するコンテナデータ
   * @returns {void}
   */
  setContainer(container: ContainerData): void {
    this.container = container;
    this.fileObjects = {};
    this.ev.emit('change', null);
    this.ev.emit('changemeta');
  }

  /**
   * 処理名: コンテナ取得
   *
   * 処理概要: コンテナデータを返す。
   *
   * 実装理由: コンテナデータを外部から参照できるようにするため。
   * @returns {ContainerData | null} コンテナデータ
   */
  getContainer(): ContainerData | null {
    return this.container || null;
  }

  /**
   * 処理名: コンテナJSON設定
   *
   * 処理概要: JSON文字列をパースしてコンテナに設定する。
   *
   * 実装理由: JSON形式での保存データを復元するため。
   * @param {string} container - JSON文字列
   * @returns {void}
   */
  setContainerJson(container: string): void {
    this.setContainer(JSON.parse(container));
    this.fileObjects = {};
  }

  /**
   * 処理名: コンテナJSON取得
   *
   * 処理概要: コンテナデータをJSON文字列として返す。
   *
   * 実装理由: コンテナをJSON形式で保存・転送するため。
   * @returns {string} JSON文字列
   */
  getContainerJson(): string {
    return JSON.stringify(this.getContainer());
  }

  /**
   * 処理名: Gistデータ生成
   *
   * 処理概要:
   * コンテナのファイル群からGist API送信用のデータオブジェクトを生成する。
   * コンテンツが空またはpublicパス配下のファイルは除外する。
   *
   * 実装理由: GitHub Gist APIへのアップロード用データを構築するため。
   * @returns {object} Gist APIリクエスト用オブジェクト
   */
  getGistData(): object {
    const files = Object.entries(this.container.files)
      .filter(([, value]) => value.content !== '' && !value.filename.match(/^\/public\//))
      .map(([key, value]) => [
        key.replace(/\//g, '%2F'),
        { filename: value.filename.replace(/\//g, '%2F'), content: value.content },
      ]);
    return {
      description: this.container.projectName,
      public: this.container.public,
      files: Object.fromEntries(files),
    };
  }

  /**
   * 処理名: GistデータJSON取得
   *
   * 処理概要: Gistデータ生成結果をJSON文字列として返す。
   *
   * 実装理由: Gist APIへのリクエストボディを文字列で提供するため。
   * @returns {string} JSON文字列
   */
  getGistJsonData(): string {
    return JSON.stringify(this.getGistData());
  }

  /**
   * 処理名: 作成時刻取得
   *
   * 処理概要: コンテナの作成時刻（UNIXミリ秒）を返す。
   *
   * 実装理由: コンテナの作成時刻を外部から参照できるようにするため。
   * @returns {number} 作成時刻（ミリ秒）
   */
  getCreatedTime(): number {
    return this.container.createdTime;
  }

  /**
   * 処理名: 最終更新時刻取得
   *
   * 処理概要: コンテナの最終更新時刻（UNIXミリ秒）を返す。
   *
   * 実装理由: コンテナの更新状態を外部から参照できるようにするため。
   * @returns {number} 最終更新時刻（ミリ秒）
   */
  getLastUpdatedTime(): number {
    return this.container.lastUpdatedTime;
  }

  /**
   * 処理名: 作成時刻設定
   *
   * 処理概要: コンテナの作成時刻を設定し、メタ変更イベントを発火する。
   *
   * 実装理由: 外部データからコンテナを復元する際に作成時刻を反映するため。
   * @param {number} createdTime - 作成時刻（ミリ秒）
   * @returns {void}
   */
  setCreatedTime(createdTime: number): void {
    this.container.createdTime = createdTime;
    this.ev.emit('changemeta');
  }

  /**
   * 処理名: 最終更新時刻設定
   *
   * 処理概要: コンテナの最終更新時刻を設定し、メタ変更イベントを発火する。
   *
   * 実装理由: 外部データからコンテナを復元する際に更新時刻を反映するため。
   * @param {number} lastUpdatedTime - 最終更新時刻（ミリ秒）
   * @returns {void}
   */
  setLastUpdatedTime(lastUpdatedTime: number): void {
    this.container.lastUpdatedTime = lastUpdatedTime;
    this.ev.emit('changemeta');
  }
}

export default FileContainer;

if (typeof window !== 'undefined') {
  !(window as any).FileContainer && ((window as any).FileContainer = FileContainer);
}

