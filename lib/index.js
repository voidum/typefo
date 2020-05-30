function lintDefine(define) {
  let result = define;
  if (!result) result = [];
  if (typeof result === 'string') result = [result];
  if (Array.isArray(result)) {
    result = result.map(e => Array.isArray(e) ? e : [e]);
    return result;
  }
  throw new Error('define must be string or array');
}

function TypeFo(define) {
  // arrayify methods
  const methods = lintDefine(define);
  // build symbols for private
  const symbols = {};
  methods.forEach((e) => {
    symbols[e] = Symbol(e);
  });
  const $sign = Symbol('typefo');
  return {
    [$sign]: true,
    symbols: {},
    protect: function protect(Class) {
      if (!this || this[$sign]) {
        throw new Error('your own [this] required');
      }
      if (!Class) {
        throw new Error('explicit base class required');
      }
      const baseProto = Class.prototype;
      const nextProto = Object.getPrototypeOf(this);
      methods.forEach(e => {
        const [name, frozen] = e;
        Object.defineProperty(baseProto, name, { configurable: false, writable: false });
        if (frozen && this && nextProto) {
          Object.defineProperty(
            nextProto,
            name,
            { configurable: false, writable: false, value: baseProto[name] }
          );
        }
      });
    }
  };
}

module.exports = TypeFo;
