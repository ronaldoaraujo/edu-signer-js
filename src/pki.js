export default function PKI() {
  return {
    getVersion: () => this.request('http://127.0.0.1:1235/pki/version'),
    getCertificates: () => this.request('http://127.0.0.1:1235/pki/certificates'),
    getCertificate: fingerprint => this.request(`http://127.0.0.1:1235/pki/certificate/${fingerprint}`),
    signData: (certificate, data) => this.request('http://127.0.0.1:1235/pki/signData', { certificate, data }),
    signHash: (certificate, hash) => this.request('http://127.0.0.1:1235/pki/signHash', { certificate, hash }),
  };
}
