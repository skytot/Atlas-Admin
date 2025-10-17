import type { ErrorPayload, ErrorReporter, ErrorReporterOptions } from './types'

const DEFAULT_OPTIONS: Required<ErrorReporterOptions> = {
  logToConsole: true,
  tags: []
}

/**
 * 默认错误上报器
 * 可在此处接入实际的日志服务（如 Sentry、TrackJS 等）
 */
class DefaultErrorReporter implements ErrorReporter {
  constructor(private readonly options: Required<ErrorReporterOptions>) {}

  async report(payload: ErrorPayload): Promise<void> {
    if (this.options.logToConsole) {
      emitConsoleLog(payload)
    }

    // TODO: 在此处接入实际的错误上报服务
    // 例如：await sendToSentry(payload)
  }
}

let reporter: ErrorReporter = new DefaultErrorReporter(DEFAULT_OPTIONS)

export function configureErrorReporter(options: ErrorReporterOptions = {}): void {
  const merged: Required<ErrorReporterOptions> = {
    ...DEFAULT_OPTIONS,
    ...options,
    tags: [...new Set([...(DEFAULT_OPTIONS.tags ?? []), ...(options.tags ?? [])])]
  }

  reporter = new DefaultErrorReporter(merged)
}

export async function reportError(payload: ErrorPayload): Promise<void> {
  await reporter.report({
    ...payload,
    tags: mergeTags(payload.tags)
  })
}

function mergeTags(tags?: string[]): string[] {
  return [...new Set(tags?.filter(Boolean) ?? [])]
}

// 封装控制台输出，避免直接泄漏实现细节
function emitConsoleLog(payload: ErrorPayload): void {
  const { level, message, name, stack, context, tags } = payload

  // eslint-disable-next-line no-console
  console.error('[ErrorReporter]', {
    level,
    message,
    name,
    stack,
    context,
    tags
  })
}
