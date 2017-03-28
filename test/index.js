'use strict';


const mm = require('../');


describe('index', () => {
  it('used as plover', () => {
    const app = mm();
    app.use(ctx => {
      ctx.body = 'hello';
    });
    return app.get('/').expect('hello');
  });


  it('export util', () => {
    ['htmlEqual', 'htmlTrim'].forEach(name => {
      mm[name].should.be.type('function');
    });
  });
});
