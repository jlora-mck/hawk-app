import { ApiResponse } from "apisauce";

export class loginService{
   
    async login(code: string, username: string, password: string): Promise<any> {
        const response: ApiResponse<string> = await this.apisauce.post(`login`, {
          BICode: code,
          BIUser: username,
          BIPassword: password,
        })
      }
}