import { HttpService } from '@nestjs/axios'
import { Injectable, Logger, NotFoundException } from '@nestjs/common'

import { v7 as uuidv7 } from 'uuid'

import { EInspectionStatus, IDashboard, IInspection } from '@/app.interfaces'
import { Firebase } from './app.config'

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
      images: {
        original:
          'https://s2-casaejardim.glbimg.com/nHlVi8l9Hvjpydwfm2vSykkiVU4=/0x0:1400x933/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_a0b7e59562ef42049f4e191fe476fe7d/internal_photos/bs/2023/p/n/a6KJuERmmFBzM2ibHhhw/platina-220-qual-e-o-predio-mais-alto-de-sao-paulo-casa-e-jardim4.jpg',
        manipulated: [
          'https://s2-casaejardim.glbimg.com/nHlVi8l9Hvjpydwfm2vSykkiVU4=/0x0:1400x933/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_a0b7e59562ef42049f4e191fe476fe7d/internal_photos/bs/2023/p/n/a6KJuERmmFBzM2ibHhhw/platina-220-qual-e-o-predio-mais-alto-de-sao-paulo-casa-e-jardim4.jpg',
          'https://s2-casaejardim.glbimg.com/nHlVi8l9Hvjpydwfm2vSykkiVU4=/0x0:1400x933/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_a0b7e59562ef42049f4e191fe476fe7d/internal_photos/bs/2023/p/n/a6KJuERmmFBzM2ibHhhw/platina-220-qual-e-o-predio-mais-alto-de-sao-paulo-casa-e-jardim4.jpg',
          'https://s2-casaejardim.glbimg.com/nHlVi8l9Hvjpydwfm2vSykkiVU4=/0x0:1400x933/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_a0b7e59562ef42049f4e191fe476fe7d/internal_photos/bs/2023/p/n/a6KJuERmmFBzM2ibHhhw/platina-220-qual-e-o-predio-mais-alto-de-sao-paulo-casa-e-jardim4.jpg'
        ]
      },
      status: EInspectionStatus.DONE,
      updated_at: new Date()
    })
  }

  public async list(): Promise<IInspection[]> {
    try {
      const { docs, empty } = await Firebase.firestore()
        .collection('inspecoes')
        .limit(999)
        .get()

      if (empty) {
        Logger.warn('Query de inspecoes retornou vazia')
        throw new NotFoundException('Query de inspecoes retornou vazia')
      }

      return docs.map((el) => el.data()) as IInspection[]
    } catch (err) {
      Logger.error(err)
      throw err
    }
  }

  public async post(payload: Partial<IInspection>): Promise<string> {
    try {
      const id = uuidv7()

      const data = {
        id,
        created_at: new Date(),
        updated_at: new Date(),
        status: EInspectionStatus.PENDING,
        ...payload
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
}
