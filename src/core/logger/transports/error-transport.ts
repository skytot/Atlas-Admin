import type { LogPayload, LogTransport } from '../types'
import { reportError } from '@/core/error/reporter'

const REPORTABLE_LEVELS: ReadonlySet<LogPayload['level']> = new Set(['error'])

export const errorTransport: LogTransport = {
  async log(payload: LogPayload): Promise<void> {
    if (!REPORTABLE_LEVELS.has(payload.level)) {
      return
    }

    await reportError({
      message: payload.message,
      level: 'error',
      timestamp: payload.timestamp,
      context: {
        extra: {
          args: payload.args,
          loggerContext: payload.context
        }
      }
    })
  }
}

