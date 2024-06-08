import axios from "axios";

const REST_BASE_URL = "https://www.combankdigital.com/eBankingRest";

const axious = axios.create();

export class CombankClient {
  BASE_URL = REST_BASE_URL;

  // Get public key

  async init() {
    await this.getPublicKey()
  }

  async getPublicKey() {
    let [pk, sessionId] = await axious.post(REST_BASE_URL + "/api/v1/crresource/pk").then((data: any)=>{
      return [data.data.publicKey, data.data.sessionId]
    });

    console.log(pk)
    console.log(sessionId)
    
  }
}


