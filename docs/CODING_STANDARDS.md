# コーディング規約

## 概要

このドキュメントでは、next-app プロジェクトにおけるコーディング規約を定義します。一貫性のあるコードベースを維持するために、すべての開発者はこの規約に従ってください。

## 目次

1. [TypeScript](#typescript)
2. [React](#react)
3. [Next.js](#nextjs)
4. [命名規則](#命名規則)
5. [ファイル構造](#ファイル構造)
6. [インポート順序](#インポート順序)
7. [コメントとドキュメンテーション](#コメントとドキュメンテーション)
8. [エラーハンドリング](#エラーハンドリング)
9. [非同期処理](#非同期処理)
10. [スタイリング](#スタイリング)
11. [アクセシビリティ](#アクセシビリティ)
12. [パフォーマンス](#パフォーマンス)
13. [セキュリティ](#セキュリティ)

---

## TypeScript

### 基本設定

- **strict mode** を有効化
- `any` 型の使用を避ける
- 型推論を活用し、不要な型注釈は省略

```typescript
// ❌ 悪い例
const name: string = 'John'; // 型推論で十分

// ✅ 良い例
const name = 'John';
```

### 型定義

#### Interface vs Type

- **Props や State**: `interface` を使用
- **Union 型や複雑な型**: `type` を使用

```typescript
// ✅ 良い例: Props は interface
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

// ✅ 良い例: Union 型は type
type ButtonVariant = 'primary' | 'secondary' | 'danger';

type ApiResponse<T> = { data: T; error: null } | { data: null; error: string };
```

#### オプショナルプロパティ

```typescript
// ✅ 良い例
interface UserProfile {
  id: string;
  username: string;
  email?: string; // オプショナル
  age?: number; // オプショナル
}
```

#### 関数の型定義

```typescript
// ✅ 良い例: 引数と戻り値の型を明示
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ 良い例: アロー関数
const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
  console.log(event.currentTarget);
};
```

### ジェネリクス

```typescript
// ✅ 良い例: 再利用可能な型
interface ApiResponse<T> {
  data: T;
  status: number;
}

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  const data = await response.json();
  return { data, status: response.status };
}
```

### Utility Types

TypeScript の組み込みユーティリティ型を活用:

```typescript
// Partial: すべてのプロパティをオプショナルに
type PartialUser = Partial<User>;

// Pick: 特定のプロパティのみ抽出
type UserCredentials = Pick<User, 'username' | 'password'>;

// Omit: 特定のプロパティを除外
type UserWithoutPassword = Omit<User, 'password'>;

// Record: キーと値の型を定義
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;
```

### Type Guards

```typescript
// ✅ 良い例: 型ガード関数
function isError(
  response: ApiResponse<unknown>,
): response is { error: string } {
  return response.error !== null;
}

// 使用例
const response = await fetchData('/api/users');
if (isError(response)) {
  console.error(response.error);
} else {
  console.log(response.data);
}
```

---

## React

### コンポーネント定義

#### 関数コンポーネント

```typescript
// ✅ 良い例: 関数宣言
function Button({ children, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}

// ✅ 良い例: アロー関数 (エクスポート時)
export const Button = ({ children, onClick }: ButtonProps) => {
  return <button onClick={onClick}>{children}</button>;
};
```

#### Props の分割代入

```typescript
// ✅ 良い例: Props を分割代入
function UserCard({ name, email, avatar }: UserCardProps) {
  return (
    <div>
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
}

// ❌ 悪い例
function UserCard(props: UserCardProps) {
  return (
    <div>
      <h3>{props.name}</h3>
      <p>{props.email}</p>
    </div>
  );
}
```

### Hooks の使用

#### useState

```typescript
// ✅ 良い例: 初期値の型推論
const [count, setCount] = useState(0);
const [user, setUser] = useState<User | null>(null);

// ✅ 良い例: 関数型アップデート
setCount((prev) => prev + 1);
```

#### useEffect

```typescript
// ✅ 良い例: 依存配列を正しく指定
useEffect(() => {
  const fetchUser = async () => {
    const data = await apiGet<User>(`/api/users/${userId}`);
    setUser(data);
  };

  fetchUser();
}, [userId]); // userId が変わったら再実行

// ✅ 良い例: クリーンアップ関数
useEffect(() => {
  const subscription = subscribeToUpdates();

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

#### カスタムフック

```typescript
// ✅ 良い例: use プレフィックス
function useAuth() {
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  return { user, login, logout, isAuthenticated: !!user };
}
```

### 条件付きレンダリング

```typescript
// ✅ 良い例: 早期リターン
function UserProfile({ userId }: UserProfileProps) {
  const { user, isLoading } = useUser(userId);

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return <ErrorMessage message="ユーザーが見つかりません" />;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      {/* ... */}
    </div>
  );
}

// ✅ 良い例: 論理演算子
{isAuthenticated && <UserMenu />}

// ✅ 良い例: 三項演算子
{isLoading ? <Spinner /> : <Content />}
```

### リスト表示

```typescript
// ✅ 良い例: key 属性を必ず指定
{users.map((user) => (
  <UserCard key={user.id} user={user} />
))}

// ❌ 悪い例: index を key に使用 (並び順が変わる場合)
{users.map((user, index) => (
  <UserCard key={index} user={user} />
))}
```

### イベントハンドラ

```typescript
// ✅ 良い例: 命名は handle プレフィックス
const handleClick = () => {
  console.log('clicked');
};

const handleSubmit = (event: React.FormEvent) => {
  event.preventDefault();
  // ...
};

// ✅ 良い例: インライン関数は避ける (パフォーマンス)
// ❌ 悪い例
<Button onClick={() => handleDelete(user.id)} />

// ✅ 良い例
const handleDelete = useCallback(() => {
  deleteUser(user.id);
}, [user.id]);

<Button onClick={handleDelete} />
```

---

## Next.js

### App Router とコンポーネント設計

#### Server Components (デフォルト)

`app` ディレクトリ内のコンポーネントはデフォルトで Server Components です。
データ取得やバックエンドリソースへのアクセスは可能な限り Server Component で行います。

```typescript
// ✅ 良い例: 非同期 Server Component
import { db } from '@/lib/db';

export default async function UserPage({ params }: { params: { id: string } }) {
  // Server Component 内で直接データ取得
  const user = await db.user.findUnique({ where: { id: params.id } });

  if (!user) return <div>User not found</div>;

  return <div>{user.name}</div>;
}
```

### ルーティング

```typescript
// ✅ 良い例: useRouter
import { useRouter } from 'next/router';

function Navigation() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push('/dashboard');
  };

  return <Button onClick={handleNavigate}>ダッシュボード</Button>;
}
```

### 動的インポート

```typescript
// ✅ 良い例: 重いコンポーネントは動的インポート
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <Loading />,
  ssr: false, // クライアントサイドのみ
});
```

### 環境変数

```typescript
// ✅ 良い例: 環境変数ヘルパーを使用
import { getEnv } from '@/lib/env';

const apiUrl = getEnv('NEXT_PUBLIC_API_URL');

// ❌ 悪い例: 直接アクセス
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

---

## 命名規則

### ファイル名

- **コンポーネント**: PascalCase (`Button.tsx`, `UserList.tsx`)
- **ユーティリティ**: camelCase (`apiClient.ts`, `validation.ts`)
- **テスト**: コンポーネント名 + `.test.tsx` (`Button.test.tsx`)
- **ストーリー**: コンポーネント名 + `.stories.tsx` (`Button.stories.tsx`)

### 変数名

- **定数**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **通常の変数**: camelCase (`userName`, `isLoading`)
- **Boolean**: `is`, `has`, `should` プレフィックス (`isActive`, `hasError`, `shouldRender`)

```typescript
// ✅ 良い例
const MAX_RETRY_COUNT = 3;
const userName = 'John';
const isLoading = false;
const hasError = true;
```

### 関数名

- **通常の関数**: camelCase (`calculateTotal`, `fetchUser`)
- **イベントハンドラ**: `handle` プレフィックス (`handleClick`, `handleSubmit`)
- **コールバック**: `on` プレフィックス (Props) (`onClick`, `onSubmit`)

```typescript
// ✅ 良い例
function calculateTotal(items: Item[]): number {
  /* ... */
}

const handleClick = () => {
  /* ... */
};

interface ButtonProps {
  onClick?: () => void;
  onSubmit?: (data: FormData) => void;
}
```

### コンポーネント名

- **PascalCase**: `Button`, `UserList`, `CommonLayout`
- **意味のある名前**: 目的が明確に分かる名前

```typescript
// ✅ 良い例
function UserProfileCard() {
  /* ... */
}

// ❌ 悪い例
function UPC() {
  /* ... */
}
function Component1() {
  /* ... */
}
```

---

## ファイル構造

### 1ファイル1コンポーネント

```typescript
// ✅ 良い例: Button.tsx
export function Button(props: ButtonProps) {
  return <button {...props} />;
}

// ❌ 悪い例: 複数のコンポーネントを1ファイルに
export function Button() { /* ... */ }
export function Input() { /* ... */ }
export function Select() { /* ... */ }
```

### インデックスファイル

```typescript
// src/components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Select } from './Select';
```

---

## インポート順序

```typescript
// 1. React および Next.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { GetServerSideProps } from 'next';

// 2. サードパーティライブラリ
import { useTranslation } from 'next-i18next';
import { z } from 'zod';

// 3. エイリアスインポート (@/...)
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { apiGet } from '@/lib/apiClient';

// 4. 相対インポート
import { UserCard } from './UserCard';
import styles from './styles.module.css';

// 5. 型インポート (type-only imports)
import type { User } from '@/types/user';
```

---

## コメントとドキュメンテーション

### JSDoc コメント

````typescript
/**
 * ユーザー情報を取得する
 *
 * @param userId - ユーザーID
 * @returns ユーザー情報
 * @throws {Error} ユーザーが見つからない場合
 *
 * @example
 * ```typescript
 * const user = await fetchUser('user-123');
 * console.log(user.name);
 * ```
 */
async function fetchUser(userId: string): Promise<User> {
  // ...
}
````

### コンポーネントのドキュメント

````typescript
/**
 * プライマリボタンコンポーネント
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   クリック
 * </Button>
 * ```
 */
export function Button({
  children,
  variant = 'primary',
  onClick,
}: ButtonProps) {
  // ...
}
````

### インラインコメント

```typescript
// ✅ 良い例: なぜこのコードが必要かを説明
// ログイン後、トークンが有効になるまで100ms待つ
await new Promise((resolve) => setTimeout(resolve, 100));

// ❌ 悪い例: コードそのものを説明 (不要)
// count を 1 増やす
setCount(count + 1);
```

### TODO コメント

```typescript
// TODO: エラーハンドリングを改善
// FIXME: パフォーマンス問題を修正
// NOTE: この実装は将来変更される可能性がある
```

---

## エラーハンドリング

### Try-Catch

```typescript
// ✅ 良い例
async function fetchUser(userId: string): Promise<User | null> {
  try {
    const response = await apiGet<User>(`/api/users/${userId}`);
    if (response.error) {
      console.error('ユーザー取得エラー:', response.error);
      return null;
    }
    return response.data;
  } catch (error) {
    console.error('予期しないエラー:', error);
    return null;
  }
}
```

### エラーメッセージ

```typescript
// ✅ 良い例: 明確なエラーメッセージ
throw new Error(`ユーザーID ${userId} が見つかりません`);

// ❌ 悪い例: 曖昧なエラーメッセージ
throw new Error('エラー');
```

### API エラーハンドリング

```typescript
// ✅ 良い例: 統一されたエラーハンドリング
const response = await apiPost<User>('/api/users', userData);

if (response.error) {
  // エラー表示
  showToast(response.error, 'error');
  return;
}

// 成功処理
showToast('ユーザーを作成しました', 'success');
```

---

## 非同期処理

### async/await

```typescript
// ✅ 良い例: async/await
async function loadUserData() {
  const user = await fetchUser(userId);
  const posts = await fetchUserPosts(userId);
  return { user, posts };
}

// ❌ 悪い例: Promise チェーン
function loadUserData() {
  return fetchUser(userId).then((user) => {
    return fetchUserPosts(userId).then((posts) => {
      return { user, posts };
    });
  });
}
```

### 並列実行

```typescript
// ✅ 良い例: 並列実行
const [user, posts, comments] = await Promise.all([
  fetchUser(userId),
  fetchUserPosts(userId),
  fetchUserComments(userId),
]);
```

### useEffect での非同期処理

```typescript
// ✅ 良い例
useEffect(() => {
  let isCancelled = false;

  async function fetchData() {
    const data = await apiGet('/api/data');
    if (!isCancelled) {
      setData(data);
    }
  }

  fetchData();

  return () => {
    isCancelled = true;
  };
}, []);
```

---

## スタイリング

### Tailwind CSS

```typescript
// ✅ 良い例: Tailwind ユーティリティクラス
<div className="flex items-center justify-between p-4 bg-white rounded shadow">
  <h2 className="text-lg font-semibold">タイトル</h2>
  <Button>アクション</Button>
</div>

// ❌ 悪い例: インラインスタイル
<div style={{ display: 'flex', padding: '16px' }}>
  <h2 style={{ fontSize: '18px' }}>タイトル</h2>
</div>
```

### tailwind-variants

```typescript
// ✅ 良い例: バリアント管理
import { tv } from 'tailwind-variants';

const buttonVariants = tv({
  base: 'px-4 py-2 rounded font-medium',
  variants: {
    variant: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-gray-200 text-gray-800',
    },
  },
});
```

### クラス名の条件付き適用

```typescript
// ✅ 良い例: clsx または cn ユーティリティ
import { cn } from '@/lib/utils';

<button className={cn(
  'base-classes',
  isActive && 'active-classes',
  isDisabled && 'disabled-classes'
)}>
```

---

## アクセシビリティ

### セマンティックHTML

```typescript
// ✅ 良い例
<nav>
  <ul>
    <li><a href="/home">ホーム</a></li>
    <li><a href="/about">概要</a></li>
  </ul>
</nav>

// ❌ 悪い例
<div>
  <div onClick={goToHome}>ホーム</div>
  <div onClick={goToAbout}>概要</div>
</div>
```

### ARIA 属性

```typescript
// ✅ 良い例
<button
  aria-label="メニューを開く"
  aria-expanded={isOpen}
  aria-controls="main-menu"
>
  <MenuIcon />
</button>
```

### キーボードナビゲーション

```typescript
// ✅ 良い例
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  クリック可能な要素
</div>
```

---

## パフォーマンス

### メモ化

```typescript
// ✅ 良い例: useMemo
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// ✅ 良い例: useCallback
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// ✅ 良い例: React.memo
export const ExpensiveComponent = React.memo(function ExpensiveComponent({
  data,
}: Props) {
  // ...
});
```

### 動的インポート

```typescript
// ✅ 良い例
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Loading />,
});
```

---

## セキュリティ

### XSS 対策

```typescript
// ✅ 良い例: React の自動エスケープ
<div>{userInput}</div>

// ❌ 悪い例: dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### 環境変数

```typescript
// ✅ 良い例: 公開変数のみ NEXT_PUBLIC_ プレフィックス
NEXT_PUBLIC_API_URL=https://api.example.com

// ✅ 良い例: シークレットは .env.local
DATABASE_URL=secret_url
```
