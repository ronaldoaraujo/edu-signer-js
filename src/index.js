/* global fetch */
import PKI from './pki';

export default class EduSigner {
  constructor(config) {
    this.licenseKey = config.licenseKey;
    this.PKI = PKI.bind(this)();
  }

  request(url, body) {
    const optionsGet = {
      headers: {
        Authorization: `'Bearer ${this.licenseKey}'`,
        'Content-Type': 'application/json',
      },
    };
    const optionsPost = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: optionsGet.headers,
    };
    return fetch(url, body ? optionsPost : optionsGet)
      .then(data => data.json());
  }
}
