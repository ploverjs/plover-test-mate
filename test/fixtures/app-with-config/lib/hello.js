'use strict';


module.exports = function* (next) {
  if (this.path === '/hello') {
    this.body = 'hello';
  } else {
    yield next;
  }
};
