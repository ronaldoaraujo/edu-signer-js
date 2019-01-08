import chai, { expect } from 'chai';
import EduSigner from '../src/index';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

global.fetch = require('node-fetch');

describe('CLOUD', () => {
  let signer;
  let cloud;
  let stubedFetch;
  let promise;

  beforeEach(() => {
    signer = new EduSigner({
      licenseKey: 'foo'
    });

    cloud = signer.CLOUD;
    stubedFetch = sinon.stub(global, 'fetch');
    promise = stubedFetch.resolves('p12b64');
  });

  afterEach(() => {
    stubedFetch.restore();
  });

  describe('smoke tests', () => {
    it('has download method', () => {
      expect(cloud.download).to.exist;
    });
    it('has decryptP12 method', () => {
      expect(cloud.decryptP12).to.exist;
    });
  });

  describe('download', () => {
    it('calls fetch function', async () => {
      await cloud.download('https://host.com/certificate.p12');

      expect(stubedFetch).to.have.been.calledOnce;
    });

    it('calls fetch function with correct url', async () => {
      await cloud.download('https://host.com/certificate.p12');

      expect(stubedFetch).to.have.been
        .calledWith('https://host.com/certificate.p12');
    });

    it('return the correct data from Promise', async () => {
      let data = await cloud.download('https://host.com/certificate.p12');

      expect(data).to.be.eql('');
    });
  });
});
