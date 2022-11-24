import * as crypto from 'crypto';
import * as fs from 'fs';

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

    // eslint-disable-next-line no-undef
    fs.writeFileSync(__dirname + '/public.pem', publicKey);
    // eslint-disable-next-line no-undef
    fs.writeFileSync(__dirname + '/private.pem', privateKey);
  }
}

KeysService.createKeyPair();
