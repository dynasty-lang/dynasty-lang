# Dynasty Language Documentation

Welcome to Dynasty Language Documentation!

Dynasty is a programming language to alternate C/C++.
This can be directly compiled into assembly codes and also can use C/C++ assets like shared objects, dynamic libraries or static libraries. 

## Table of Contents
- [Dynasty Language Documentation](#dynasty-language-documentation)
  - [Table of Contents](#table-of-contents)
  - [Basic Grammars](#basic-grammars)
    - [Variables, Constants](#variables-constants)
    - [Top-level Statements](#top-level-statements)
    - [if expression](#if-expression)

## Basic Grammars

### Variables, Constants
Grammatically, there are no differences between compile-time constants and runtime constants.
The compiler decides a constant as a compile-time constant when its value can be determined at compile-time.
Otherwise, it is a runtime constant.

Needless to say, both types of constants are not reassignable as they are "constant."

Constants are marked with the `inv` keyword, from the English word "invariable," when they are declared.

```dn
inv foo = 7;
# this statement has the same meaning but explicitly typed.
# inv foo: int = 7;
```

A constant needs to assign a value at the same time as it declared.

In contrast to constants, variables are reassignable and need to mark with the `var` keyword from the English word "variable."

```dn
var foo = 7;
# variable declarations can be explicitly typed
# with the same style as constants.
# var foo: int = 7;
```

### Top-level Statements
Dynasty supports top-level statements like this:

```dn
print("Hello, world!")
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

Coding with Dynasty, you no longer need to write the main function or something like it.

### if expression
Dynasty supports `if` expression:

```dn
inv foo = if(bar) { 1 } else { 2 };
# or
# inv foo = if(bar) 1 else 2;
```
