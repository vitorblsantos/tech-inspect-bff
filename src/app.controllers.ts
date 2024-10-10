import { CacheInterceptor } from '@nestjs/cache-manager'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
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

  @Get('/inspecoes/list')
  async list(): Promise<IInspection[]> {
    return await this.service.list()
  }

  @HttpCode(200)
  @UseInterceptors(CacheInterceptor)
  @Post('/inspecoes')
  post(@Body() body: { payload: IInspection }): Promise<string> {
    return this.service.post(body.payload)
  }

  @Get('/inspecoes/:id')
  async getInspection(@Param('id') id: string): Promise<IInspection> {
    return await this.service.getInspection(id)
  }

  @Post('/detect')
  @UseInterceptors(FileInterceptor('file'))
  detectCrack(
    @UploadedFile()
    file: any
  ): Promise<string> {
    return this.service.detectCrack(file)
  }
}
