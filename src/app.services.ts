import { v4 as uuidv4 } from 'uuid'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import Firebase from 'firebase-admin'

import { EInspectionStatus, IDashboard, IInspection } from '@/app.interfaces'
import { firstValueFrom } from 'rxjs'
import { HttpService } from '@nestjs/axios'
import * as FormData from 'form-data'

@Injectable()
export class Services {
  constructor(private readonly httpService: HttpService) {}

  public get(): Promise<IDashboard> {
    return Promise.resolve({
      total: 120,
      pendencias: 0,
      ultimaInspecao: new Date(),
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

  public getInspection(): Promise<IInspection> {
    return Promise.resolve({
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
    return Promise.resolve([
      {
        created_at: new Date(),
        description: 'teste',
        edificio: 'teste',
        images: ['teste'],
        inspetor: 'teste',
        status: EInspectionStatus.DONE,
        updated_at: new Date()
      }
    ])
  }

  public async post(payload: Partial<IInspection>): Promise<string> {
    const id = uuidv4()

    await Firebase.firestore()
      .collection('inspecoes')
      .doc(id)
      .set(
        {
          id,
          created_at: new Date(),
          updated_at: new Date(),
          status: EInspectionStatus.PENDING,
          ...payload
        },
        {
          merge: true
        }
      )

    return '@inspecoes/registro-salvo'
  }

  public async detectCrack(file: Express.Multer.File): Promise<string> {
    const formData = new FormData()

    const fileStream = file.buffer
    formData.append('file', fileStream, file.originalname)

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
