# Dynasty Language ドキュメンテーション

Dynasty言語の世界へようこそ。

Dynastyは、C/C++をとって代わるものとして作られたプログラミング言語です。 
アセンブリコードに直接コンパイルしたり、C/C++で作成された共有オブジェクト(so)や動的ライブラリ、静的ライブラリを使用することができます。

## 目次
- [Dynasty Language ドキュメンテーション](#dynasty-language-documentation)
  - [目次](#table-of-contents)
  - [基本構文](#basic-grammars)
    - [変数,定数]](#variables-constants)
    - [関数, メソッド, インラインコードブロック式](#functions-methods-inline-code-block-expressions)
    - [if式](#if-expression)
    - [トップレベルステートメント](#top-level-statements)

## 基本構文

### 変数,定数

Dynastyでは、コンパイル時定数とランタイム定数に構文上の違いはありません。
コンパイラはコンパイル時に確定可能な定数をコンパイル時定数であると評価し、そうでない定数をランタイム定数と評価します。


「定数」ですから、いずれの定数も再代入はできません。 

定数は、 英単語 "invariant"を略したキーワード`inv`を用いて示すことで宣言できます。

```dn
inv foo = 7;
# 下は上と同じ意味を持ちますが、下は定数を明示的に型付けています。
# inv foo: int = 7;
```

定数には、その宣言と同時に値が代入されなければなりません。

定数に対して、変数は再代入可能であり、宣言時には英単語 "variable"を略したキーワード`var`によって示されます。
```dn
var foo = 7;
# 変数宣言も定数と同じように
# 明示的に型付けることができます。
# var foo: int = 7;
```

### 関数, メソッド, インラインコードブロック式
関数の宣言は、関数の名前,引数,(その関数が値を返す場合は)戻り値の型,そして関数本体です。
関数に対して戻り値の型が明示されていないとき、Dynastyコンパイラはその戻り値を`void`型であるとみなします。

たとえば、

```dn
fn foo() -> void {
  print("FooBar");
}
# 下は同じ意味を持ちますが、戻り値の型の記述を省略しています:
# fn foo() {
#   print("FooBar");
# }

# 以下の関数は、2つの引数を持ち、str型を返すことが明示されています。: 
fn bar(a: int, b: str) -> str {
  return str(a) + b;
}
```

なお、将来のリリースでは、 戻り値の型を省略した場合、 関数の `return` ステートメントから型推論を行うことを想定しています.

### if式
Dynastyは `if` 式をサポートしています。
以下は`if`式による条件分岐の実装の例です:

```dn
inv foo = if(bar) { 1 } else { 2 };
# または
# inv foo = if(bar) 1 else 2;
```

`if`式の値を用いないとき、 `else`句を省略することができます:

```dn
if (some_condition) {
  print("foo");
}
```

また、この`if` 式の値を用いない場合に限っては、ブロック式は式でなくあくまでステートメントの一部として扱われます。
これは、`return`ステートメントや`yield` ステートメントは`if` や `else`の直後のブロックではなくひとつ外側の(あるいは呼び出し元の)コンテクストへ値を返すということを意味します。

```dn
fn bar() {
  # doing something
  if (some_condition) {
    # 以下の`return`は if式のブロック式から脱するのではなく、
    # 関数`bar` の戻り値を返しています。
    return;
  }
}
```

### トップレベルステートメント
Dynastyは以下のようにファイルの先頭から処理を進めるトップレベルステートメントの書き方をサポートしています:

```dn
print("Hello, world!");
```

```dn
for(i in range(0, 100)) {
  print({
    if (i mod 15 == 0) {
      return "FizzBuzz";
    }
    if (i mod 3 == 0) {
      return "Fizz";
    }
    if (i mod 5 == 0) {
      return "Buzz";
    }
    return str(i);
  });
}
```
Dynastyのコードでは、Cでのmain関数やそれに類するようなものを書く必要はありません。
