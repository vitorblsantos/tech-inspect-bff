import * as Sentry from '@sentry/nestjs'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

Sentry.init({
  dsn: 'https://b797ab10d60f6a47074a7065a08e7888@o4507723003199488.ingest.de.sentry.io/4508156762194000',
  environment: 'production',
  release: 'tech-inspect@1.0.0',
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1, //  Capture 100% of the transactions
  profilesSampleRate: 1
})

Sentry.setTag('app-name', 'tech-inspect-bff')
