import 'dotenv/config'
import './app.config'

import { NestFactory } from '@nestjs/core'

import { AppModule } from '@/app.module'

const { API_PORT } = process.env

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = API_PORT || 8080

  app.enableCors()

  await app.listen(port)

  console.log(`Aplicação disponível na porta: ${port}`)
}

bootstrap()
