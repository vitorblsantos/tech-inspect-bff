import { Controller, Get } from '@nestjs/common'

import { HelloService } from '@/hello/hello.service'

@Controller()
export class HelloController {
  constructor(private readonly service: HelloService) {}

  @Get()
  getHello(): string {
    return this.service.get()
  }
}
