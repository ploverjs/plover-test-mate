'use strict';


const assert = require('assert');
const pathUtil = require('path');
const http = require('http');
const fs = require('fs');
const plover = require('plover');
const request = require('supertest');

const htmlEqual = require('./util').htmlEqual;

const AGENT = Symbol('agent');


class TestApp extends plover.Application {
  constructor(options) {
    options = options || {};
    const root = options.applicationRoot || __dirname;
    const settings = {};
    const configPath = pathUtil.join(root, 'config/app.js');
    if (fs.existsSync(configPath)) {
      Object.assign(settings, require(configPath));
    }
    Object.assign(settings, options);
    settings.applicationRoot = root;
    settings.configRoot = pathUtil.join(root, 'config');

    super(settings);

    this.expectRoot = options.expectRoot;
  }


  install(plugin) {
    if (typeof plugin === 'string') {
      const info = require(pathUtil.join(plugin, 'package.json'));
      plugin = require(pathUtil.join(plugin, info.plover.plugin));
    }
    const type = typeof plugin;
    assert(type === 'function',
        `plugin should be typeof function, but now is: ${type}`);

    plugin(this);
  }


  get agent() {
    const agent = this[AGENT];
    if (agent) {
      return agent;
    }

    const port = this.settings.port;
    if (port) {
      const server = http.createServer(this.callback());
      server.listen(port);
      this[AGENT] = request.agent(server);
    } else {
      this[AGENT] = request.agent(this.callback());
    }
    return this[AGENT];
  }


  get(url) {
    return this.agent.get(url);
  }


  fixture(name) {
    const path = pathUtil.join(this.expectRoot, name);
    return fs.readFileSync(path, 'utf-8');
  }


  test(url, fixture) {
    const html = this.fixture(fixture);
    return this.get(url)
      .expect(htmlEqual(html));
  }


  it(url, fixture) {
    it(`GET ${url} -> ${fixture}`, () => {
      return this.test(url, fixture);
    });
  }
}


module.exports = function(options) {
  return new TestApp(options);
};
