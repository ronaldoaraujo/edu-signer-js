export default function PKI() {
  return {
    getVersion: () => this.request('getVersion'),
    getCertificates: () => this.request('getCertificates'),
    getCertificate: (thumbprint) => this.request('getCertificate', { Thumbprint: thumbprint }),
    signData: (thumbprint, data) => this.request('signData', { Thumbprint: thumbprint, Data: data })
  };
}
