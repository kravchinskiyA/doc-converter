import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Локализованные обёртки навигации Next.js: автоматически добавляют префикс текущей локали.
 * Вместо `next/link` и `next/navigation` внутри `[locale]` используйте эти API.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

