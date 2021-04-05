# dynasty

## この文書についての注意事項
これは、プログラミング言語 dynastyの構文について記述した文書です。
開発のための認識の共有および仕様の明確化を目的としており、ここに記載されていることは現在の実装によりコンパイル可能であることを意味しません。
同様に、現行の実装との整合性は保証されません。

## コメント
dynastyには以下の2種類のコメントが実装されています。

```dynasty

# このような単行(line)コメントと

#-
 このように表現する
 複行(block)コメントです。
-#

```

## 処理の記述
dynastyではPythonやJavaScriptがそうしているように、メインモジュールのトップレベルステートメントをエントリポイントとして実行します。


## 変数の取り扱
[Sample Code `variables.dn`](../examples/variables.dn)

### 定義 
dynastyでは、 以下のように変数を定義します。 

```dynasty
inv a: SomeType = hogehoge; # immutable (invariant)
var b: SomeType = hogehoge; # mutable (variant)
```


## 代入
`var` を使って定義されたミュータブルな変数には、 他の一般的なプログラミング言語と同様に `=`演算子を使って再代入できます。

```dynasty
var c: int = 0;
c=10
```

## リテラルの表現

## `if`


一般的な [if条件分岐](https://ja.wikipedia.org/wiki/If%E6%96%87) が行えます。 

**if式** を以下の形式で表します。

[Sample Code `if_expr.dn`](../examples/if_expr.dn)

```dynasty
var cond:int=1;
var i:int=if (cond>0) 1 else 0;
```

Cなどでif文として実装される処理も、このif式にブロックを与えることで同様に記述します。 

[Sample Code `if_stmt.dn`](../examples/if_stmt.dn)
```dynasty
if (condition){
 # conditionが真の時の処理
}else{
 # conditionが偽の時の処理
}
```

## `while`

[Sample Code `while.dn`](../examples/while.dn)

while文はconditionが真の間ブロック内の処理を反復して実行します。

```dynasty
while(condition){
 # condition==trueの間に実行される処理
}
```

## `for`
[Sample Code `for.dn`](../examples/for.dn)

dynastyのfor文は、Pythonのfor文と同様に使用します。
iterableなオブジェクトから順に要素を取り出して実行します。
<!--TODO: 配列のリテラルが記述できるようになってから追記する-->
```dynasty
for(e in arr){
 # arrの要素が順にeに代入されて反復
}
```

## 演算子
以下の算術、論理演算子が利用できます。
優先順位は左にある演算子ほど、また`priority`の値の小さい演算子ほど高くなります。

 


## クラスの定義
dynastyは、オブジェクト指向言語です。
以下のようにクラス(あるいは型として使用します)を定義します。

```dynasty

```

## メソッドの定義

dynastyにおけるメソッドの定義は、以下のように行います。

以下は、ゼロを返すだけの関数です。

```dynasty
fn MyClass.myMethod() -> void {
  return 0;
}
```
