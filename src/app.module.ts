import { CacheModule } from '@nestjs/cache-manager'
import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import type { RedisClientOptions } from 'redis'

import store from 'cache-manager-redis-store'

import { Controllers } from '@/app.controllers'
import { Services } from '@/app.services'


@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      store,
      isGlobal: true,
      name: 'tech-inspect-bff',
      ttl: 43200, // 12 horas
      url: 'redis://127.0.0.1:6379'
    }),
    HttpModule
  ],
  controllers: [Controllers],
  exports: [Services],
  providers: [Services]
})
export class AppModule {}
