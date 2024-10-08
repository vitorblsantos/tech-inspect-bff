import { Controller, Get, Post, UploadedFile } from '@nestjs/common'

import { IDashboard, IInspection } from '@/app.interfaces'
import { Services } from '@/app.services'

@Controller()
export class Controllers {
  constructor(private readonly service: Services) {}

  @Get('/')
  async get(): Promise<IDashboard> {
    return await this.service.get()
  }

  @Get('/inspecoes/:id')
  async list(): Promise<IInspection> {
    return await this.service.getInspection()
  }

  @Post('/inspecoes')
  post(): string {
    return this.service.post()
  }

  @Post('/detect')
  detectCrack(
    @UploadedFile()
      file: Express.Multer.File
  ): string {
    return this.service.detectCrack(file)
  }
}
