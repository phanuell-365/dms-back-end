import * as crypto from 'crypto';

// import * as fs from 'fs';

class KeysService {
  static createKeyPair() {
    const key = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    const publicKey = key.publicKey;
    const privateKey = key.privateKey;

    const publicKeyBase64 = Buffer.from(publicKey).toString('base64');
    const privateKeyBase64 = Buffer.from(privateKey).toString('base64');

    console.log('publicKeyBase64', publicKeyBase64);
    console.log('privateKeyBase64', privateKeyBase64);
    // eslint-disable-next-line no-undef
    // fs.writeFileSync(__dirname + '/public.pem', publicKey);
    // eslint-disable-next-line no-undef
    // fs.writeFileSync(__dirname + '/private.pem', privateKey);
  }
}

KeysService.createKeyPair();
