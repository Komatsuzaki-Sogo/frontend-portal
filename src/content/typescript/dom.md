---
title: 'JS / TSガイドライン：DOM操作とイベントハンドリング'

publishDate: 2026-06-01

category: 'typescript'

order: 2
---
- [要素の取得方法（querySelectorの統一）](#要素の取得方法queryselectorの統一)
- [命名規則（HTML・CSSとの連携、js-接頭辞）](#命名規則htmlcssとの連携js-接頭辞)
- [イベントハンドリングとメモリリーク対策](#イベントハンドリングとメモリリーク対策)

## 要素の取得方法（querySelectorの統一）

HTML内の要素（DOM）をJavaScript側で取得・操作する際は、記述のブレをなくし、複雑な条件での取得にも柔軟に対応できるよう、使用するメソッドを統一します。

* **`querySelector` / `querySelectorAll` への統一：**
  要素を1件だけ取得する場合は `document.querySelector()`、該当する要素をすべて取得（配列ライクなNodeListとして取得）する場合は `document.querySelectorAll()` を標準として使用してください。
* **古いメソッドの使用禁止：**
  `getElementById()` や `getElementsByClassName()`、`getElementsByTagName()` などの古いメソッドは、取得結果のデータ型（HTMLCollection）の扱いが扱いづらく、コードの統一性を欠くため原則として使用を禁止します。

```typescript
// BAD
const modal = document.getElementById('js-modal');
const tabItems = document.getElementsByClassName('js-tab__item');

// GOOD
const modal = document.querySelector('.js-modal');
const tabItems = document.querySelectorAll('.js-tab__item');
```

## 命名規則（HTML・CSSとの連携、js-接頭辞）

JavaScriptで操作・フック（取得）するための要素ターゲットは、デザイン（見た目）を定義するCSSの記述と完全に切り離して管理する必要があります。

- `js-` 接頭辞（プレフィックス）の必須化：
JavaScriptの操作対象とする要素のクラス名には、必ず `js-`（例：`.js-modal-trigger`, `.js-drawer-toggle`）から始まるクラスを付与してください。
- `js-` クラスへのスタイル（CSS）記述の完全禁止：
`js-` がついたクラスに対して、CSS側でカラーやマージンなどのスタイルを決して当ててはいけません。
- データ属性（`data-*`）の活用（推奨）：
コンポーネントにIDや設定値などの「データ」をJS側へ渡したい場合は、クラス名に混ぜるのではなく `data-modal-id="01"` のようなデータ属性を使用してください。

## イベントハンドリングとメモリリーク対策

ユーザーのクリックやスクロールなどの挙動（イベント）を監視して処理を走らせる際は、ブラウザのメモリを無駄に消費し続ける「メモリリーク（画面が次第に重くなる現象）」や、多重発火のバグを防止する記述を徹底します。

- `addEventListener` の使用：
イベントを登録する際は、必ず `addEventListener` を使用します。古い `element.onclick = ...` のような記述は、1つの要素に複数のイベントを登録した際に上書きされて消えてしまうため禁止です。
- 不要になったイベントの解除：
ページ遷移（SPA環境など）や、要素そのものが画面から削除（動的なDOM削除）される場合、登録したイベントがブラウザのメモリに残り続けてしまいます。不要になったタイミングで必ず `removeEventListener` を実行してイベントを掃除（クリーンアップ）してください。
- `removeEventListener` を行うための注意：
イベントを解除するためには、登録時と同じ「名前付きの関数」を渡す必要があります。登録時にアロー関数の匿名関数（その場限りの使い捨て関数）を直接書き込んでしまうと、後から解除できなくなるため注意してください。

```typescript
// BAD
trigger.addEventListener('click', (event) => {
  event.preventDefault();
  // 処理...
});
const trigger = document.querySelector('.js-dropdown-trigger');

// GOOD
const handleDropdown = (event) => {
  event.preventDefault();
  // ドロップダウンを開閉するロジック
};

// イベントの登録
trigger.addEventListener('click', handleDropdown);

// 画面遷移やコンポーネント破棄のタイミングで、きれいに掃除する
const cleanup = () => {
  trigger.removeEventListener('click', handleDropdown);
};
```

### 1回しか実行しないイベントのスマートな記述（once: true）

「画面を開いた最初の1回だけ実行したい処理（例：初期化アニメーションのトリガーなど）」の場合は、わざわざ `remove` を手動で書かなくても、オプションに `{ once: true }` を渡すだけで、ブラウザが実行後に自動でイベントを自爆（消去）してくれます。実務で非常に重宝するため積極的に活用してください。

```typescript
document.addEventListener('scroll', initializeAnimation, { once: true });
```