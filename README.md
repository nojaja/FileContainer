[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/nojaja/FileContainer)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

# FileContainer
JavaScript/TypeScript向けのファイル管理ユーティリティライブラリです。

`@nojaja/filecontainer` は、ファイルの追加・削除・コピー・リネーム、エディタ連携、Gistデータ生成、Service Workerキャッシュ公開などの機能を提供します。

## 主要コンポーネント

- `FileContainer`
  - 複数ファイルをまとめて管理するコンテナ
  - ファイルツリーの取得、ファイル操作、イベント通知、Gist連携などを提供
- `FileData`
  - 単一ファイルのメタデータとコンテンツを管理
  - MIMEタイプ・言語の自動判定、JSONシリアライズ対応
- `EditorFileData`
  - `FileData` を拡張し、Monaco Editorモデル同期をサポート
- `PublishFileContainer`
  - `FileContainer` を拡張し、公開パス配下のファイルをService Workerキャッシュへ保存

## インストール

```bash
npm install @nojaja/filecontainer
```

## 使い方

```ts
import { FileContainer, FileData } from '@nojaja/filecontainer'

const container = new FileContainer()
const file = new FileData({ filename: 'example.txt', content: 'Hello FileContainer!' })

await container.putFile(file)
console.log(container.existFile('example.txt')) // true

const opened = container.openFile('example.txt')
if (opened) {
  opened.setContent('Updated content')
  await container.saveFile('example.txt')
}

console.log(container.getFileRaw('example.txt'))
```

## 主なAPI

### FileContainer

- `setId(id: string): void`
- `getId(): string | number`
- `setProjectName(projectName: string): void`
- `getProjectName(): string | null`
- `getDirectories(parentPath?: string | null): PathEntry[]`
- `getFiles(parentPath?: string | null, all?: boolean): PathEntry[]`
- `getOpenFiles(parentPath?: string | null): string[]`
- `existFile(filename: string): boolean`
- `getFile(filename: string, fileCls?: any, ...constructorParam: any[]): FileData | null`
- `getFileRaw(filename: string): FileDataRaw | null`
- `openFile(filename: string, fileCls?: any, ...constructorParam: any[]): FileData | null`
- `closeFile(filename: string): FileData | null`
- `saveFile(filename: string): Promise<boolean> | false`
- `putFile(file: FileData): Promise<boolean>`
- `copyFile(src: string, dest: string, mode?: number): boolean`
- `renameFile(filename: string, newName: string): boolean`
- `removeFile(filename: string): boolean`
- `clear(): void`
- `init(): void`
- `setPublic(bool: boolean): void`
- `getPublic(): boolean | null`
- `setDescription(description: string): void`
- `getDescription(): string | null`
- `setContainer(container: ContainerData): void`
- `getContainer(): ContainerData | null`
- `setContainerJson(container: string): void`
- `getContainerJson(): string`
- `getGistData(): object`
- `getGistJsonData(): string`
- `getCreatedTime(): number`
- `getLastUpdatedTime(): number`
- `setCreatedTime(createdTime: number): void`
- `setLastUpdatedTime(lastUpdatedTime: number): void`

### FileData

- `constructor(file?: Partial<FileDataRaw> | FileData)`
- `setLanguage(language: string): void`
- `getLanguage(): string`
- `setFileType(fileType: string): void`
- `getFileType(): string`
- `setType(type: string): void`
- `getType(): string`
- `getSize(): number`
- `setContent(content: string): string`
- `getContent(): string`
- `setFilename(filename: string): void`
- `getFilename(): string`
- `setDescription(description: string): void`
- `getDescription(): string`
- `getFileData(): FileDataRaw`
- `getFileDataJson(): string`
- `remove(): void`

## 開発とビルド

### スクリプト

- `npm run build` - Webpackでバンドルを生成
- `npm run test` - Webpackビルド後にJestでカバレッジ付きテスト実行
- `npm run test:ci` - CI向けにカバレッジ収集付きテスト実行
- `npm run lint` - `src/`に対してESLint実行
- `npm run type-check` - TypeScript型チェック
- `npm run docs` - TypeDocでMarkdown形式のAPIドキュメント生成
- `npm run dev` / `npm start` - Webpack `--watch` で開発ビルド

### ビルド構成

- `webpack.config.js` で `src/index.ts` をエントリとし、`dist/bundle.js` を出力
- Babelは `@babel/preset-env` と `@babel/preset-typescript` を使用
- Jestは `babel-jest` で `src/**/*.ts` をトランスパイル

## ドキュメント

- TypeDoc設定は `typedoc.json`
- 出力先は `docs/typedoc-md`

## テスト

- 単体テスト: `tests/unit/**/*.spec.js`
- カバレッジテスト: `tests/coverage/**/*.spec.js`
- カバレッジ判定は `jest.coverage.config.js` で50%以上に設定

## 依存関係

- `@babel/core`, `@babel/preset-env`, `@babel/preset-typescript`
- `babel-jest`, `babel-loader`
- `cross-env`, `eslint`, `typescript`, `webpack`, `webpack-cli`
- `jest`, `ts-jest`, `typedoc`, `typedoc-plugin-markdown`

## ライセンス

MIT
