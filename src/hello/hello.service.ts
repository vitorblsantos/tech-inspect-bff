import { Injectable } from '@nestjs/common'

@Injectable()
export class HelloService {
  public get(): string {
    return 'Hello World!'
  }
}
