const assert = require('assert');
const TypeFo = require('../lib');

describe('typefo', () => {
  it('new TypeFo and set protected method', () => {
    const typefo = new TypeFo('fn1');
    class Test {
      [typefo.symbols.fn1]() {}
    }
    const test = new Test();
    assert.notEqual(typefo.symbols.fn1, undefined);
    assert.equal(Object.keys(test).toString(), '');
    // do NOT leak your typefo instance outside
    // lexical scope will protect private symbols
  });

  it('TypeFo.protect must be invoked with user this', () => {
    const typefo = new TypeFo();
    class Test {
      constructor() {
        typefo.protect();
      }
    }
    assert.throws(() => new Test());
  });

  it('TypeFo.protect must be invoked with user class', () => {
    const typefo = new TypeFo();
    class Test {
      constructor() {
        typefo.protect.call(this);
      }
    }
    assert.throws(() => new Test());
  });

  it('protect immutable prototype method', () => {
    const typefo = new TypeFo('fn1');
    class Test1 {
      constructor() {
        typefo.protect.call(this, Test1);
      }

      fn1() {
        return 'fn1';
      }
    }
    class Test2 {
      fn1() {
        return 'fn1';
      }
    }
    const test1 = new Test1();
    const test2 = new Test2();
    Test1.prototype.fn1 = () => 'fn-error';
    Test2.prototype.fn1 = () => 'fn-error';
    assert.equal(test1.fn1(), 'fn1');
    assert.equal(test2.fn1(), 'fn-error');
  });

  it('protect pass override / virtual method', () => {
    const typefo = new TypeFo('fn1');
    class Test1 {
      constructor() {
        typefo.protect.call(this, Test1);
      }

      fn1() {
        return 'fn1';
      }
    }
    class Test1x extends Test1 {
      fn1() {
        return 'fn1x';
      }
    }
    const test1x = new Test1x();
    assert.equal(test1x.fn1(), 'fn1x');
  });

  it('protect deny override / typical public method', () => {
    const typefo = new TypeFo([['fn1', true]]);
    class Test1 {
      constructor() {
        typefo.protect.call(this, Test1);
      }

      fn1() {
        return 'fn1';
      }
    }
    class Test1x extends Test1 {
      fn1() {
        return 'fn1x';
      }
    }
    const test1x = new Test1x();
    assert.equal(test1x.fn1(), 'fn1');
  });
});
