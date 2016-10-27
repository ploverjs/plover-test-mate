'use strict';


const pathUtil = require('path');
const sinon = require('sinon');

const mm = require('../lib/app');


describe('app', () => {
  const app = mm({
    applicationRoot: pathUtil.join(__dirname, 'fixtures/app'),
    expectRoot: pathUtil.join(__dirname, 'fixtures/expect')
  });

  app.use('plover-arttemplate');

  app.it('/', 'index.html');


  it('app with config', () => {
    const app2 = mm({
      applicationRoot: pathUtil.join(__dirname, 'fixtures/app-with-config')
    });

    return app2.get('/hello')
      .expect('hello')
      .expect(200);
  });


  it('use plugin direct', () => {
    const app3 = mm();
    const plugin = sinon.spy();
    app3.use(plugin);
    plugin.should.be.called();
  });
});

