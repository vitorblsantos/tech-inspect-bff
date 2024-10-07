import { Module } from '@nestjs/common'

import { Controllers } from '@/app.controllers'
import { Services } from '@/app.services'

@Module({
  controllers: [Controllers],
  exports: [Services],
  providers: [Services]
})

export class AppModule {}
