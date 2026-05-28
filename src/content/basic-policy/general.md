---
title: 'ファイル全般の共有ルール'

publishDate: 2026-05-28

category: 'basic-policy'

order: 2
---

- [プロトコル](#プロトコル)
- [行末尾の空白](#行末尾の空白)
- [ファイル末尾の改行](#ファイル末尾の改行)
- [改行コード](#改行コード)
- [ライセンス遵守](#ライセンス遵守)
- [ライセンス表記](#ライセンス表記)

## プロトコル

絶対パスでのリソース読み込みは可能な限りHTTPS（`https:`）を使用する。

```html
<script src="https://code.jquery.com/jquery-3.6.3.min.js"></script>
```

## 行末尾の空白

行末尾の空白は不要であり、差分がわかりにくくなるため削除します。（不要な空白も削除します）

## ファイル末尾の改行

差分がわかりにくくなるためファイル末尾の行では改行します。

```html
...
</html>

```

## 改行コード

エディターの改行コードが`LF`に設定されていることを確認します。

## ライセンス遵守

ライセンスが商用利用可能であることを確認します。

### 商用利用が可能なライセンス

* [MIT](https://opensource.org/licenses/MIT)
* [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0.html)
* [BSD-3-Clause](https://opensource.org/licenses/BSD-3-Clause)
* [BSD-2-Clause](https://opensource.org/licenses/BSD-2-Clause)
* [ISC](https://opensource.org/licenses/ISC)
* [W3C-20150513](https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document)

### 商用利用が不可なライセンス

* [GNU LGPL v2.1](https://www.gnu.org/licenses/lgpl-2.1.en.html)
* [GNU LGPL v3](https://www.gnu.org/licenses/lgpl-3.0.en.html)
* [GNU GPL v2](https://www.gnu.org/licenses/gpl-2.0.en.html)
* [GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html)
* [GNU AGPL v3](https://www.gnu.org/licenses/agpl-3.0.en.html)

## ライセンス表記

ライブラリやフレームワーク（CSSリセットなども含む）を利用する際、ライセンス表記のコメントは削除しない。

**コードをコンパイル/圧縮した際にライセンス表記のコメントが削除されていないか必ず確認します。**