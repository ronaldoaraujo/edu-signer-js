import { pkcs12, asn1, util, pki, md } from 'node-forge';

export function base64ArrayBuffer(arrayBuffer) {
  var base64    = ''
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  var bytes         = new Uint8Array(arrayBuffer)
  var byteLength    = bytes.byteLength
  var byteRemainder = byteLength % 3
  var mainLength    = byteLength - byteRemainder

  var a, b, c, d
  var chunk

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63               // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength]

    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3)   << 4 // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + '=='
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + '='
  }

  return base64
}

export default function PKI() {
  return {
    download: (url) =>
      fetch(url)
        .then(res => res.buffer)
        .then(buffer => base64ArrayBuffer(buffer)),
    decryptP12: (p12b64, login, password) => {
      let p12Der = util.decode64(p12b64);
      let p12Asn1 = asn1.fromDer(p12Der);
      let p12 = pkcs12.pkcs12FromAsn1(p12Asn1, password);

      let certBags = p12.getBags({bagType: pki.oids.certBag});
      let pkeyBags = p12.getBags({bagType: pki.oids.pkcs8ShroudedKeyBag});

      let certBag = certBags[pki.oids.certBag][0];
      let keybag = pkeyBags[pki.oids.pkcs8ShroudedKeyBag][0];

      let privateKeyPem = pki.privateKeyToPem(keybag.key);
      let certificate = pki.certificateToPem(certBag.cert);

      sessionStorage.clear();
      sessionStorage.setItem(`${login}.cer`, certificate);
      sessionStorage.setItem(`${login}.key`, privateKeyPem);
    },
    getCertificate: (login) => {
      return sessionStorage.getItem(`${login}.cer`);
    },
    signData: (login, data) => {
      let digest  = md.sha256.create();
      let dataSign = atob(data);
      let key = pki.privateKeyFromPem(sessionStorage.getItem(`${login}.key`));

      digest.update(dataSign);

      return btoa(key.sign(digest));
    }
  }
}
