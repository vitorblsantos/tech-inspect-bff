import { Storage } from '@google-cloud/storage'

import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common'

import { v7 as uuidv7 } from 'uuid'

import { createHash } from 'crypto'

import { EInspectionStatus, IDashboard, IInspection } from '@/app.interfaces'
import { Firebase } from '@/app.config'
import { formatDayMonthYear } from './app.utils'

@Injectable()
export class Services {
  constructor() {}
  private readonly repository = Firebase.firestore().collection('inspecoes')
  private readonly storage = new Storage()
  private readonly bucket = this.storage.bucket('tech-inspect')

  public async get(): Promise<IDashboard> {
    try {
      const { docs, size } = await this.repository
        .orderBy('created_at', 'desc')
        .get()

      const inspecoes = {
        jan: 0,
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

      let lastDocument

      docs.forEach((el, key) => {
        const document = el.data()

        if (key === 0) lastDocument = document

        const month = new Date(document.created_at._seconds * 1000).getMonth()

        if (month === 1) return inspecoes.fev++
        if (month === 2) return inspecoes.mar++
        if (month === 3) return inspecoes.abr++
        if (month === 4) return inspecoes.mai++
        if (month === 5) return inspecoes.jun++
        if (month === 6) return inspecoes.jul++
        if (month === 7) return inspecoes.ago++
        if (month === 8) return inspecoes.set++
        if (month === 9) return inspecoes.out++
        if (month === 10) return inspecoes.nov++
        if (month === 11) return inspecoes.dez++
        return inspecoes.jan++
      })

      return {
        inspecoes,
        pendencias: 0,
        total: size,
        ultimaInspecao: new Date(
          lastDocument.created_at._seconds * 1000
        ).toLocaleDateString()
      }
    } catch (err) {
      Logger.error(err)
      throw new InternalServerErrorException(err)
    }
  }

  public async getInspection(id: string): Promise<IInspection> {
    try {
      const snapshot = await Firebase.firestore()
        .collection('inspecoes')
        .doc(id)
        .get()

      if (!snapshot.exists) throw new NotFoundException()

      const data = snapshot.data()

      return data as IInspection
    } catch (err) {
      Logger.error(err)
      throw new InternalServerErrorException(err)
    }
  }

  public async list(): Promise<IInspection[]> {
    try {
      const { docs, empty } = await this.repository
        .orderBy('created_at', 'desc')
        .get()

      if (empty) {
        Logger.warn('Query de inspecoes retornou vazia')
        throw new NotFoundException('Query de inspecoes retornou vazia')
      }

      return docs.map((el) => el.data()) as IInspection[]
    } catch (err) {
      Logger.error(err)
      throw new InternalServerErrorException(err)
    }
  }

  public async post(
    payload: IInspection & { images: string[] }
  ): Promise<string> {
    try {
      const id = uuidv7()

      const handleImages = async (image: string): Promise<string> => {
        const base64Data = image.split(',')[1]
        const buffer = Buffer.from(base64Data, 'base64')
        const blobName = `${createHash('sha256').update(buffer).digest('hex')}.jpg`

        const blob = this.bucket.file(blobName)
        const stream = blob.createWriteStream({
          resumable: false
        })

        return new Promise((resolve, reject) => {
          stream.on('error', (err) => reject(err))
          stream.on('finish', () => {
            const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${blobName}`
            resolve(publicUrl)
          })
          stream.end(buffer)
        })
      }

      const imageUrls = await Promise.all(
        payload.images?.map((el: string) => handleImages(el)) || []
      )

      const data = {
        ...payload,
        id,
        images: imageUrls.map((el) => ({
          original: el,
          manipulated: null
        })),
        created_at: new Date(),
        updated_at: new Date(),
        status: EInspectionStatus.PENDING
      }

      await this.repository.doc(id).set(data, {
        merge: true
      })

      return '@inspecoes/registro-salvo'
    } catch (err) {
      Logger.error(err)
      throw new InternalServerErrorException('Erro ao salvar a inspeção', err)
    }
  }
}
