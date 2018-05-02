import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import sinonStubPromise from 'sinon-stub-promise';
sinonStubPromise(sinon);
chai.use(sinonChai);

global.fetch = require('node-fetch');

import EduSigner from '../src/index';

describe('EduSigner Library', () => {
  let stubedFetch;
  let promise;

  beforeEach(()=> {
    stubedFetch = sinon.stub(global, 'fetch');
    promise = stubedFetch.returnsPromise();
  });

  afterEach(() => {
    stubedFetch.restore();
  });

  it('creates an instance of EduSigner', () => {
    let signer = new EduSigner({});
    expect(signer).to.be.an.instanceof(EduSigner);
  });

  it('receives a license key as an config', () => {
    let signer = new EduSigner({
      licenseKey: 'foo'
    });

    expect(signer.licenseKey).to.be.equal('foo');
  });

  describe('request method', () => {
    it('has an request method', () => {
      let signer = new EduSigner({});

      expect(signer.request).to.exist;
    });

    it('calls fetch when request', () => {
      let signer = new EduSigner({
        licenseKey: 'foo'
      });

      signer.request('url');
      expect(stubedFetch).to.have.been.calledOnce;
    });

    it('calls fetch with right url passed', () => {
      let signer = new EduSigner({
        licenseKey: 'foo'
      });

      signer.request('url');
      expect(stubedFetch).to.have.been.calledWith('url');
    });

    it('calls fetch with right headers passed', () => {
      let signer = new EduSigner({
        licenseKey: 'foo'
      });

      const options = {
        headers: {
          Authorization: `'Bearer foo'`,
          'Content-Type': 'application/json'
        },
      };

      signer.request('url');
      expect(stubedFetch).to.have.been.calledWith('url', options);
    });

    it('calls fetch with method: post where body passed', () => {
      let signer = new EduSigner({
        licenseKey: 'foo'
      });

      const body = { a: 1 };
      const options = {
        method: 'POST',
        body:    JSON.stringify(body),
        headers: {
          Authorization: `'Bearer foo'`,
          'Content-Type': 'application/json'
        },
      };

      signer.request('url', body);
      expect(stubedFetch).to.have.been.calledWith('url', options);
    });

  });
});
