[**@nojaja/filecontainer**](../README.md)

***

[@nojaja/filecontainer](../README.md) / FileData

# Class: FileData

Defined in: [FileData.ts:63](https://github.com/nojaja/FileContainer/blob/3cc785cedf2cbec62bb9bb1d6e62affc860797ff/src/FileData.ts#L63)

処理名: ファイルデータ管理クラス

処理概要:
単一ファイルのメタデータ（ファイル名・MIMEタイプ・言語・コンテンツ等）を保持・操作するクラス。

実装理由:
ファイルの属性を一元管理し、拡張子によるMIMEタイプ自動判定を提供するため。

## Constructors

### Constructor

> **new FileData**(`file?`): `FileData`

Defined in: [FileData.ts:75](https://github.com/nojaja/FileContainer/blob/3cc785cedf2cbec62bb9bb1d6e62affc860797ff/src/FileData.ts#L75)

処理名: コンストラクタ

処理概要: ファイルデータオブジェクトまたはFileDataインスタンスから初期化する。

実装理由: 生オブジェクトとFileDataインスタンスの両方に対応するため。

#### Parameters

##### file?

`FileData` \| `Partial`\<[`FileDataRaw`](../interfaces/FileDataRaw.md)\>

初期化データ

#### Returns

`FileData`

## Properties

### file

> `protected` **file**: [`FileDataRaw`](../interfaces/FileDataRaw.md)

Defined in: [FileData.ts:65](https://github.com/nojaja/FileContainer/blob/3cc785cedf2cbec62bb9bb1d6e62affc860797ff/src/FileData.ts#L65)

ファイルの生データ

## Methods

### getContent()

> **getContent**(): `string`

Defined in: [FileData.ts:196](https://github.com/nojaja/FileContainer/blob/3cc785cedf2cbec62bb9bb1d6e62affc860797ff/src/FileData.ts#L196)

処理名: コンテンツ取得

処理概要: ファイルのテキストコンテンツを返す。コンテンツが未設定の場合は空文字を返す。

実装理由: null/undefined を返さず常に文字列を返すことで呼び出し側の安全性を確保するため。

#### Returns

`string`

コンテンツ文字列

***

### getDescription()

> **getDescription**(): `string`

Defined in: [FileData.ts:265](https://github.com/nojaja/FileContainer/blob/3cc785cedf2cbec62bb9bb1d6e62affc860797ff/src/FileData.ts#L265)

処理名: 説明取得

処理概要: ファイルの説明テキストを返す。

実装理由: ファイルの説明を外部から参照できるようにするため。

#### Returns

`string`

説明テキスト

***

### getFileData()

> **getFileData**(): [`FileDataRaw`](../interfaces/FileDataRaw.md)

Defined in: [FileData.ts:277](https://github.com/nojaja/FileContainer/blob/3cc785cedf2cbec62bb9bb1d6e62affc860797ff/src/FileData.ts#L277)

処理名: ファイルデータ取得

処理概要: ファイルの生データオブジェクトを返す。

実装理由: シリアライズや他のクラスへの受け渡しに使用するため。

#### Returns

[`FileDataRaw`](../interfaces/FileDataRaw.md)

ファイル生データ

***

### getFileDataJson()

> **getFileDataJson**(): `string`

Defined in: [FileData.ts:289](https://github.com/nojaja/FileContainer/blob/3cc785cedf2cbec62bb9bb1d6e62affc860797ff/src/FileData.ts#L289)

処理名: ファイルデータJSON取得

処理概要: ファイルの生データをJSON文字列として返す。

実装理由: ファイルデータをJSON形式で保存・通信するため。

#### Returns

`string`

JSON文字列

***

### getFilename()

> **getFilename**(): `string`

Defined in: [FileData.ts:240](https://github.com/nojaja/FileContainer/blob/3cc785cedf2cbec62bb9bb1d6e62affc860797ff/src/FileData.ts#L240)

処理名: ファイル名取得

処理概要: 設定されているファイル名を返す。

実装理由: ファイル名を外部から参照できるようにするため。

#### Returns

`string`

ファイル名

***

### getFileType()

> **getFileType**(): `string`

Defined in: [FileData.ts:133](https://github.com/nojaja/FileContainer/blob/3cc785cedf2cbec62bb9bb1d6e62affc860797ff/src/FileData.ts#L133)

処理名: ファイルタイプ取得

処理概要: ファイルタイプを返す。

実装理由: ファイルタイプを外部から参照できるようにするため。

#### Returns

`string`

ファイルタイプ

***

### getLanguage()

> **getLanguage**(): `string`

Defined in: [FileData.ts:108](https://github.com/nojaja/FileContainer/blob/3cc785cedf2cbec62bb9bb1d6e62affc860797ff/src/FileData.ts#L108)

処理名: 言語取得

処理概要: ファイルの言語識別子を返す。

実装理由: エディタ側が現在の言語設定を参照できるようにするため。

#### Returns

`string`

言語識別子

***

### getSize()

> **getSize**(): `number`

Defined in: [FileData.ts:170](https://github.com/nojaja/FileContainer/blob/3cc785cedf2cbec62bb9bb1d6e62affc860797ff/src/FileData.ts#L170)

処理名: ファイルサイズ取得

処理概要: ファイルサイズ（バイト）を返す。

実装理由: ファイルサイズ情報を外部から参照できるようにするため。

#### Returns

`number`

サイズ（バイト）

***

### getType()

> **getType**(): `string`

Defined in: [FileData.ts:158](https://github.com/nojaja/FileContainer/blob/3cc785cedf2cbec62bb9bb1d6e62affc860797ff/src/FileData.ts#L158)

処理名: MIMEタイプ取得

処理概要: ファイルのMIMEタイプを返す。

実装理由: 配信時のContent-Type設定に利用するため。

#### Returns

`string`

MIMEタイプ

***

### remove()

> **remove**(): `void`

Defined in: [FileData.ts:301](https://github.com/nojaja/FileContainer/blob/3cc785cedf2cbec62bb9bb1d6e62affc860797ff/src/FileData.ts#L301)

処理名: ファイル削除

処理概要: ファイルのコンテンツを空にし、truncatedフラグをtrueに設定する。

実装理由: ファイルを論理削除としてマークするため（物理削除はコンテナ側で行う）。

#### Returns

`void`

***

### setAutoType()

> **setAutoType**(`filename`): `void`

Defined in: [FileData.ts:224](https://github.com/nojaja/FileContainer/blob/3cc785cedf2cbec62bb9bb1d6e62affc860797ff/src/FileData.ts#L224)

処理名: 自動タイプ設定

処理概要: ファイル名の拡張子からMIMEタイプと言語識別子を自動判定して設定する。

実装理由: 拡張子ごとのMIMEタイプをテーブルで一元管理し、
分岐なしで判定できる設計にすることで保守性を高めるため。

#### Parameters

##### filename

`string`

判定対象のファイル名

#### Returns

`void`

***

### setContent()

> **setContent**(`content`): `string`

Defined in: [FileData.ts:183](https://github.com/nojaja/FileContainer/blob/3cc785cedf2cbec62bb9bb1d6e62affc860797ff/src/FileData.ts#L183)

処理名: コンテンツ設定

処理概要: ファイルのテキストコンテンツを設定し、設定値を返す。

実装理由: コンテンツを更新しつつ設定値を呼び出し元へ返すため。

#### Parameters

##### content

`string`

設定するコンテンツ文字列

#### Returns

`string`

設定したコンテンツ

***

### setDescription()

> **setDescription**(`description`): `void`

Defined in: [FileData.ts:253](https://github.com/nojaja/FileContainer/blob/3cc785cedf2cbec62bb9bb1d6e62affc860797ff/src/FileData.ts#L253)

処理名: 説明設定

処理概要: ファイルの説明テキストを設定する。

実装理由: ファイルに付加情報としての説明を持たせるため。

#### Parameters

##### description

`string`

説明テキスト

#### Returns

`void`

***

### setFilename()

> **setFilename**(`filename`): `void`

Defined in: [FileData.ts:209](https://github.com/nojaja/FileContainer/blob/3cc785cedf2cbec62bb9bb1d6e62affc860797ff/src/FileData.ts#L209)

処理名: ファイル名設定

処理概要: ファイル名を設定し、拡張子に基づいてMIMEタイプと言語を自動更新する。

実装理由: ファイル名変更時にMIMEタイプ・言語を常に整合させるため。

#### Parameters

##### filename

`string`

設定するファイル名

#### Returns

`void`

***

### setFileType()

> **setFileType**(`fileType`): `void`

Defined in: [FileData.ts:121](https://github.com/nojaja/FileContainer/blob/3cc785cedf2cbec62bb9bb1d6e62affc860797ff/src/FileData.ts#L121)

処理名: ファイルタイプ設定

処理概要: ファイルタイプ（拡張子ベースの短縮形）を設定する。

実装理由: ファイルタイプを独立して管理するため。

#### Parameters

##### fileType

`string`

ファイルタイプ文字列

#### Returns

`void`

***

### setLanguage()

> **setLanguage**(`language`): `void`

Defined in: [FileData.ts:96](https://github.com/nojaja/FileContainer/blob/3cc785cedf2cbec62bb9bb1d6e62affc860797ff/src/FileData.ts#L96)

処理名: 言語設定

処理概要: ファイルの言語識別子を設定する。

実装理由: エディタでのシンタックスハイライト言語を外部から変更できるようにするため。

#### Parameters

##### language

`string`

言語識別子

#### Returns

`void`

***

### setType()

> **setType**(`type`): `void`

Defined in: [FileData.ts:146](https://github.com/nojaja/FileContainer/blob/3cc785cedf2cbec62bb9bb1d6e62affc860797ff/src/FileData.ts#L146)

処理名: MIMEタイプ設定

処理概要: ファイルのMIMEタイプを設定する。

実装理由: HTTP配信時のContent-Typeに使用するMIMEタイプを管理するため。

#### Parameters

##### type

`string`

MIMEタイプ文字列

#### Returns

`void`
