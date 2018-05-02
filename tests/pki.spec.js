import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import sinonStubPromise from 'sinon-stub-promise';
sinonStubPromise(sinon);
chai.use(sinonChai);

global.fetch = require('node-fetch');

import EduSigner from '../src/index';

describe('PKI', () => {
  let signer;
  let pki;
  let stubedFetch;
  let promise;

  const certificate = {
    fingerprint: 'AAAAAA',
    subject: 'Member one',
    issuer: 'CertificaEdu Root CA',
    contentBase64: 'ZGpkc2ZoZGZoaW9oYUlYSFhIVkRLU0JLSkNCWEM='
  }

  beforeEach(() => {
    signer = new EduSigner({
      licenseKey: 'foo'
    });

    pki = signer.PKI
    stubedFetch = sinon.stub(global, 'fetch');
    promise = stubedFetch.returnsPromise();
  });

  afterEach(() => {
    stubedFetch.restore();
  });

  describe('smoke tests', () => {
    it('has getVersion method', () => {
      expect(pki.getVersion).to.exist;
    });

    it('has getCertificates method', () => {
      expect(pki.getCertificates).to.exist;
    });

    it('has getCertificate method', () => {
      expect(pki.getCertificate).to.exist;
    });

    it('has signData method', () => {
      expect(pki.signData).to.exist;
    });

    it('has signHash method', () => {
      expect(pki.signHash).to.exist;
    });
  });

  describe('getVersion', () => {
    it('calls fetch method', () => {
      pki.getVersion();

      expect(stubedFetch).to.have.been.calledOnce;
    });

    it('calls fetch with the correct URL', () => {
      pki.getVersion();

      expect(stubedFetch).to.have.been
        .calledWith('http://127.0.0.1:1235/pki/version');
    });

    it('returns the correct data from Promise', () => {
      promise.resolves({ version: '1.0.0' });
      const result = pki.getVersion();
      expect(result.resolveValue).to.be.eql({ version: '1.0.0' });
    });
  });

  describe('getCertificates', () => {
    it('calls fetch method', () => {
      pki.getCertificates();
      expect(stubedFetch).to.have.been.calledOnce;
    });

    it('calls fetch with the correct URL', () => {
      pki.getCertificates();
      expect(stubedFetch).to.have.been
        .calledWith('http://127.0.0.1:1235/pki/certificates');
    });

    it('returns the correct data from Promise', () => {
      const certificates = [
        { fingerprint: 'AAAAAA', subject: 'Member one', issuer: 'CertificaEdu Root CA' },
        { fingerprint: 'BBBBBB', subject: 'Member two', issuer: 'CertificaEdu Root CA' }
      ]
      promise.resolves(certificates);

      const result = pki.getCertificates();
      expect(result.resolveValue).to.be.eql(certificates);
    });
  });

  describe('getCertificate', () => {
    it('calls fetch method', () => {
      pki.getCertificate();

      expect(stubedFetch).to.have.been.calledOnce;
    });

    it('calls fetch with the correct URL', () => {
      pki.getCertificate('AAAAAA');
      expect(stubedFetch).to.have.been
        .calledWith('http://127.0.0.1:1235/pki/certificate/AAAAAA');

      pki.getCertificate('BBBBBB');
      expect(stubedFetch).to.have.been
        .calledWith('http://127.0.0.1:1235/pki/certificate/BBBBBB');
    });

    it('returns the correct data from Promise', () => {
      promise.resolves(certificate);

      const result = pki.getCertificates();
      expect(result.resolveValue).to.be.eql(certificate);
    });
  });

  describe('signData', () => {
    const data = {
      data: 'aGVsbG8='
    }

    const options = {
      method: 'POST',
      body:    JSON.stringify({certificate, data}),
      headers: {
        Authorization: `'Bearer foo'`,
        'Content-Type': 'application/json'
      },
    };

    it('calls fetch method', () => {
      pki.signData();

      expect(stubedFetch).to.have.been.calledOnce;
    });

    it('calls fetch with the correct URL and parameters', () => {
      pki.signData(certificate, data);
      expect(stubedFetch).to.have.been
        .calledWith('http://127.0.0.1:1235/pki/signData', options);
    });

    it('returns the correct data from Promise', () => {
      promise.resolves({signedData: 'YUdWc2JHOD0='});

      const result = pki.signData(certificate, data);
      expect(result.resolveValue).to.be.eql({signedData: 'YUdWc2JHOD0='});
    });
  });

  describe('signHash', () => {
    const hash = {
      data: 'aGVsbG8='
    }

    const options = {
      method: 'POST',
      body:    JSON.stringify({certificate, hash}),
      headers: {
        Authorization: `'Bearer foo'`,
        'Content-Type': 'application/json'
      },
    };

    it('calls fetch method', () => {
      pki.signHash();

      expect(stubedFetch).to.have.been.calledOnce;
    });

    it('calls fetch with the correct URL and parameters', () => {
      pki.signHash(certificate, hash);
      expect(stubedFetch).to.have.been
        .calledWith('http://127.0.0.1:1235/pki/signHash', options);
    });

    it('returns the correct data from Promise', () => {
      promise.resolves({signedData: 'YUdWc2JHOD0='});

      const result = pki.signHash(certificate, hash);
      expect(result.resolveValue).to.be.eql({signedData: 'YUdWc2JHOD0='});
    });
  });
});
