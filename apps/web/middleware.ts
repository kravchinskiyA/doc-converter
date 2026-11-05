import createMiddleware from 'next-intl/middleware';
import { routing } from '@/shared/i18n';

/**
 * Определение локали (cookie `NEXT_LOCALE` → `Accept-Language` → `uk`)
 * и перенаправление на локализованный путь (`/` → `/uk`).
 */
export default createMiddleware(routing);

export const config = {
  // Исключаются проксируемый API NestJS, служебные пути Next.js и статические файлы
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};

