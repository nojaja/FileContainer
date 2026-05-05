# 受け入れ条件 v1.0.2

## 概要

本ドキュメントは FileContainer ライブラリ v1.0.2 の受け入れ条件と設計判断を記録する。

---

## 1. TypeScript 移行

| # | 条件 | 検証方法 |
|---|------|---------|
| 1 | `src/` に全ソースファイル（4クラス + index.ts）が存在すること | `ls src/` |
| 2 | `npm run type-check` がエラーゼロで完了すること | CI |
| 3 | `npm run build` が `dist/bundle.js` を生成すること | CI |
| 4 | 既存の `tests/unit/FileContainer.spec.js` が全件パスすること | `npm test` |

---

## 2. テストカバレッジ

| # | 条件 | 閾値 |
|---|------|------|
| 5 | `tests/coverage/` に FileData・FileContainer の全メソッドを検証するテストが存在すること | - |
| 6 | `npm run test:ci` がカバレッジ閾値を満たすこと | lines/functions/branches/statements ≥ 50% |
| 7 | テスト合計 81 件以上がパスすること | CI |

---

## 3. コード品質

| # | 条件 | 検証方法 |
|---|------|---------|
| 8 | `npm run lint` がエラーゼロで完了すること | CI |
| 9 | 全 public メソッドに JSDoc（@param/@returns）が付いていること | ESLint jsdoc ルール |
| 10 | Cognitive Complexity ≤ 10 であること | ESLint sonarjs ルール |
| 11 | 重複コード率ゼロ（min-lines:5, min-tokens:50）であること | `npm run cpd` |

---

## 4. 依存関係

| # | 条件 | 検証方法 |
|---|------|---------|
| 12 | 循環依存が存在しないこと | `npm run depcruise` |
| 13 | 孤立モジュールが存在しないこと（警告は許容） | `npm run depcruise` |

---

## 5. ドキュメント生成

| # | 条件 | 検証方法 |
|---|------|---------|
| 14 | `npm run docs` が `docs/typedoc-md/` を生成すること | CI |

---

## 設計判断

### D-01: `setAutoType()` のルックアップテーブル化

- **問題**: if-else チェーンによる Cognitive Complexity 超過リスク
- **決定**: `AUTO_TYPE_MAP: TypeEntry[]` を定数として定義し `Array.find()` で解決
- **理由**: 拡張子追加時の変更箇所を1行に限定し、テスト容易性を向上させるため

### D-02: `getDirectories()` / `getFiles()` の private メソッド分割

- **問題**: ループ内分岐の組み合わせで Cognitive Complexity が上限超過
- **決定**: `collectRootDirectory()`, `collectChildDirectory()`, `collectRootFile()`, `collectChildFile()` の4メソッドに分割
- **理由**: 各処理を独立して単体テスト・保守できるようにするため

### D-03: `getGistData()` の型バグ修正

- **問題**: `!x[1].content == ""` は `(boolean) == ""` であり常に `false`、フィルタが機能していなかった
- **決定**: `value.content !== ''` に修正し `@ts-ignore` を削除
- **理由**: 空コンテンツのファイルをGistから除外する本来の仕様を正しく実装するため

### D-04: `setEditorDatas()` のルックアップテーブル化

- **問題**: 拡張子判定の if-else チェーンが 7 分岐で Cognitive Complexity 超過
- **決定**: `EDITOR_TYPE_MAP: EditorTypeEntry[]` を定数として定義し `Array.find()` で解決
- **理由**: FileData の `setAutoType()` と一貫したパターンを採用し保守性を高めるため

### D-05: ESLint フラットコンフィグ（ESLint 9）採用

- **理由**: ESLint 9 では `.eslintrc.*` が非推奨のため、`eslint.config.js` を採用

### D-06: Jest を ^29 へアップグレード

- **理由**: `ts-jest` が `jest@^29` を要求するため。既存テストの修正は不要だった

### D-07: `jest.coverage.config.js` を分離

- **理由**: カバレッジ閾値の強制（CI用）と通常テスト実行（開発用）を分離するため
