import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { CombankRestUrl } from "../../config";

const buildUrl = (url: string) => new URL(url, CombankRestUrl).toString();

export class APIRequest {
  request: AxiosInstance;
  sessionId?: string;

  constructor() {
    let headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0",
      "Accept": "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.5",
      "X-Client-Version": "Web; 2.0.17.7.b20240402_120821",
      "Content-Type": "application/json;charset=utf-8",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin"
  }

    this.request = axios.create({
      withCredentials: true,
      
    });
    this.request.defaults.headers.common = headers
    this.setupInterceptors()

  }
  
  private setupInterceptors(){
    this.request.interceptors.response.use((res)=>{
      if (res.headers["x-auth-token"]){
        delete this.request.defaults.headers.common["X-Temp-Auth-Token"];
        this.sessionId = res.headers["x-auth-token"];
      } else if (res.headers["x-temp-auth-token"]){
        this.request.defaults.headers.common["X-Temp-Auth-Token"] =
          res.headers["x-temp-auth-token"];
      }
      return res;
    })
  }

  setHeaders(headers: Record<string, string>): void {
    this.request.defaults.headers.common = headers;

  }


  async get<T>(
    url: string,
    reqConfig: AxiosRequestConfig
  ): Promise<T | AxiosResponse<T>> {
    const response = await this.request.get<T>(buildUrl(url), reqConfig);
    // return reqConfig?.fullResponse ? response : response.data;
    return response;
  }

  async post<T>(
    url: string,
    data?: string | Record<string, unknown>,
    reqConfig?: AxiosRequestConfig
  ): Promise<T | AxiosResponse<T>> {
    const response = await this.request.post<T>(buildUrl(url), data, reqConfig);
    return response;
  }
}
