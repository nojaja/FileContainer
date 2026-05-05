/***********************************************
Copyright 2017 - 2018
***********************************************/
/* v1.0.0 */

/* ------------------------------------------------
  ファイル管理クラス PublishFileContainer
------------------------------------------------ */

import FileContainer from './FileContainer';
import FileData from './FileData';

/** Service Worker キャッシュのキー名 */
const STATIC_CACHE_KEY = '1';

/**
 * 処理名: 公開ファイルコンテナクラス
 *
 * 処理概要:
 * Service Worker Cache API を使ったファイルキャッシュ管理クラス。
 * FileContainer を継承し、publicPath 配下のファイルをキャッシュに保存する。
 *
 * 実装理由:
 * ブラウザの Service Worker を通じてファイルをオフラインキャッシュするため。
 */
export class PublishFileContainer extends FileContainer {
  /** @protected 公開パスのプレフィックス */
  protected publicPath: string;

  /**
   * 処理名: コンストラクタ
   *
   * 処理概要: 公開パスを設定し、Service Worker キャッシュを初期化する。
   *
   * 実装理由: 初期化時に古いキャッシュを削除して新鮮な状態を確保するため。
   * @param {string} publicPath - 公開パスのプレフィックス（例: `/public/`）
   */
  constructor(publicPath: string) {
    super();
    if ((globalThis as any).caches) (globalThis as any).caches.delete(STATIC_CACHE_KEY);
    this.publicPath = publicPath;
  }

  /**
   * 処理名: キャッシュ保存
   *
   * 処理概要:
   * 指定URLとソースコードをService Worker Cacheに保存するPromiseを返す。
   * ブラウザにCaches APIがない場合は即座にresolveする。
   *
   * 実装理由: Service WorkerのキャッシュAPIを通じてファイルをオフライン対応させるため。
   * @param {string} url - キャッシュキーとなるURL（絶対パス）
   * @param {string} source - キャッシュするコンテンツ文字列
   * @param {string} [type] - MIMEタイプ（省略時は`application/javascript; charset=UTF-8`）
   * @returns {Promise<void>} 保存完了を示すPromise
   */
  saveCache(url: string, source: string, type?: string): Promise<void> {
    return new Promise((resolve) => {
      const _type = type || 'application/javascript; charset=UTF-8';
      const href = location.href;
      const base = href.substr(0, href.substr(0, href.length - location.search.length).lastIndexOf('/'));
      if (!(globalThis as any).caches) { resolve(); return; }
      (globalThis as any).caches.open(STATIC_CACHE_KEY).then((cache: any) => {
        const blob = new Blob([source], { type: _type });
        const response = new Response(blob, { status: 200, statusText: 'OK' });
        cache.put(base + url, response);
        resolve();
      });
    });
  }

  /**
   * 処理名: キャッシュ更新
   *
   * 処理概要:
   * 全ファイルを走査し、publicPath配下のファイルをキャッシュに保存する。
   *
   * 実装理由: コンテナ内の公開ファイルをまとめてキャッシュに反映するため。
   * @param {any} [fileCls] - 使用するFileDataクラス
   * @param {...any[]} constructorParam - クラスコンストラクタへの追加引数
   * @returns {Promise<void>} 更新完了を示すPromise
   */
  async refreshCache(fileCls?: any, ...constructorParam: any[]): Promise<void> {
    this.getFiles(null, true).forEach((filedata) => {
      const _file = this.getFile(filedata.path, fileCls, ...constructorParam);
      if (_file && filedata.path.indexOf(this.publicPath) === 0) {
        this.saveCache(filedata.path, _file.getContent(), _file.getType());
      }
    });
  }

  /**
   * 処理名: ファイル書き込み（オーバーライド）
   *
   * 処理概要:
   * 親クラスのputFileを実行した後、publicPath配下のファイルをキャッシュに保存する。
   *
   * 実装理由: ファイル更新のたびに公開キャッシュを自動同期するため。
   * @param {FileData} file - 書き込むFileDataインスタンス
   * @returns {Promise<boolean>} 書き込み結果
   */
  async putFile(file: FileData): Promise<boolean> {
    const ret = super.putFile(file);
    const filename = file.getFilename() || '';
    if (filename.indexOf(this.publicPath) === 0) {
      await this.saveCache(filename, file.getContent(), file.getType());
    }
    return ret;
  }

  /**
   * 処理名: 初期化（オーバーライド）
   *
   * 処理概要: Service Worker キャッシュを削除した後、親クラスのinitを呼び出す。
   *
   * 実装理由: コンテナ初期化時に古いキャッシュを確実にクリアするため。
   * @returns {void}
   */
  init(): void {
    if ((globalThis as any).caches) (globalThis as any).caches.delete(STATIC_CACHE_KEY);
    super.init();
  }

  /**
   * 処理名: コンテナJSON設定（オーバーライド）
   *
   * 処理概要: キャッシュを削除した後、親クラスのsetContainerJsonを呼び出す。
   *
   * 実装理由: コンテナ再設定時に古いキャッシュを確実にクリアするため。
   * @param {string} container - JSON文字列
   * @returns {void}
   */
  setContainerJson(container: string): void {
    if ((globalThis as any).caches) (globalThis as any).caches.delete(STATIC_CACHE_KEY);
    super.setContainerJson(container);
  }
}

export default PublishFileContainer;

if (typeof window !== 'undefined') {
  !(window as any).PublishFileContainer && ((window as any).PublishFileContainer = PublishFileContainer);
}

