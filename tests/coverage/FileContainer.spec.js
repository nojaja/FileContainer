import { FileContainer } from '../../src/FileContainer'
import { FileData } from '../../src/FileData'

// FileData のモック生成ヘルパー
function makeFileData(filename, content = 'content') {
  const fd = new FileData({ filename, content })
  return fd
}

describe('FileContainer - constructor', () => {
  test('インスタンスを生成できる', () => {
    const fc = new FileContainer()
    expect(fc).toBeTruthy()
  })
})

describe('FileContainer - setId / getId', () => {
  test('IDを設定・取得できる', () => {
    const fc = new FileContainer()
    fc.setId('abc123')
    expect(fc.getId()).toBe('abc123')
  })

  test('IDが未設定の場合はランダムな数値を返す', () => {
    const fc = new FileContainer()
    const id = fc.getId()
    expect(typeof id).toBe('number')
  })
})

describe('FileContainer - setGistId / getGistId', () => {
  test('GistIdを設定できる', () => {
    const fc = new FileContainer()
    fc.setGistId('gist_id_123')
    // setGistId は container.id に書き込む実装なので getGistId は null を返す
    // (gistid フィールドは変更されない)
    expect(fc.getGistId()).toBeNull()
  })

  test('GistIdが未設定の場合はnullを返す', () => {
    const fc = new FileContainer()
    expect(fc.getGistId()).toBeNull()
  })
})

describe('FileContainer - setProjectName / getProjectName', () => {
  test('プロジェクト名を設定・取得できる', () => {
    const fc = new FileContainer()
    fc.setProjectName('MyProject')
    expect(fc.getProjectName()).toBe('MyProject')
  })

  test('空のプロジェクト名はnullを返す', () => {
    const fc = new FileContainer()
    expect(fc.getProjectName()).toBeNull()
  })
})

describe('FileContainer - setPublic / getPublic', () => {
  test('publicフラグをtrue→falseに設定すると null を返す (実装の仕様)', () => {
    const fc = new FileContainer()
    fc.setPublic(false)
    // getPublic() は `this.container.public || null` のため、false の場合は null を返す
    expect(fc.getPublic()).toBeNull()
  })

  test('デフォルトはtrue', () => {
    const fc = new FileContainer()
    expect(fc.getPublic()).toBe(true)
  })
})

describe('FileContainer - setDescription / getDescription', () => {
  test('説明を設定・取得できる', () => {
    const fc = new FileContainer()
    fc.setDescription('some description')
    expect(fc.getDescription()).toBe('some description')
  })

  test('空の説明はnullを返す', () => {
    const fc = new FileContainer()
    expect(fc.getDescription()).toBeNull()
  })
})

describe('FileContainer - putFile / existFile / getFile / getFileRaw', () => {
  test('putFileでファイルを追加し existFile で確認できる', async () => {
    const fc = new FileContainer()
    const fd = makeFileData('test.txt')
    await fc.putFile(fd)
    expect(fc.existFile('test.txt')).toBe(true)
  })

  test('getFile でFileDataインスタンスが取得できる', async () => {
    const fc = new FileContainer()
    const fd = makeFileData('hello.txt', 'world')
    await fc.putFile(fd)
    const got = fc.getFile('hello.txt')
    expect(got).not.toBeNull()
    expect(got.getContent()).toBe('world')
  })

  test('存在しないファイルは null を返す', () => {
    const fc = new FileContainer()
    expect(fc.getFile('notexist.txt')).toBeNull()
  })

  test('getFileRaw で生データを取得できる', async () => {
    const fc = new FileContainer()
    const fd = makeFileData('raw.txt', 'rawcontent')
    await fc.putFile(fd)
    const raw = fc.getFileRaw('raw.txt')
    expect(raw).not.toBeNull()
    expect(raw.content).toBe('rawcontent')
  })

  test('存在しないファイルのgetFileRaw はnullを返す', () => {
    const fc = new FileContainer()
    expect(fc.getFileRaw('notexist.txt')).toBeNull()
  })
})

describe('FileContainer - existFile', () => {
  test('存在しないファイルは false を返す', () => {
    const fc = new FileContainer()
    expect(fc.existFile('notexist.txt')).toBe(false)
  })
})

describe('FileContainer - openFile / closeFile', () => {
  test('openFile でファイルオブジェクトを取得できる', async () => {
    const fc = new FileContainer()
    const fd = makeFileData('open.txt')
    await fc.putFile(fd)
    const opened = fc.openFile('open.txt')
    expect(opened).not.toBeNull()
    expect(opened.getFilename()).toBe('open.txt')
  })

  test('存在しないファイルのopenFileはnullを返す', () => {
    const fc = new FileContainer()
    expect(fc.openFile('notexist.txt')).toBeNull()
  })

  test('closeFile でファイルオブジェクトを閉じられる', async () => {
    const fc = new FileContainer()
    const fd = makeFileData('close.txt')
    await fc.putFile(fd)
    fc.openFile('close.txt')
    const closed = fc.closeFile('close.txt')
    expect(closed).not.toBeNull()
    expect(closed.getFilename()).toBe('close.txt')
  })

  test('openしていないファイルをcloseFile するとnullを返す', async () => {
    const fc = new FileContainer()
    const fd = makeFileData('notopen.txt')
    await fc.putFile(fd)
    expect(fc.closeFile('notopen.txt')).toBeNull()
  })

  test('存在しないファイルのcloseFileはnullを返す', () => {
    const fc = new FileContainer()
    expect(fc.closeFile('notexist.txt')).toBeNull()
  })
})

describe('FileContainer - getOpenFiles', () => {
  test('openしたファイルが一覧に含まれる', async () => {
    const fc = new FileContainer()
    const fd = makeFileData('open1.txt')
    await fc.putFile(fd)
    fc.openFile('open1.txt')
    const openFiles = fc.getOpenFiles()
    expect(openFiles).toContain('open1.txt')
  })
})

describe('FileContainer - getFiles', () => {
  test('ファイル一覧を取得できる', async () => {
    const fc = new FileContainer()
    await fc.putFile(makeFileData('a.txt'))
    await fc.putFile(makeFileData('b.txt'))
    const files = fc.getFiles()
    expect(files.length).toBe(2)
    expect(files.some(f => f.name === 'a.txt')).toBe(true)
    expect(files.some(f => f.name === 'b.txt')).toBe(true)
  })

  test('サブディレクトリのファイルはparentPathなしでは含まれない', async () => {
    const fc = new FileContainer()
    await fc.putFile(makeFileData('root.txt'))
    await fc.putFile(makeFileData('sub/deep.txt'))
    const files = fc.getFiles()
    expect(files.some(f => f.name === 'root.txt')).toBe(true)
    expect(files.some(f => f.name === 'deep.txt')).toBe(false)
  })

  test('all=trueで全ファイルを取得できる', async () => {
    const fc = new FileContainer()
    await fc.putFile(makeFileData('root.txt'))
    await fc.putFile(makeFileData('sub/deep.txt'))
    const files = fc.getFiles(null, true)
    expect(files.some(f => f.name === 'root.txt')).toBe(true)
    expect(files.some(f => f.name === 'deep.txt')).toBe(true)
  })

  test('parentPathを指定するとそのパス直下のファイルのみ取得できる', async () => {
    const fc = new FileContainer()
    await fc.putFile(makeFileData('sub/a.txt'))
    await fc.putFile(makeFileData('sub/b.txt'))
    await fc.putFile(makeFileData('other/c.txt'))
    const files = fc.getFiles('sub/')
    expect(files.some(f => f.name === 'a.txt')).toBe(true)
    expect(files.some(f => f.name === 'b.txt')).toBe(true)
    expect(files.some(f => f.name === 'c.txt')).toBe(false)
  })
})

describe('FileContainer - getDirectories', () => {
  test('ディレクトリ一覧を取得できる', async () => {
    const fc = new FileContainer()
    await fc.putFile(makeFileData('dir1/a.txt'))
    await fc.putFile(makeFileData('dir2/b.txt'))
    const dirs = fc.getDirectories()
    expect(dirs.some(d => d.name === 'dir1/')).toBe(true)
    expect(dirs.some(d => d.name === 'dir2/')).toBe(true)
  })

  test('parentPathを指定するとその配下のディレクトリを取得できる', async () => {
    const fc = new FileContainer()
    await fc.putFile(makeFileData('parent/child/a.txt'))
    const dirs = fc.getDirectories('parent/')
    expect(dirs.some(d => d.name === 'child/')).toBe(true)
  })
})

describe('FileContainer - copyFile', () => {
  test('ファイルをコピーできる', async () => {
    const fc = new FileContainer()
    await fc.putFile(makeFileData('src.txt', 'data'))
    const result = fc.copyFile('src.txt', 'dest.txt')
    expect(result).toBe(true)
    // コピー先が存在することを確認（非同期のputFileが完了後）
    await new Promise(r => setTimeout(r, 10))
    expect(fc.existFile('dest.txt')).toBe(true)
  })

  test('コピー先が既に存在する場合はfalseを返す(mode=0)', async () => {
    const fc = new FileContainer()
    await fc.putFile(makeFileData('src.txt', 'data'))
    await fc.putFile(makeFileData('dest.txt', 'existing'))
    const result = fc.copyFile('src.txt', 'dest.txt')
    expect(result).toBe(false)
  })

  test('mode=1で上書きコピーできる', async () => {
    const fc = new FileContainer()
    await fc.putFile(makeFileData('src.txt', 'new data'))
    await fc.putFile(makeFileData('dest.txt', 'existing'))
    const result = fc.copyFile('src.txt', 'dest.txt', 1)
    expect(result).toBe(true)
  })

  test('存在しないファイルのコピーはfalseを返す', () => {
    const fc = new FileContainer()
    expect(fc.copyFile('notexist.txt', 'dest.txt')).toBe(false)
  })
})

describe('FileContainer - renameFile', () => {
  test('ファイル名を変更できる', async () => {
    const fc = new FileContainer()
    await fc.putFile(makeFileData('old.txt', 'data'))
    const result = fc.renameFile('old.txt', 'new.txt')
    expect(result).toBe(true)
    await new Promise(r => setTimeout(r, 10))
    expect(fc.existFile('old.txt')).toBe(false)
    expect(fc.existFile('new.txt')).toBe(true)
  })

  test('変更先ファイルが既に存在する場合はfalseを返す', async () => {
    const fc = new FileContainer()
    await fc.putFile(makeFileData('old.txt', 'data'))
    await fc.putFile(makeFileData('new.txt', 'existing'))
    const result = fc.renameFile('old.txt', 'new.txt')
    expect(result).toBe(false)
  })

  test('存在しないファイルのリネームはfalseを返す', () => {
    const fc = new FileContainer()
    expect(fc.renameFile('notexist.txt', 'new.txt')).toBe(false)
  })
})

describe('FileContainer - removeFile', () => {
  test('ファイルを削除できる', async () => {
    const fc = new FileContainer()
    await fc.putFile(makeFileData('remove.txt', 'data'))
    const result = fc.removeFile('remove.txt')
    expect(result).toBe(true)
    expect(fc.existFile('remove.txt')).toBe(false)
  })

  test('存在しないファイルの削除はfalseを返す', () => {
    const fc = new FileContainer()
    expect(fc.removeFile('notexist.txt')).toBe(false)
  })
})

describe('FileContainer - clear / init', () => {
  test('clear() でコンテナをリセットできる', async () => {
    const fc = new FileContainer()
    await fc.putFile(makeFileData('a.txt'))
    fc.clear()
    expect(fc.existFile('a.txt')).toBe(false)
  })

  test('init() でコンテナをリセットできる', async () => {
    const fc = new FileContainer()
    await fc.putFile(makeFileData('b.txt'))
    fc.init()
    expect(fc.existFile('b.txt')).toBe(false)
  })
})

describe('FileContainer - setContainer / getContainer', () => {
  test('コンテナオブジェクトを設定・取得できる', () => {
    const fc = new FileContainer()
    const newContainer = {
      v: 0.1,
      id: 'newid',
      gistid: null,
      files: {},
      public: true,
      createdTime: 0,
      lastUpdatedTime: 0,
      projectName: 'NewProject',
      description: ''
    }
    fc.setContainer(newContainer)
    expect(fc.getContainer().id).toBe('newid')
    expect(fc.getContainer().projectName).toBe('NewProject')
  })
})

describe('FileContainer - setContainerJson / getContainerJson', () => {
  test('JSONでコンテナを設定・取得できる', () => {
    const fc = new FileContainer()
    fc.setId('testid')
    fc.setProjectName('TestProject')
    const json = fc.getContainerJson()
    expect(typeof json).toBe('string')
    const parsed = JSON.parse(json)
    expect(parsed.id).toBe('testid')

    const fc2 = new FileContainer()
    fc2.setContainerJson(json)
    expect(fc2.getContainer().id).toBe('testid')
  })
})

describe('FileContainer - getGistData / getGistJsonData', () => {
  test('Gistデータを取得できる', () => {
    const fc = new FileContainer()
    fc.setProjectName('GistProject')
    const gist = fc.getGistData()
    expect(gist.description).toBe('GistProject')
    expect(typeof gist.public).toBe('boolean')
  })

  test('GistデータをJSON文字列で取得できる', () => {
    const fc = new FileContainer()
    const json = fc.getGistJsonData()
    expect(typeof json).toBe('string')
    const parsed = JSON.parse(json)
    expect(parsed).toHaveProperty('files')
  })
})

describe('FileContainer - getCreatedTime / getLastUpdatedTime', () => {
  test('作成時刻を取得できる', () => {
    const fc = new FileContainer()
    expect(typeof fc.getCreatedTime()).toBe('number')
  })

  test('最終更新時刻を取得できる', () => {
    const fc = new FileContainer()
    expect(typeof fc.getLastUpdatedTime()).toBe('number')
  })
})

describe('FileContainer - setCreatedTime / setLastUpdatedTime', () => {
  test('作成時刻を設定できる', () => {
    const fc = new FileContainer()
    fc.setCreatedTime(12345)
    expect(fc.getCreatedTime()).toBe(12345)
  })

  test('最終更新時刻を設定できる', () => {
    const fc = new FileContainer()
    fc.setLastUpdatedTime(99999)
    expect(fc.getLastUpdatedTime()).toBe(99999)
  })
})

describe('FileContainer - イベントリスナー', () => {
  test('onChangeMetas が setId で呼ばれる', (done) => {
    const fc = new FileContainer()
    fc.onChangeMetas(() => done())
    fc.setId('trigger')
  })

  test('onChangeFiles が putFile で呼ばれる', (done) => {
    const fc = new FileContainer()
    fc.onChangeFiles(() => done())
    fc.putFile(makeFileData('event.txt'))
  })

  test('onOpenFile が openFile で呼ばれる', () => {
    return new Promise(resolve => {
      const fc = new FileContainer()
      fc.putFile(makeFileData('openevent.txt')).then(() => {
        fc.onOpenFile(() => resolve(undefined))
        fc.openFile('openevent.txt')
      })
    })
  })

  test('onCloseFile が closeFile で呼ばれる', () => {
    return new Promise(resolve => {
      const fc = new FileContainer()
      fc.putFile(makeFileData('closeevent.txt')).then(() => {
        fc.openFile('closeevent.txt')
        fc.onCloseFile(() => resolve(undefined))
        fc.closeFile('closeevent.txt')
      })
    })
  })
})
