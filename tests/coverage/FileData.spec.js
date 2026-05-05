import { FileData } from '../../src/FileData'

describe('FileData - constructor', () => {
  test('引数なしで生成できる', () => {
    const fd = new FileData()
    expect(fd.getFilename()).toBe('')
    expect(fd.getFileType()).toBe('txt')
    expect(fd.getType()).toBe('text/plain')
    expect(fd.getLanguage()).toBe('Markdown')
    expect(fd.getSize()).toBe(0)
    expect(fd.getContent()).toBe('')
    expect(fd.getDescription()).toBe('')
  })

  test('オブジェクトを渡して生成できる', () => {
    const fd = new FileData({ filename: 'test.txt', content: 'hello' })
    expect(fd.getFilename()).toBe('test.txt')
    expect(fd.getContent()).toBe('hello')
  })

  test('FileData インスタンスを渡して生成できる', () => {
    const fd1 = new FileData({ filename: 'a.txt', content: 'foo' })
    const fd2 = new FileData(fd1)
    expect(fd2.getFilename()).toBe('a.txt')
    expect(fd2.getContent()).toBe('foo')
  })
})

describe('FileData - setLanguage / getLanguage', () => {
  test('言語を設定・取得できる', () => {
    const fd = new FileData()
    fd.setLanguage('JavaScript')
    expect(fd.getLanguage()).toBe('JavaScript')
  })
})

describe('FileData - setFileType / getFileType', () => {
  test('ファイルタイプを設定・取得できる', () => {
    const fd = new FileData()
    fd.setFileType('json')
    expect(fd.getFileType()).toBe('json')
  })
})

describe('FileData - setType / getType', () => {
  test('MIMEタイプを設定・取得できる', () => {
    const fd = new FileData()
    fd.setType('application/json')
    expect(fd.getType()).toBe('application/json')
  })
})

describe('FileData - getSize', () => {
  test('サイズを取得できる (デフォルト0)', () => {
    const fd = new FileData()
    expect(fd.getSize()).toBe(0)
  })
})

describe('FileData - setContent / getContent', () => {
  test('コンテンツを設定・取得できる', () => {
    const fd = new FileData()
    const result = fd.setContent('hello world')
    expect(result).toBe('hello world')
    expect(fd.getContent()).toBe('hello world')
  })

  test('コンテンツが空の場合は空文字を返す', () => {
    const fd = new FileData()
    expect(fd.getContent()).toBe('')
  })
})

describe('FileData - setFilename / getFilename', () => {
  test('ファイル名を設定・取得できる', () => {
    const fd = new FileData()
    fd.setFilename('example.js')
    expect(fd.getFilename()).toBe('example.js')
  })

  test('ファイル名設定時にautoTypeも更新される', () => {
    const fd = new FileData()
    fd.setFilename('example.json')
    expect(fd.getType()).toBe('application/json')
    expect(fd.getLanguage()).toBe('json')
  })
})

describe('FileData - setAutoType', () => {
  const cases = [
    { filename: 'file.md',       type: 'text/plain',       language: 'Markdown' },
    { filename: 'file.markdown', type: 'text/plain',       language: 'Markdown' },
    { filename: 'file.txt',      type: 'text/plain',       language: 'text' },
    { filename: 'file.json',     type: 'application/json', language: 'json' },
    { filename: 'file.ahtml',    type: 'text/html',        language: 'ahtml' },
    { filename: 'file.html',     type: 'text/html',        language: 'html' },
    { filename: 'file.htm',      type: 'text/html',        language: 'html' },
    { filename: 'file.js',       type: 'text/javascript',  language: 'JavaScript' },
    { filename: 'file.es6',      type: 'text/javascript',  language: 'JavaScript' },
    { filename: 'file.scss',     type: 'text/scss',        language: 'scss' },
    { filename: 'file.css',      type: 'text/css',         language: 'css' },
  ]

  cases.forEach(({ filename, type, language }) => {
    test(`${filename} → type=${type}, language=${language}`, () => {
      const fd = new FileData({ filename })
      expect(fd.getType()).toBe(type)
      expect(fd.getLanguage()).toBe(language)
    })
  })

  test('拡張子なしファイルはデフォルトのまま', () => {
    const fd = new FileData()
    fd.setAutoType('noextension')
    // autoTypeが一致しない場合は変更なし (初期値のまま)
    expect(fd.getType()).toBe('text/plain')
  })
})

describe('FileData - setDescription / getDescription', () => {
  test('説明を設定・取得できる', () => {
    const fd = new FileData()
    fd.setDescription('test description')
    expect(fd.getDescription()).toBe('test description')
  })
})

describe('FileData - getFileData', () => {
  test('ファイルデータオブジェクトを取得できる', () => {
    const fd = new FileData({ filename: 'a.txt', content: 'content' })
    const data = fd.getFileData()
    expect(data.filename).toBe('a.txt')
    expect(data.content).toBe('content')
  })
})

describe('FileData - getFileDataJson', () => {
  test('ファイルデータをJSON文字列で取得できる', () => {
    const fd = new FileData({ filename: 'a.txt' })
    const json = fd.getFileDataJson()
    const parsed = JSON.parse(json)
    expect(parsed.filename).toBe('a.txt')
  })
})

describe('FileData - remove', () => {
  test('remove() でコンテンツが空になり truncated が true になる', () => {
    const fd = new FileData({ filename: 'a.txt', content: 'data' })
    fd.remove()
    expect(fd.getContent()).toBe('')
    const data = fd.getFileData()
    expect(data.truncated).toBe(true)
  })
})
