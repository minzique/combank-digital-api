import { AxiosInstance } from "axios";
import { APIRequest } from "./request";
import { CombankRestUrl } from "../../config";
import { ComBankCypto } from "./crypto";

export class ComBankSession {
    request: APIRequest;
    sessionId?: string;
    publicKey?: string;
    cryptoManager?: ComBankCypto
    
    constructor() {
      this.request = new APIRequest();
    }

    async initSession() {
      [this.publicKey, this.sessionId] = await this.request
        .post(CombankRestUrl + "/api/v1/crresource/pk")
        .then((data: any) => {
          return [data.data.publicKey, data.data.sessionId];
        });

      if (!this.publicKey || !this.sessionId){
        throw Error("couldn't fetch public key")
      }
   
      let headers = {
          'x-temp-auth-token': this.sessionId,
        };
    
      let randomChallenge = await this.request
        .post(CombankRestUrl + "/api/v1/crresource/iKE",{headers})
        .then((data: any)=> {
          return data.data
        }).catch(e=>{
          throw Error("couldn't fetch challenge /iKE");
        });
        
        this.cryptoManager = new ComBankCypto(randomChallenge, this.publicKey);
     
      let encryptedRSS = this.cryptoManager.encryptedRSS();
      if (!encryptedRSS){
        throw Error("couldn't encrypt RSS");
      }
    
      let ke = await this.request
        .post(CombankRestUrl + "/api/v1/crresource/ke", encryptedRSS, {headers})
        .then((data: any)=>{
          return data.data

        })
        .catch(e=>{
          console.log( Error(e.response.data.errros[0]))
        
        })

        console.log(this.cryptoManager.encryptPayload({"Helloo": "TEST"}))

    }


  }
