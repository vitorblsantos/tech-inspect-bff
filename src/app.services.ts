import { v4 as uuidv4 } from 'uuid'
import { Injectable } from '@nestjs/common'
import Firebase from 'firebase-admin'

import { EInspectionStatus, IDashboard, IInspection } from '@/app.interfaces'

@Injectable()
export class Services {
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
      status: EInspectionStatus['DONE'],
      updated_at: new Date()
    })
  }

  public list(): Promise<IDashboard> {
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

  public async post(payload: Partial<IInspection>): Promise<string> {
    const id = uuidv4()

    await Firebase.firestore().collection('inspecoes').doc(id).set({
      id,
      created_at: new Date(),
      updated_at: new Date(),
      status: EInspectionStatus['PENDING'],
      ...payload
    }, {
      merge: true
    })

    return '@inspecoes/registro-salvo'
  }
}
