import { HttpModule } from '@nestjs/axios'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { SentryGlobalFilter } from '@sentry/nestjs/setup'
import { RedisClientOptions } from 'redis'

import store from 'cache-manager-redis-store'

import { Controllers } from '@/app.controllers'
import { Services } from '@/app.services'

@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      store,
      isGlobal: true,
      name: 'tech-inspect-bff',
      ttl: 60, // segundos
      url: 'redis://127.0.0.1:6379'
    }),
    HttpModule
  ],
  controllers: [Controllers],
  exports: [Services],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter
    },
    Services
  ]
})
export class AppModule {}
