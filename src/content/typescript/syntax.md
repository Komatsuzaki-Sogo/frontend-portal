---
title: '基本原則とモダン構文'

publishDate: 2026-06-01

category: 'typescript'

order: 1
---
- [変数・定数の宣言（const / let）](#変数定数の宣言const--let)
- [関数定義（アロー関数）](#関数定義アロー関数)
- [文字列の結合（テンプレートリテラル）](#文字列の結合テンプレートリテラル)
- [安全なプロパティ参照（オプショナルチェイニング）](#安全なプロパティ参照オプショナルチェイニング)
- [マジックナンバーの禁止](#マジックナンバーの禁止)
- [レスポンシブルール](#レスポンシブルール)
- [非同期処理の記述規則（Asynchronous）](#非同期処理の記述規則asynchronous)
- [モジュールシステムとファイル分割](#モジュールシステムとファイル分割)
- [XSS（クロスサイトスクリプティング）の防止](#xssクロスサイトスクリプティングの防止)
- [無駄な処理の削減（デバウンス と スロットル）](#無駄な処理の削減デバウンスとスロットル)

## 変数・定数の宣言（const / let）

プログラム内でデータを一時的に保持するための変数・定数の宣言は、スコープを明確にし、予期せぬデータの書き換え（先祖返りや衝突バグ）を防ぐために厳格に使い分けてください。

* **`const` を原則標準とする：**\
  一度代入した値を後から書き換える必要がない（再代入しない）場合は、すべて `const`（定数）で宣言します。実務における変数の 9 割以上は `const` で定義可能です。
* **再代入が必要な場合のみ `let` を使用する：**\
  ループ処理のカウンターや、条件分岐によって後から中身を入れ替える変数にのみ `let` を使用します。
* **`var` の使用は完全禁止：**\
  古い仕様である `var` は、変数の重複宣言ができてしまい、スコープ（有効範囲）が広すぎて予期せぬバグを引き起こすため、すべてのプロジェクトにおいて使用を完全に禁止します。

```typescript
// BAD
var totalAmount = 1000; // varは完全禁止
let userName = '山田太郎'; // 後から書き換えないならconstにする

// GOOD
let totalAmount = 1000;
const userName = '山田太郎';
```

## 関数定義（アロー関数）

複数の処理をまとめる関数の定義は、コードの記述を簡潔にし、JavaScript 特有の「`this` のスコープのバグ」を回避するためにモダンな構文に統一します。

- 原則として、すべての関数定義およびコールバック関数（イベント発火時や配列処理の内部など）においてアロー関数（`() => {}`）構文を標準とします。
- 従来の `function` 構文は、関数が実行される場所によって内部の `this` の意味（指し示すオブジェクト）が勝手に変わってしまう性質があり、オブジェクト指向やイベント処理でバグの原因になりがちでした。アロー関数は「定義された場所」の `this` を常に維持するため安全です。

```typescript
// BAD
function calculateTotal(price, count) {
  return price * count;
}

// GOOD
const calculateTotal = (price, count) => {
  return price * count;
};

// 処理が1行、かつ即時リターンできる場合は { } と return を省略可能
const double = (num) => num * 2;
```

## 文字列の結合（テンプレートリテラル）

テキストと変数（プログラム内のデータ）を組み合わせて新しい文字列を作る際は、視覚的に構造が理解しやすく、タイポを防止できる構文を使用してください。

- 文字列の中に変数を埋め込む場合は、シングルクォーテーションやプラス演算子による結合は行わず、必ずテンプレートリテラルを使用してください。
- 埋め込む変数は ${変数名} の形で記述します。
- テンプレートリテラル内では、途中で改行を入れてもそのまま文字列の改行として認識されるため、HTMLのコーディングなどをJS側で行う際にも非常に有効です。

```typescript
const itemPrice = 2980;
const userName = '田中';

// BAD
const message = userName + '様、ご購入ありがとうございます。合計金額は ' + itemPrice + '円 です。';

// GOOD
const message = `${userName}様、ご購入ありがとうございます。合計金額は ${itemPrice}円 です。`;
```

## 安全なプロパティ参照（オプショナルチェイニング）

外部のAPIから取得したデータや、複雑なオブジェクト（連想配列）の深い階層にあるデータを参照する際、データが存在しなかった場合（`null` や `undefined`）にプログラムが途中でクラッシュして画面がフリーズするのを防ぐためのルールです。

- オブジェクトの内部のプロパティ（値）が存在するか不確定な階層を掘り下げる場合は、ドット（`.`）の代わりに `?.`（オプショナルチェイニング） を使用して安全にアクセスしてください。
- `?.` を使用すると、途中の階層のデータが空（存在しない）であっても、エラーを出してプログラムを強制終了させることなく、自動的に結果を undefined として安全に返してくれます。

```typescript
const userData = {
  id: 99,
  name: '佐藤',
  profile: {
    age: 28
    // sns 項目が存在しない
  }
};

// BAD
const twitterId = userData.profile.sns.twitter;

// GOOD
const twitterId = userData.profile.sns?.twitter;
console.log(twitterId); // 結果: undefined (画面はクラッシュしない)
```

## マジックナンバーの禁止

マジックナンバーは、別名「動く爆弾」です。
プログラムやスタイルシートを記述する際、その数値が使われている理由や根拠（デザインシステム上の規定など）が他の開発者に伝わらない、暗黙的な数値（マジックナンバー）を直接コードに記述してはいけません。

* **JS/TSにおけるマジックナンバー：**\
  `if (user.status === 3)` の `3` や、`const timeout = 86400000;` などの「その数字が何を意味しているのかパッと見で分からない数字」を指します。
* **理由のない微調整の禁止：**\
  デザインデータと数ピクセル合わないからといって、理由のないネガティブマージン（`-3px` など）や位置調整をその場しのぎで行ってはいけません。必ず Flexbox や Grid の配置ルール、あるいは要素のコンポーネント設計自体を見直してください。

```typescript
// BAD
const ONE_DAY_MILLISECONDS = 86400000;
// GOOD
const ONE_DAY_MILLISECONDS = 24 * 60 * 60 * 1000;
```

## レスポンシブルール

画面の横幅に応じてJavaScript/TypeScriptの処理を切り替える（例：スマホ時のみハンバーガーメニュー用のスクリプトを有効にする、PC時のみホバー演出を有効にする等）場合は、`resize` イベントではなく、必ず **`window.matchMedia`** と **`change` イベント** を使用して動的に検知してください。

### なぜ `resize` ではなく `matchMedia` なのか（背景）

* **圧倒的なパフォーマンス向上：**\
  `resize` イベントは、ウインドウ幅が1px変わるごとに何百回も処理が走るため、前述の「デバウンス」などで間引く必要がありました。
  一方、`matchMedia` の `change` イベントは、画面幅が**指定したブレイクポイント（例：768px）を「またいだ瞬間（ON/OFFが切り替わった時）」にしか発火しない**ため、ブラウザの描画負荷を極限まで抑えることができます。

```typescript
// utility/utilities.ts
/**
 * ブレイクポイント (MediaQueryListで参照されるメジャーブレイクポイント)
 * ※CSS側の @media (min-width: 768px) と数値を必ず統一すること
 */
export const BREAK_POINT = 768;

/**
 * matchMediaオブジェクトの生成
 */
export const mql: MediaQueryList = window.matchMedia(`(min-width: ${BREAK_POINT}px)`);

// sample.ts
/**
 * 画面幅の切り替わり時に実行したいレスポンシブ処理
 * @param event MediaQueryListEvent、または初期実行用のMediaQueryList
 */
const handleMediaQueryChange = (event: MediaQueryListEvent | MediaQueryList): void => {
  if (event.matches) {
    // 768px以上（PC・タブレットサイズ）の場合の処理
    console.log('PC・タブレット用スクリプトを実行します');
    // 例：スマホ用メニューの強制クローズ処理など
  } else {
    // 768px未満（スマホサイズ）の場合の処理
    console.log('スマホ用スクリプトを実行します');
  }
};

// 1. ページ読み込み（初期化）時に、現在の画面幅に応じた処理をはじめに1回実行しておく
handleMediaQueryChange(mql);

// 2. 画面幅がブレイクポイントをまたいだ瞬間のイベント（change）を登録
mql.addEventListener('change', handleMediaQueryChange);
```

## 非同期処理の記述規則（Asynchronous）

APIからのデータ取得（`Fetch` / `Axios`通信）やタイマー処理、ファイルの読み込みなど、結果が返ってくるまでに時間がかかる「非同期処理」を実装する際は、コードの可読性を高め、エラーによる画面のフリーズ（クラッシュ）を完全に防ぐために、以下の規則に必ず従ってください。

* **`async / await` 構文の標準化：**\
  非同期処理を記述する際は、従来の `.then().catch()` を使ったメソッドチェーン（プロミスチェーン）ではなく、同期処理（上から下へ流れる通常のコード）と同じように上から順に読める **`async / await`** 構文を標準として使用してください。
* **例外処理（エラーハンドリング）の必須化：**\
  `await` を使用する非同期処理の周りは、**必ず `try / catch` ブロックで囲む**か、プロジェクト共通のエラーハンドラー関数（共通キャッチ処理）を通してください。通信エラー（オフライン、500エラー等）が発生した際に、JavaScriptが途中でクラッシュして画面操作が一切受け付けなくなる致命的なバグを防ぎます。
* **並列実行（`Promise.all`）の活用：**\
  互いに依存関係のない複数の非同期処理（例：ユーザー情報と、別APIの商品一覧を同時に取得するなど）を同時に実行する場合は、1つずつ順番に `await` するのではなく、**`Promise.all()`** を使用して並列（同時）に処理を実行し、ユーザーの待ち時間を最小限に抑えてください。

### 基本的な非同期処理とエラーハンドリング

```typescript
// async/awaitで同期的に読めるようにし、try/catchでエラーを確実に捕まえる
const fetchUserProfile = async (userId) => {
  try {
    // 通信が成功する前提のメインロジック
    const response = await fetch(`https://api.example.com/users/${userId}`);

    if (!response.ok) {
      throw new Error(`不適切なレスポンス: ${response.status}`);
    }

    const userData = await response.json();
    return userData;

  } catch (error) {
    // ⚠️ 予期せぬエラー（ネットワーク切断、サーバーダウン等）が起きた時のフォールバック
    console.error('ユーザー情報の取得に失敗しました:', error);
    showErrorMessage('データの読み込みに失敗しました。電波状況をご確認ください。');
    return null;
  }
};
```

### 複数APIの並列実行（パフォーマンス最適化）

```typescript
// 互いに関連性のないデータ取得は Promise.all で同時に走らせる
const loadDashboardData = async () => {
  try {
    // 2つの通信を同時に開始し、両方が完了するまで待つ（実行時間が劇的に短縮されます）
    const [news, banners] = await Promise.all([
      fetch('/api/news').then(res => res.json()),
      fetch('/api/banners').then(res => res.json())
    ]);

    renderDashboard(news, banners);
  } catch (error) {
    console.error('ダッシュボードデータの読み込みエラー:', error);
  }
};
```

### なぜこのルールが必要なのか（背景・ユーザー体験）

非同期処理の最大の特徴は、「いつ結果が返ってくるか、あるいは失敗するか、ブラウザ側ではコントロールできない」 点にあります。

#### なぜ .then() ではなく async / await なのか

コードの見た目を「人間が理解しやすい状態」に保つためです。`.then()` のチェーンや入れ子は、処理が複雑化するとコードの右側がどんどん深くなる「コールバック地獄」を引き起こし、バグの発見が非常に遅れます。async / await を使えば、通常の変数代入と同じ見た目で非同期処理を扱えるため、コードの可読性が格段に向上します。

#### 2. なぜ try / catch が命なのか

通信の世界において、「エラーが絶対に起きない」ということはあり得ません。

- ユーザーが地下鉄に入って電波が突然途切れた（Network Error）
- 社内サーバーが一時的にメンテナンスに入った（503 Service Unavailable）
- 渡されたデータの形式が想定と違っていた（JSON Parse Error）

これらが起きたとき、`try / catch` でエラーを適切に「捕獲（キャッチ）」しておかないと、ブラウザはそれ以降のJavaScriptの実行をすべてストップさせてしまいます。ボタンを押しても反応しない、画面が真っ白のまま、ローディングのぐるぐるが消えない、といった最悪のユーザー体験（UX）を防ぐために、非同期処理の周囲には必ずセーフティネット（`try / catch`）を張ることをプロジェクト全体の義務とします。

## モジュールシステムとファイル分割

プログラムの規模が大きくなるにつれて、1つのファイルにすべての処理を記述すると可読性が著しく低下し、バグの温床になります。機能ごとにファイルを適切に切り離し（コンポーネント化・モジュール化）、それらを安全に組み合わせて開発を行うための設計ルールを定めます。

* **ES Modules（import / export）の標準化：**\
  ファイルの分割と読み込みには、JavaScript標準の仕様である **`import`** および **`export`** 構文を使用してください。古いNode.js環境向けの `require()` や `module.exports` の使用は原則禁止とします。
* **「1ファイル＝1機能（単一責任の原則）」の徹底：**\
  1つのJavaScript/TypeScriptファイルには、原則として1つの主要な役割（例：1つのコンポーネント、1つの共通ヘルパー関数群、1つのデータ型定義）のみを持たせてください。ファイルが300行を超える場合は、ファイル分割（リファクタリング）の検討基準とします。
* **パスエイリアス（@/）の活用による相対パスの禁止：**\
  階層が深いファイルから他のモジュールを読み込む際、`../../../../components/Button` のような深い相対パス（ドットの連続）を記述してはいけません。ディレクトリ構造の変更に弱くなるため、必ずプロジェクトのルートを指す **パスエイリアス（`@/components/Button` など）** を設定・使用してください。
* **名前付きエクスポート（Named Export）の推奨：**\
  エディタの自動インポート機能やリファクタリング（一括名前変更）の恩恵を最大限に受けるため、`export default` ではなく、名前を明示する **名前付きエクスポート（`export const MyFunc = ...`）** の使用を推奨します。

```typescript
// main.ts
import './components/accordion';

// accordion.ts
/**
 * 特定のリンクにアイコンを設定
 * @param links - アイコンを設定するリンクのリスト
 */
export const setAccordion = (accordionRoot) => {
  // アコーディオンの処理
};

/**
 * 実行
 */
(() => {
  const accordionElements = document.querySelectorAll('.js-accordion');

  if (!accordionElements.length) {
    return;
  }

  setAccordion(accordionElements);
})();
```

## XSS（クロスサイトスクリプティング）の防止

ユーザーが入力した文字列や、URLのパラメータ（クエリ情報）をブラウザ上に表示・出力する際は、悪意のあるスクリプトがページ内で勝手に実行されるセキュリティ脆弱性 **「XSS（Cross-Site Scripting / クロスサイトスクリプティング）」** を完全に防止するため、以下の防衛ルールを厳格に遵守してください。

* **`innerHTML` および `insertAdjacentHTML` の原則禁止：**\
  JavaScriptで画面にテキストを出力する際、`innerHTML` を使用してはいけません。代入された文字列に万が一 `<script>` タグや悪意のある属性（`onload` や `onerror` など）が含まれていた場合、ブラウザがそれを「本物のHTMLコード」として解釈・実行してしまいます。
* **`textContent` または `innerText` の標準化：**\
  単なるテキスト（ユーザー名、コメント、記事の本文など）を出力する場合は、必ず **`textContent`** を使用してください。万が一タグが含まれていても、ブラウザはそれをただの「文字列（記号）」として安全にエスケープして表示します。
* **エスケープ処理（サニタイズ）の徹底：**\
  リッチテキストエディタの出力など、どうしても動的にHTMLタグを出力せざるを得ない場合は、生のデータをそのまま出力することは完全に禁止（NG）とします。必ず信頼できる実績のあるサニタイズライブラリ（`DOMPurify` など）を通して、危険なタグや属性を完全に「無害化（除去）」してから出力してください。

### コード例（Vanilla JS 環境の場合）

#### 正しい実装1：単なるテキストの出力（エスケープ）

```typescript
const text = 'text';
const commentArea = document.querySelector('.js-comment-area');

// BAD
commentArea.innerHTML = userInput;

// GOOD
commentArea.textContent = userInput;
```

#### HTML構造の動的追加（template要素の活用）

```typescript
// BAD
const inputBody = '<img src="invalid.jpg" onerror="alert(\'脆弱性あり\')">';
const commentList = document.querySelector('.js-comment-list');

// ❌ 危険：画像読み込みエラー（onerror）をトリガーに、JavaScriptが実行されてしまいます
commentList.innerHTML = `
  <div class="c-commentCard">
    <p class="c-commentCard__body">${inputBody}</p>
  </div>
`;

// GOOD
// ユーザーからの入力値（悪意のあるスクリプトが混入していると仮定）
const inputName = '攻撃者X';
const inputBody = '<img src="x" onerror="alert(\'XSS\')">こんにちは！';

const commentList = document.querySelector('.js-comment-list');
// 1. template要素から中身（DocumentFragment）を取得
const template = document.getElementById('comment-template');

// 2. 雛形をディープコピー（複製）する
const clone = template.content.cloneNode(true);

// 3. 複製したDOMノードに対して「textContent」で安全に値を代入する
// （これにより、inputBody内の悪意のあるimgタグはただの文字列に無害化されます）
clone.querySelector('.c-commentCard__userName').textContent = inputName;
clone.querySelector('.c-commentCard__body').textContent = inputBody;

// 4. 安全に組み立てられたクローンを画面（DOMツリー）に追加する
commentList.appendChild(clone);
```

### コード例（モダンフロントエンド環境の場合）

React や Vue などのモダンフレームワークは、デフォルトで強力なXSS防止機能（自動エスケープ）が組み込まれていますが、「あえてエスケープを無効化する危険なオプション」が用意されています。これらを実務で使用する際は、細心の注意が必要です。

```typescript
import DOMPurify from 'dompurify';

// BAD
// サニタイズせず生のHTMLデータをそのまま展開している
const RawHtmlComponent = ({ dirtyHtml }) => {
  return <div dangerouslySetInnerHTML={{ __html: dirtyHtml }} />;
};

// GOOD
// DOMPurify で危険なタグを除去（サニタイズ）してから展開する
const SafeHtmlComponent = ({ dirtyHtml }) => {
  const cleanHtml = DOMPurify.sanitize(dirtyHtml);
  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
};
```

## 無駄な処理の削減（デバウンスとスロットル）

ブラウザのウインドウリサイズ（`resize`）やスクロール（`scroll`）イベントを監視して処理を実行する際は、処理の実行頻度を適切に間引く **「デバウンス（Debounce）」** または **「スロットル（Throttle）」** のいずれかを必ず組み込んでください。
処理を間引くアプローチには2種類あります。
実現したい仕様（挙動）に合わせて正しく使い分けてください。

| 手法                                   | 挙動の性質                                                                                                           | どういうときに使うか（選定基準）                                                                                                                                                                         |
| :------------------------------------- | :------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **デバウンス`<br>`(Debounce)** | 連続して発火している間は処理を無視し、**「操作が完全に止まってから◯ミリ秒後」に1回だけ**処理を実行します。    | ・リサイズが「終わった」タイミングで画面幅に応じたレイアウトを再計算する。`<br>`・テキスト入力欄のタイピングが「止まった」タイミングで検索APIを叩く。                                                  |
| **スロットル`<br>`(Throttle)** | 連続して発火している間、**「一定の時間（◯ミリ秒）が経過するごとに」繰り返し**処理を実行します（間引き実行）。 | ・画面をスクロールしている「最中」に、現在のスクロール位置に合わせて段階的に追従アニメーションやパララックスを動かす。`<br>`・無限スクロールの「最中」に、最下部付近に到達したかを一定間隔で監視する。 |

```typescript
import debounce from 'lodash/debounce';

const handleResize = (): void => {
  // レイアウトの再計算などを実行
};

// 200ミリ秒の間引きを適用
window.addEventListener('resize', debounce(handleResize, 200));
```

```typescript
import throttle from 'lodash/throttle';

const handleResize = (): void => {
  // レイアウトの再計算などを実行
};

// 200ミリ秒の間引きを適用
window.addEventListener('resize', throttle(handleResize, 200));
```
