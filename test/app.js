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


  it('agent should cached', () => {
    app.agent.should.equal(app.agent);
  });


  it('use plugin direct', () => {
    const app3 = mm();
    const plugin = sinon.spy();
    app3.use(plugin);
    plugin.should.be.called();
  });


  it('agent with port', () => {
    const app4 = mm({ port: 6100 });
    app4.addMiddleware(function* () {
      this.body = this.host;
    });

    return app4.get('/').expect('127.0.0.1:6100');
  });
});

