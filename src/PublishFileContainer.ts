/***********************************************
Copyright 2017 - 2018
***********************************************/
/* v1.0.0 */

/* ------------------------------------------------
  ファイル管理クラス PublishFileContainer
------------------------------------------------ */

import FileContainer from './FileContainer';
import FileData from './FileData';

const STATIC_CACHE_KEY = '1';

export class PublishFileContainer extends FileContainer {
  protected publicPath: string;

  constructor(publicPath: string) {
    super();
    // キャッシュの初期化
    if ((globalThis as any).caches) (globalThis as any).caches.delete(STATIC_CACHE_KEY);
    this.publicPath = publicPath;
  }

  /**
  キャッシュファイルの登録
  */
  saveCache(url: string, source: string, type?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const _type = type || 'application/javascript; charset=UTF-8';
      const _url = location.href.substr(0, location.href.substr(0, location.href.length - location.search.length).lastIndexOf("/")); // URLの最初のパスまで
      if (!(globalThis as any).caches) { resolve(); return; }
      (globalThis as any).caches.open(STATIC_CACHE_KEY).then((cache: any) => {
        const blob = new Blob([source], {
          type: _type
        });
        const response = new Response(blob, {
          "status": 200,
          "statusText": "OK"
        });
        cache.put(_url + url, response);
        resolve();
      });
    });
  }

  //ファイルキャッシュの更新
  async refreshCache(fileCls?: any, ...constructorParam: any[]): Promise<void> {
    this.getFiles(null, true).forEach((filedata, i) => {
      const _file = this.getFile(filedata.path, fileCls, ...constructorParam);
      if (_file && filedata.path.indexOf(this.publicPath) == 0) {
        this.saveCache(filedata.path, _file.getContent(), _file.getType());
      }
    });
  }

  async putFile(file: FileData): Promise<boolean> {
    let ret = super.putFile(file);
    const filename = file.getFilename() || '';
    if (filename.indexOf(this.publicPath) == 0) {
      await this.saveCache(filename, file.getContent(), file.getType());
    }
    return ret;
  }

  init(): void {
    // キャッシュの初期化
    if ((globalThis as any).caches) (globalThis as any).caches.delete(STATIC_CACHE_KEY);
    super.init();
  }

  setContainerJson(container: string): void {
    // キャッシュの初期化
    if ((globalThis as any).caches) (globalThis as any).caches.delete(STATIC_CACHE_KEY);
    super.setContainerJson(container);
  }
}

export default PublishFileContainer;

if (typeof window !== 'undefined') {
  !(window as any).PublishFileContainer && ((window as any).PublishFileContainer = PublishFileContainer);
}
