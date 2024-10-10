import { v4 as uuidv4 } from 'uuid'
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'

import { EInspectionStatus, IDashboard, IInspection } from '@/app.interfaces'
import { firstValueFrom } from 'rxjs'
import { HttpService } from '@nestjs/axios'
import * as FormData from 'form-data'
import {Firebase} from './app.config'

@Injectable()
export class Services {
  constructor(private readonly httpService: HttpService) {}

  public get(): Promise<IDashboard> {
    return Promise.resolve({
      total: 10,
      pendencias: 0,
      ultimaInspecao: new Date().toLocaleDateString(),
      inspecoes: {
        jan: 10,
        fev: 0,
        mar: 0,
        abr: 0,
        mai: 0,
        jun: 0,
        jul: 0,
        ago: 0,
        set: 0,
        out: 0,
        nov: 0,
        dez: 0
      }
    })
  }

  public getInspection(id: string): Promise<IInspection> {
    return Promise.resolve({
      id,
      created_at: new Date(),
      description: 'Lorem ipsum dolor sit amet',
      edificio: 'Kevin Mah Mahr',
      inspetor: 'Alceu Valença',
      images: [
        'https://s2-casaejardim.glbimg.com/nHlVi8l9Hvjpydwfm2vSykkiVU4=/0x0:1400x933/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_a0b7e59562ef42049f4e191fe476fe7d/internal_photos/bs/2023/p/n/a6KJuERmmFBzM2ibHhhw/platina-220-qual-e-o-predio-mais-alto-de-sao-paulo-casa-e-jardim4.jpg',
        'https://s2-casaejardim.glbimg.com/nHlVi8l9Hvjpydwfm2vSykkiVU4=/0x0:1400x933/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_a0b7e59562ef42049f4e191fe476fe7d/internal_photos/bs/2023/p/n/a6KJuERmmFBzM2ibHhhw/platina-220-qual-e-o-predio-mais-alto-de-sao-paulo-casa-e-jardim4.jpg',
        'https://s2-casaejardim.glbimg.com/nHlVi8l9Hvjpydwfm2vSykkiVU4=/0x0:1400x933/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_a0b7e59562ef42049f4e191fe476fe7d/internal_photos/bs/2023/p/n/a6KJuERmmFBzM2ibHhhw/platina-220-qual-e-o-predio-mais-alto-de-sao-paulo-casa-e-jardim4.jpg'
      ],
      status: EInspectionStatus.DONE,
      updated_at: new Date()
    })
  }

  public async list(): Promise<IInspection[]> {
    const { docs } = await Firebase.firestore()
      .collection('inspecoes')
      .limit(999)
      .get()

    return docs.map((el) => el.data()) as IInspection[]
  }

  public async post(payload: Partial<IInspection>): Promise<string> {
    try {
      const id = uuidv4()

      const data = {
        id,
        created_at: new Date(),
        updated_at: new Date(),
        status: EInspectionStatus.PENDING,
        ...payload
      }

      if (payload && payload.images) {
        for (let counter = 0; counter < payload.images?.length; counter++) {
          payload.images[counter] = await this.detectCrack(
            payload.images[counter]
          )
        }
      }

      await Firebase.firestore().collection('inspecoes').doc(id).set(data, {
        merge: true
      })

      return '@inspecoes/registro-salvo'
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  public async detectCrack(base64Image: string): Promise<string> {
    const formData = new FormData()
    const buffer = Buffer.from(base64Image.split(',')[1], 'base64')
    formData.append('file', buffer, `${new Date().toISOString()}.jpg`)

    try {
      const url = process.env.URL_CRACK_DETECTION_API
      const response = await firstValueFrom(
        this.httpService.post(url as string, formData, {
          headers: {
            ...formData.getHeaders()
          }
        })
      )
      console.log(response.data)
      return JSON.stringify(response.data)
    } catch (error) {
      throw new HttpException(
        'Erro ao acessar a API externa: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
