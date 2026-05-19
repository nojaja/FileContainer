# 受け入れ条件 v1.0.6

## 概要

本ドキュメントは FileContainer ライブラリ v1.0.6 で、Qiita 記事「Dependabotで依存パッケージの更新確認と自動マージ」の内容を本リポジトリへ導入するための設計と受け入れ条件を記録する。

対象は以下。

- Dependabot バージョンアップデート設定
- Dependabot セキュリティアップデート設定
- Dependabot PR 向けの自動テスト実行
- Dependabot PR の条件付き Auto-merge
- ブランチ保護ルールの運用設計

非対象は以下。

- ライブラリ本体機能（src 配下）の仕様変更
- npm publish フロー（既存 release.yml の置き換え）

---

## 1. 設計方針

| # | 方針 | 内容 |
|---|------|------|
| 1 | 既存フロー優先 | 既存の `.github/workflows/release.yml` は維持し、依存更新運用のみを追加する |
| 2 | 安全側デフォルト | 自動マージ対象は Dependabot PR のうち `security update` または `semver-patch` のみに限定する |
| 3 | 検証先行 | 先に Auto-merge を予約し、必須 CI チェック通過後にのみ実マージされる状態を担保する |
| 4 | 追跡可能性 | Auto-merge 判定条件をワークフロー上に明示し、運用判断を監査可能にする |
| 5 | 最小権限 | ワークフロー権限はジョブ単位で最小化する |
| 6 | ブランチ互換 | 現行運用との互換維持のため、v1.0.6 では `main` / `master` の両方を対象にする |

---

## 2. 成果物

| # | 成果物 | 目的 |
|---|--------|------|
| 2-1 | `.github/dependabot.yml` | npm 依存更新 PR を定期生成する |
| 2-2 | `.github/workflows/ci.yml` | PR 時に品質ゲートを実行する |
| 2-3 | `.github/workflows/dependabot-auto-merge.yml` | Dependabot PR の条件付き Auto-merge を行う |
| 2-4 | `README.md` 追記（任意） | 運用ルールと手動介入ポイントを共有する |

注記: v1.0.6 では「設計」を先行し、実装は次フェーズで行う。

---

## 3. 機能要件

### 3.1 Dependabot 設定

| # | 要件 | 受け入れ条件 |
|---|------|-------------|
| 3 | npm エコシステムを監視する | `package-ecosystem: npm` が設定される |
| 4 | ルートディレクトリを監視する | `directory: /` が設定される |
| 5 | 更新を日次で確認する | `schedule.interval: daily` が設定される |
| 6 | 過剰 PR を抑制する | `open-pull-requests-limit: 5` を設定する |
| 6-1 | Dependabot security updates を有効化する | リポジトリ設定で Dependabot security updates が有効化される |

### 3.2 CI 実行

| # | 要件 | 受け入れ条件 |
|---|------|-------------|
| 7 | push / pull_request で CI を起動する | `main` と `master` を対象に CI が起動する |
| 8 | Node バージョン互換を確認する | Node `20.x` と `22.x` のマトリクスでテストされる |
| 9 | 既存品質ゲートを通す | `build`, `type-check`, `depcruise`, `cpd`, `test:ci`, `lint`, `docs` を実行する |
| 9-1 | ブランチ保護用の必須チェック名を固定する | CI ジョブ名を `ci (20.x)` と `ci (22.x)` に固定し、ブランチ保護の必須チェックへ登録できる状態にする |

### 3.3 Auto-merge

| # | 要件 | 受け入れ条件 |
|---|------|-------------|
| 9-2 | Auto-merge ワークフローのイベントを限定する | `pull_request_target` かつ `types: [opened, synchronize, reopened, ready_for_review]` で起動する |
| 10 | Dependabot PR のみ対象 | `github.actor == 'dependabot[bot]'` で制御する |
| 10-1 | Dependabot PR メタデータを取得する | `dependabot/fetch-metadata@v2` を実行し `dependency-type` / `update-type` を参照可能にする |
| 10-2 | セキュリティアラート情報を取得する | `dependabot/fetch-metadata@v2` で `alert-lookup: true` を有効化し、`alert-state` を参照可能にする |
| 11 | バージョン更新のパッチのみ対象 | `update-type == version-update:semver-patch` を自動マージ対象にする |
| 12 | セキュリティ更新を対象にする | `alert-state == 'OPEN'` の PR を自動マージ対象にする |
| 13 | 条件一致 PR を自動マージ予約する | `(update-type == version-update:semver-patch) OR (alert-state == 'OPEN')` のとき `gh pr merge --auto --merge` を実行する |
| 13-1 | CI 未成功時の実マージを防ぐ | Auto-merge 予約済みでも、必須チェック未通過の間はマージされないことを確認する |

---

## 4. 非機能要件

| # | 分類 | 要件 |
|---|------|------|
| 14 | セキュリティ | ワークフロー権限はジョブ単位で最小化する（ワークフロー全体は `permissions: {}`、Auto-merge ジョブにのみ `contents: write` と `pull-requests: write`） |
| 14-1 | セキュリティ | `alert-lookup: true` を使うため、`github-token` は PAT または GitHub App の installation token を使用し、最小権限で Secret 管理する |
| 15 | 可用性 | CI 失敗時は Auto-merge されないこと |
| 16 | 互換性 | 既存の release ワークフローに影響を与えないこと（`release.yml` のトリガー条件を変更しない） |
| 17 | 保守性 | 判定条件（dependency-type / update-type / alert-state）をコメント付きで明記すること |

---

## 5. 運用要件（GitHub 設定）

リポジトリ設定として以下を事前に満たす。

1. Dependabot version updates を有効化する。
2. Dependabot security updates を有効化する。
3. Pull Request の Auto-merge を有効化する。
4. デフォルトブランチにブランチ保護を設定する。
5. 必須ステータスチェックに CI を登録する。
6. ブランチ保護で `Require status checks to pass` を有効化する。
7. ブランチ保護で `Require branches to be up to date before merging` を有効化する。
8. 必須ステータスチェックとして `ci (20.x)` と `ci (22.x)` を登録する。
9. `alert-lookup: true` 用のトークン（PAT または GitHub App token）を Secret に設定する。

受け入れ確認として、以下を満たすこと。

- CI が失敗している Dependabot PR で `Enable auto-merge` が予約されてもマージされない。
- CI 成功後にのみ Auto-merge が実行される。
- `package.json` の version 変更を含まない PR では `release.yml` が起動しない。
- security updates の PR（`alert-state == 'OPEN'`）では Auto-merge が予約される。

---

## 6. リスクと対策

| # | リスク | 対策 |
|---|--------|------|
| 18 | Dependabot マージ後に一部イベントが期待通り起動しない | ドキュメント/配布系ワークフローは `push` と `pull_request` の双方で起動し、デプロイはデフォルトブランチ条件で絞る |
| 19 | 自動マージ条件が広すぎて想定外更新が入る | `security update` または `semver-patch` の OR 条件に固定し、minor/major は対象外にする |
| 20 | CI 実行時間増加 | ジョブ分割とキャッシュ最適化を次フェーズで検討する |

---

## 7. テストケース要約（次フェーズで実装）

| # | テスト観点 | 期待結果 |
|---|-----------|----------|
| 21 | Dependabot PR（devDependency patch） | CI 成功後に auto-merge が有効化される |
| 22 | Dependabot PR（devDependency minor） | auto-merge されない |
| 23 | Dependabot PR（dependency patch） | CI 成功後に auto-merge が有効化される |
| 24 | 人手作成 PR | auto-merge されない |
| 25 | CI 失敗 PR | auto-merge されない |
| 26 | Dependabot PR（metadata 取得失敗） | auto-merge されない（安全側で停止する） |
| 27 | Dependabot PR（予約時点） | CI 未完了でも auto-merge は「予約状態」に留まり、即時マージされない |
| 28 | package.json 非変更 PR | `release.yml` が起動しない |
| 29 | Dependabot PR（synchronize） | PR 更新時に Auto-merge 判定が再実行される |
| 30 | 人手 PR（pull_request_target） | Dependabot 以外では Auto-merge ジョブが実行されない |
| 31 | Dependabot PR（security update） | CI 成功後に Auto-merge が有効化される |
| 32 | Dependabot PR（major update, 非security） | Auto-merge されない |

---

## 7.5 判定タイミングの分離

### v1.0.6（設計レビュー）での完了条件

- 本ドキュメントに、Auto-merge の「予約」と「実マージ」の違いが明記されている。
- 必須ステータスチェック名（`ci (20.x)` / `ci (22.x)`）が明記されている。
- `release.yml` 影響なしの判定基準が明記されている。
- Auto-merge ワークフローのイベントモデル（`pull_request_target` + `types` 限定）が明記されている。
- security updates の扱い（有効化 + 自動マージ対象）が明記されている。

### 次フェーズ（実装レビュー）での完了条件

- `.github/dependabot.yml`, `.github/workflows/ci.yml`, `.github/workflows/dependabot-auto-merge.yml` が要件通り作成される。
- テストケース #21 〜 #32 が実機で検証され、期待結果を満たす。

---

## 8. ロールアウト計画

1. v1.0.6 で設計書を確定する。
2. 次フェーズでワークフローと Dependabot 設定を実装する。
3. テスト用 Dependabot PR で条件判定を検証する。
4. 問題なければ本番運用へ移行する。

---

## 設計判断

### D-01: 自動マージ対象をパッチ更新に限定

- 問題: 依存更新の自動化は便利だが、更新範囲が広いと破壊的変更混入のリスクが上がる。
- 決定: Dependabot PR のうち `security update` または `semver-patch` を自動マージ対象にする。
- 理由: 重要修正と低リスク更新の適用速度を上げつつ、minor/major は手動レビューに残すため。

### D-02: 既存 release.yml と責務分離

- 問題: 依存更新運用を既存リリースフローに混在させると、障害時切り分けが難しくなる。
- 決定: CI と Dependabot auto-merge を別ワークフローとして追加する。
- 理由: リリース自動化と依存更新自動化の責務を分離し、保守性を上げるため。

### D-03: ブランチ保護を前提に Auto-merge を運用

- 問題: Auto-merge 単体では品質担保が不十分。
- 決定: 先に Auto-merge を予約し、必須ステータスチェック通過後にのみ実マージされる運用を前提条件とする。
- 理由: 失敗した更新の混入をプロセスで確実に防ぐため。

### D-04: Dependabot metadata を判定ソースとして利用

- 問題: 依存種別と更新種別を PR タイトルや差分だけで安全に判定するのは困難。
- 決定: `dependabot/fetch-metadata@v2` で取得した `dependency-type` / `update-type` / `alert-state` を判定ソースにする。
- 理由: 判定ロジックの誤検知を抑え、監査可能な条件分岐を維持するため。

### D-05: Dependabot のイベント取りこぼしを運用設計で吸収

- 問題: Dependabot の自動マージ方式によっては一部トリガーが発火しないケースがある。
- 決定: 後続ワークフローを `push` と `pull_request` の双方で受ける設計にする。
- 理由: イベント依存の欠落を冗長化で補い、運用停止を防ぐため。

### D-06: ブランチ対象は v1.0.6 で互換維持

- 問題: 既存運用は `main` と `master` の併用であり、段階移行中に片側のみへ寄せると運用漏れが起きる。
- 決定: v1.0.6 では `main` / `master` の両方を対象にし、単一ブランチ化は別バージョンで判断する。
- 理由: 現行 v1.0.5 運用との非互換リスクを避けるため。

### D-07: Auto-merge は `pull_request_target` とイベント限定で運用

- 問題: `pull_request` トリガーのみでは Dependabot PR の権限制約や再判定タイミング不足で運用が不安定になる。
- 決定: Auto-merge ワークフローは `pull_request_target` を採用し、`opened` / `synchronize` / `reopened` / `ready_for_review` のみで起動する。
- 理由: Dependabot PR の更新時に確実に再判定でき、必要最小権限で安定運用しやすいため。

### D-08: Dependabot security updates と semver-patch を自動マージ対象にする

- 問題: セキュリティ修正とパッチ更新を手動処理すると適用遅延が発生しやすい。
- 決定: Dependabot security updates（`alert-state == 'OPEN'`）と version patch updates（`update-type == version-update:semver-patch`）を自動マージ対象にする。
- 理由: 重要修正の適用速度を上げつつ、minor/major を手動レビューに残してリスクを抑えるため。
