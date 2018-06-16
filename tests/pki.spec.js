import chai, { expect } from 'chai';
import { Server, WebSocket } from 'mock-socket';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import EduSigner from '../src/index';
chai.use(sinonChai);

describe('PKI', () => {
  let signer;
  let pki;
  let expected_value;
  const mockServer = new Server('ws://127.0.0.1:1235/signer?licenseKey=foo');
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    mockServer.on('connection', server => {
      mockServer.send(JSON.stringify(expected_value));
    });

    signer = new EduSigner({
      licenseKey: 'foo'
    });

    pki = signer.PKI
    sandbox.spy(WebSocket.prototype, 'send')
  });

  afterEach(() => {
    sandbox.restore();
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
  });

  describe('getVersion', () => {
    it('calls send method', async () => {
      await pki.getVersion();
      expect(WebSocket.prototype.send).to.have.been.calledOnce;
    });

    it('calls send with the correct arguments', async () => {
      await pki.getVersion();
      expect(WebSocket.prototype.send).to.have.been
        .calledWith('{"Operation":"getVersion","Parameters":[]}');
    });

    it('returns the correct data from pki.getVersion', async () => {
      expected_value = { version: '1.0.0.0' };
      const result = await pki.getVersion();
      expect(result).to.be.eql({ version: '1.0.0.0' });
    });
  });

  describe('getCertificates', () => {
    it('calls send method', async () => {
      await pki.getCertificates();
      expect(WebSocket.prototype.send).to.have.been.calledOnce;
    });

    it('calls send with the correct arguments', async () => {
      await pki.getCertificates();
      expect(WebSocket.prototype.send).to.have.been
        .calledWith('{"Operation":"getCertificates","Parameters":[]}');
    });

    it('returns the correct data from pki.getCertificates', async () => {
      expected_value = [
        { fingerprint: 'AAAAAA', subject: 'Member one', issuer: 'CertificaEdu Root CA' },
        { fingerprint: 'BBBBBB', subject: 'Member two', issuer: 'CertificaEdu Root CA' }
      ]
      const result = await pki.getCertificates();
      expect(result).to.be.eql(expected_value);
    });
  });

  describe('getCertificate', () => {
    it('calls send method', async () => {
      await pki.getCertificate();
      expect(WebSocket.prototype.send).to.have.been.calledOnce;
    });

    it('calls send with the correct arguments', async () => {
      await pki.getCertificate('AAAAAA');
      expect(WebSocket.prototype.send).to.have.been
        .calledWith('{"Operation":"getCertificate","Parameters":[{"Key":"Thumbprint","Value":"AAAAAA"}]}');
    });

    it('returns the correct data from pki.getCertificate', async () => {
      expected_value = {
        thumbprint: 'AAAAAA',
        subject: 'Member one',
        issuer: 'CertificaEdu Root CA',
        contentBase64: 'ZGpkc2ZoZGZoaW9oYUlYSFhIVkRLU0JLSkNCWEM='
      }
      const result = await pki.getCertificate("AAAAAA");
      expect(result).to.be.eql(expected_value);
    });
  });

  describe('signData', () => {
    it('calls send method', async () => {
      await pki.signData();
      expect(WebSocket.prototype.send).to.have.been.calledOnce;
    });

    it('calls send with the correct URL and parameters', async () => {
      await pki.signData('AAAAAA', 'aGVsbG8=');
      expect(WebSocket.prototype.send).to.have.been
        .calledWith('{"Operation":"signData","Parameters":[{"Key":"Thumbprint","Value":"AAAAAA"},{"Key":"Data","Value":"aGVsbG8="}]}');
    });

    it('returns the correct data from signData', async () => {
      expected_value = { signedData: 'YUdWc2JHOD0=' };
      const result = await pki.signData('AAAAAA', 'aGVsbG8=');
      expect(result).to.be.eql({ signedData: 'YUdWc2JHOD0=' });
    });
  });
});
