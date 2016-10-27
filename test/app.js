'use strict';


const pathUtil = require('path');
const sinon = require('sinon');

const plover = require('../lib/app');


describe('app', () => {
  const app = plover({
    applicationRoot: pathUtil.join(__dirname, 'fixtures/app'),
    expectRoot: pathUtil.join(__dirname, 'fixtures/expect')
  });

  app.use('plover-arttemplate');

  app.it('/', 'index.html');


  it('app with config', () => {
    const app2 = plover({
      applicationRoot: pathUtil.join(__dirname, 'fixtures/app-with-config')
    });

    return app2.get('/hello')
      .expect('hello')
      .expect(200);
  });


  it('use plugin direct', () => {
    const app3 = plover();
    const plugin = sinon.spy();
    app3.use(plugin);
    plugin.should.be.called();
  });
});

