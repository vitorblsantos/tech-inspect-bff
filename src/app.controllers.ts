import { CacheInterceptor } from '@nestjs/cache-manager'
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors
} from '@nestjs/common'

import { IDashboard, IInspection } from '@/app.interfaces'
import { Services } from '@/app.services'

@Controller()
export class Controllers {
  constructor(private readonly service: Services) {}
  @Get('/dashboard')
  async get(): Promise<IDashboard> {
    return await this.service.get()
  }

  @Get('/inspecoes')
  async list(): Promise<IInspection[]> {
    return await this.service.list()
  }

  @Post('/inspecoes')
  post(
    @Body() body: { payload: IInspection & { images: string[] } }
  ): Promise<string> {
    return this.service.post(body.payload)
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/inspecoes/:id')
  async getInspection(@Param('id') id: string): Promise<IInspection> {
    return await this.service.getInspection(id)
  }
}
