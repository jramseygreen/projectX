export default class Crypt {
    constructor() {
        this.crypt = new JSEncrypt({default_key_size: 1024})
        this.privateKey = this.crypt.getPrivateKey()
        this.publicKey = this.crypt.getPublicKey()
        this.foreignPublicKey = ""
    }

    decrypt(message) {
        this.crypt.setPrivateKey(this.privateKey)
        return this.crypt.decrypt(message)
    }

    encrypt(message) {
        this.crypt.setPublicKey(this.foreignPublicKey)
        return this.crypt.encrypt(message)
    }

}