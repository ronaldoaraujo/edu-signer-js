import chai, { expect } from 'chai';
import EduSigner from '../src/index';

describe('EduSigner Library', () => {
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

  it('has an request method', () => {
    let signer = new EduSigner({});
    expect(signer.request).to.exist;
  });
});
