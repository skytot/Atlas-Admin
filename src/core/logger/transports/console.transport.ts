import type { LogPayload, LogTransport } from '../types'

export const consoleTransport: LogTransport = {
  log(payload: LogPayload): void {
    const { level, message, args, timestamp, context, tags } = payload
    const time = new Date(timestamp).toISOString()

    const extras = buildExtras({ args, context, tags })

    // eslint-disable-next-line no-console
    console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'info'](
      `[${time}] [${level.toUpperCase()}] ${message}`,
      ...extras
    )
  }
}

function buildExtras({
  args,
  context,
  tags
}: Pick<LogPayload, 'args' | 'context' | 'tags'>): unknown[] {
  const extras: unknown[] = []

  if (args && args.length > 0) {
    extras.push({ args })
  }

  if (context && Object.keys(context).length > 0) {
    extras.push({ context })
  }

  if (tags && tags.length > 0) {
    extras.push({ tags })
  }

  return extras
}
