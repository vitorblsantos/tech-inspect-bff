import { Module } from '@nestjs/common'

import { HelloController } from '@/hello/hello.controller'
import { HelloService } from '@/hello/hello.service'

@Module({
  controllers: [HelloController],
  exports: [HelloService],
  providers: [HelloService]
})
export class ModuleHello {}
