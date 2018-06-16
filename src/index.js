import { WebSocket } from 'mock-socket';
import PKI from './pki';

export default class EduSigner {
  constructor(config) {
    this.licenseKey = config.licenseKey;
    this.PKI = PKI.bind(this)();
  }

  request(operation, params={}) {
    let licenseKey = this.licenseKey;
    return new Promise(function(resolve, reject){
      const ws = new WebSocket(`ws://127.0.0.1:1235/signer?licenseKey=${licenseKey}`);
      ws.onmessage = (event) => {
        resolve(JSON.parse(event.data))
        ws.close();
      };
      ws.onopen = function(){
        let par = [];
        for(var key in params){
          par.push({ Key: key, Value: params[key] });
        }
        let data = Object.assign({}, { Operation: operation }, { Parameters: par });
        ws.send(JSON.stringify(data));
      }
      ws.onerror = function(error) {
        reject(error);
      }
    });
  }
}
