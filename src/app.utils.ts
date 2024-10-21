import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Timestamp } from 'firebase-admin/firestore'
import { toZonedTime, format as formatDateZoned } from 'date-fns-tz'

export const TIMEZONE = 'America/Sao_Paulo'

export const formatTimestamp = (timestamp: string) => {
  const zonedTime = toZonedTime(timestamp, TIMEZONE)
  return formatDateZoned(zonedTime, 'yyyy-MM-dd HH:mm:ss', {
    timeZone: TIMEZONE
  })
}

export const formatDayMonthYear = (timestamp: string) => {
  const zonedTime = toZonedTime(timestamp, TIMEZONE)
  return formatDateZoned(zonedTime, 'dd/MM/yyyy', {
    timeZone: TIMEZONE
  })
}

export const getDateFirestoreTimestamp = (): Timestamp => {
  const _date = new Date()
  const formattedDate = format(_date, 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })
  const [day, month, year, hours, minutes, seconds] = formattedDate
    .split(/\D+/)
    .map(Number)
  const isoDateString = new Date(
    year,
    month - 1,
    day,
    hours,
    minutes,
    seconds
  ).toISOString()
  const firestoreTimestamp = Timestamp.fromDate(new Date(isoDateString))

  return firestoreTimestamp
}
