import { CacheInterceptor } from '@nestjs/cache-manager'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'

import { IDashboard, IInspection } from '@/app.interfaces'
import { Services } from '@/app.services'
import { FileInterceptor } from '@nestjs/platform-express'

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

  @HttpCode(200)
  @UseInterceptors(CacheInterceptor)
  @Post('/inspecoes')
  post(@Body() payload: IInspection): Promise<string> {
    return this.service.post(payload)
  }

  @Post('/detect')
  @UseInterceptors(FileInterceptor('file'))
  detectCrack(
    @UploadedFile()
    file: Express.Multer.File
  ): Promise<string> {
    return this.service.detectCrack(file)
  }
}
