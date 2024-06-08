import { Session } from "inspector";
import { CombankClient } from "./API";
import { ComBankSession } from "./core/session";


(async ()=>{

  const session = new ComBankSession()
  await session.initSession()
})()