'use strict';


const mm = require('../');


describe('index', () => {
  it('used as plover', () => {
    const app = mm();
    app.addMiddleware(function* () {
      this.body = 'hello';
    });
    return app.get('/').expect('hello');
  });


  it('export util', () => {
    ['htmlEqual', 'htmlTrim'].map(name => {
      mm[name].should.be.type('function');
    });
  });
});
