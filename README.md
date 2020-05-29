# TypeFo

[![Build Status](https://travis-ci.org/sartrey/typefo.svg?branch=master)](https://travis-ci.org/sartrey/typefo)
[![Coverage Status](https://coveralls.io/repos/github/sartrey/typefo/badge.svg?branch=master)](https://coveralls.io/github/sartrey/typefo?branch=master)

A JavaScript class enhancement tool.

JavaScript is a prototype-based object-oriented language which has a very stupid weak class members protection.
All class methods are allowed to be overrided by default and can be rewrited in runtime by prototype manipulation.

`TypeFo` is a tool to enhance JS class, it can produce `Symbol` for protected methods and protect class prototype by a small function.

## Usage

```sh
npm install --save typefo
```

```javascript
const TypeFo = require('typefo');

const typefo = new TypeFo(['fn1', 'fn2', ['fn3', true]]);

// every method will lead to a Symbol
// just keep typefo instance in a local lexical scope
// then use symbols to declare functions
const PROTECTED = typefo.symbols;

class BaseClass {
  constructor() {
    // provide instance and class
    typefo.protect.call(this, BaseClass);
  }

  [PROTECTED.fn1]() {
    // nobody can access fn1 except this module
  }

  fn2() {
    console.log('fn2');
  }

  fn3() {
    console.log('fn3');
  }
}
// module.exports = BaseClass;

class NextClass extends BaseClass {
  fn2() {
    console.log('fn2, next');
  }

  fn3() {
    console.log('fn3, next');
  }
}

const next = new NextClass();

// virtual methods
next.fn2(); // => fn2, next

// immutable public methods
next.fn3(); // => fn3

```