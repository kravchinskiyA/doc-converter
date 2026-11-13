'use client';

import * as React from 'react';
import {
  ShieldCheck,
  Check,
  Copy,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Download,
  Maximize2,
} from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Checkbox } from '@/shared/ui/checkbox';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/shared/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/ui/dialog';
import { Link } from '@/shared/i18n';
import { cn } from '@/shared/lib/utils';

// Токены палитры Augen Pro
const COLOR_TOKENS = [
  {
    name: 'Off-Black',
    hex: '#0f1012',
    cssVar: '--color-off-black',
    tailwind: 'text-off-black / bg-off-black',
    desc: 'Основной текст интерфейса, темные плашки (футер), заливки иконок на светлом фоне.',
    wcag: 'Контрастность > 15:1 к белому фону (AAA)',
    bgPreview: 'bg-[#0f1012]',
    textColor: 'text-pure-white',
    border: 'border-transparent',
  },
  {
    name: 'Pure Black',
    hex: '#020201',
    cssVar: '--color-pure-black',
    tailwind: 'text-pure-black',
    desc: 'Вторичный текст, контуры иконок, акцентный контраст на белых поверхностях.',
    wcag: 'Максимальный абсолютный контраст (AAA)',
    bgPreview: 'bg-[#020201]',
    textColor: 'text-pure-white',
    border: 'border-transparent',
  },
  {
    name: 'Off-White',
    hex: '#f2f2f4',
    cssVar: '--color-off-white',
    tailwind: 'bg-off-white',
    desc: 'Фоновый холст страницы (Page Canvas), подложки секций — фирменный светлый фон.',
    wcag: 'Базовый холст с мягким серым полутоном',
    bgPreview: 'bg-[#f2f2f4]',
    textColor: 'text-off-black',
    border: 'border-black/10',
  },
  {
    name: 'Pure White',
    hex: '#fdfdfd',
    cssVar: '--color-pure-white',
    tailwind: 'bg-pure-white',
    desc: 'Поверхности карточек, инпутов, плавающих панелей. Создает объем за счет смены тона.',
    wcag: 'Светлая поверхность без размытых теней',
    bgPreview: 'bg-[#fdfdfd]',
    textColor: 'text-off-black',
    border: 'border-black/10',
  },
  {
    name: 'Steel Gray',
    hex: '#5e5e5e',
    cssVar: '--color-steel-gray',
    tailwind: 'text-steel-gray',
    desc: 'Вторичный текст, описания, неактивные подписи и плейсхолдеры.',
    wcag: 'Контрастность 6.4:1 к белому фону (AA)',
    bgPreview: 'bg-[#5e5e5e]',
    textColor: 'text-pure-white',
    border: 'border-transparent',
  },
  {
    name: 'Ash Gray',
    hex: '#8f8f8f',
    cssVar: '--color-ash-gray',
    tailwind: 'text-ash-gray',
    desc: 'Текст отключенных элементов, вспомогательный текст низкого приоритета.',
    wcag: 'Служебные подписи и разделители',
    bgPreview: 'bg-[#8f8f8f]',
    textColor: 'text-pure-white',
    border: 'border-transparent',
  },
  {
    name: 'Signal Blue',
    hex: '#0071e3',
    cssVar: '--color-signal-blue',
    tailwind: 'text-signal-blue / border-signal-blue',
    desc: 'Единственный хроматический акцент: контуры тегов, ссылки, обводка фокуса. Запрещена сплошная заливка кнопок!',
    wcag: 'Интерактивный маркер и индикатор внимания',
    bgPreview: 'bg-[#0071e3]',
    textColor: 'text-pure-white',
    border: 'border-transparent',
  },
];

// Радиусы скругления
const RADII_ITEMS = [
  {
    name: 'rounded-pill',
    value: '9999px',
    tailwind: 'rounded-pill',
    usage: 'Теги, чипы, бейджи, круглые кнопки действий',
    exampleClass: 'rounded-pill h-10 px-6',
  },
  {
    name: 'rounded-section',
    value: '63px',
    tailwind: 'rounded-section',
    usage: 'Контейнеры крупных секций, подложки больших блоков',
    exampleClass: 'rounded-[63px] h-20 w-32',
  },
  {
    name: 'rounded-card',
    value: '54px',
    tailwind: 'rounded-card',
    usage: 'Большие контентные карточки, конвертеры, карточки тарифов',
    exampleClass: 'rounded-[54px] h-20 w-32',
  },
  {
    name: 'rounded-btn',
    value: '26px',
    tailwind: 'rounded-btn',
    usage: 'Кнопки интерфейса всех размеров, плавающие пилюли',
    exampleClass: 'rounded-btn h-11 w-32',
  },
  {
    name: 'rounded-nav',
    value: '10px',
    tailwind: 'rounded-nav',
    usage: 'Навигационные плашки меню, поля ввода (Input)',
    exampleClass: 'rounded-nav h-11 w-32',
  },
];

export function DesignSystemPage() {
  const [copiedHex, setCopiedHex] = React.useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [demoInput, setDemoInput] = React.useState('Пример ввода в стиле Augen Pro');
  const [demoCheckbox, setDemoCheckbox] = React.useState(true);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHex(text);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="space-y-[90px] pb-6 text-off-black">
      {/* 1. Hero & Введение */}
      <section className="flex flex-col items-center text-center">
        <Badge variant="signal-chip" className="mb-6">
          <Sparkles className="h-3.5 w-3.5 mr-1" />
          Augen Pro Design System
        </Badge>
        <h1 className="text-[32px] md:text-[44px] font-book tracking-tight text-off-black max-w-[860px] leading-[1.15] mb-4">
          Витрина компонентов и стандарт интерфейса
        </h1>
        <p className="text-[16px] md:text-[18px] font-book tracking-tight text-steel-gray max-w-[700px] mb-8 leading-relaxed">
          «Apple keynote on surgical white» — клинически-белый минимализм, монохромный светлый холст,
          ультратонкая типографика (weight 350), единственный акцент Signal Blue (<span className="text-signal-blue">#0071e3</span>)
          и строгое соблюдение принципа <strong>zero-shadows</strong>.
        </p>

        {/* Быстрые ссылки по секциям витрины */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-[800px]">
          {[
            { label: 'Палитра цветов', href: '#colors' },
            { label: 'Типографика', href: '#typography' },
            { label: 'Сетка и радиусы', href: '#geometry' },
            { label: 'Кнопки', href: '#buttons' },
            { label: 'Бейджи и чипы', href: '#badges' },
            { label: 'Поля ввода', href: '#inputs' },
            { label: 'Карточки и диалоги', href: '#cards' },
            { label: 'Do & Don’t', href: '#guidelines' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-btn border border-black/10 bg-pure-white px-3.5 py-1.5 text-[14px] font-regular tracking-tight text-off-black hover:border-signal-blue hover:text-signal-blue transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      </section>

      {/* 2. Секция: Цветовая палитра */}
      <section id="colors" className="space-y-6">
        <div className="space-y-1">
          <Badge variant="signal-chip">Раздел 01</Badge>
          <h2 className="text-[27px] font-book tracking-tight text-off-black">
            Цветовая палитра (Color Tokens)
          </h2>
          <p className="text-[15px] font-book text-steel-gray max-w-[720px]">
            Семитоновая палитра. Светлый фон холста (#f2f2f4) контрастирует со сверхчистым белым
            карточек (#fdfdfd). Акцентный синий цвет используется только для контуров и ссылок.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {COLOR_TOKENS.map((token) => (
            <div
              key={token.hex}
              className="rounded-[24px] border border-black/[0.06] bg-pure-white p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                <div
                  className={cn(
                    'h-24 w-full rounded-[16px] flex items-end justify-between p-3 border',
                    token.bgPreview,
                    token.border
                  )}
                >
                  <span className={cn('text-[14px] font-regular', token.textColor)}>
                    {token.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(token.hex)}
                    className={cn(
                      'flex items-center gap-1 rounded-pill px-2.5 py-1 text-[14px] font-regular backdrop-blur-sm transition-all',
                      token.hex === '#fdfdfd' || token.hex === '#f2f2f4'
                        ? 'bg-black/5 text-off-black hover:bg-black/10'
                        : 'bg-white/20 text-pure-white hover:bg-white/30'
                    )}
                    title="Скопировать HEX"
                  >
                    {copiedHex === token.hex ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Скопировано</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>{token.hex}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-[14px] font-regular text-ash-gray">
                    <span>{token.cssVar}</span>
                    <span className="font-mono text-[14px]">{token.tailwind}</span>
                  </div>
                  <p className="text-[14px] font-book text-steel-gray leading-relaxed">
                    {token.desc}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-black/5">
                <span className="text-[14px] font-book text-ash-gray">
                  {token.wcag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Секция: Типографика */}
      <section id="typography" className="space-y-6">
        <div className="space-y-1">
          <Badge variant="signal-chip">Раздел 02</Badge>
          <h2 className="text-[27px] font-book tracking-tight text-off-black">
            Типографика: Whisper-Weight (350 Book)
          </h2>
          <p className="text-[15px] font-book text-steel-gray max-w-[720px]">
            Иерархия строится исключительно за счет размера кегля, а не жирности.
            Вес <strong>350 (Book)</strong> обязателен для всех заголовков и текста.
            Вес <strong>400 (Regular)</strong> допускается только для компактных подписей кнопок.
            Любой bold/semibold (&gt; 400) строго запрещен.
          </p>
        </div>

        <div className="rounded-card border border-black/[0.06] bg-pure-white p-6 md:p-12 space-y-8">
          {/* Характеристики шрифта */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-6 border-b border-black/[0.06]">
            <div>
              <span className="text-[14px] font-regular text-ash-gray block mb-1">Гарнитура</span>
              <p className="text-[16px] font-book text-off-black">
                PP Neue Montreal / Inter / System Sans
              </p>
            </div>
            <div>
              <span className="text-[14px] font-regular text-ash-gray block mb-1">Letter-spacing</span>
              <p className="text-[16px] font-book text-off-black">
                -0.02em (плотный инженерный трекинг)
              </p>
            </div>
            <div>
              <span className="text-[14px] font-regular text-ash-gray block mb-1">Line-height</span>
              <p className="text-[16px] font-book text-off-black">
                1.15 – 1.20 (компактный интерлиньяж)
              </p>
            </div>
          </div>

          {/* Шкала размеров */}
          <div className="space-y-8">
            <div className="space-y-2 pb-6 border-b border-black/[0.06]">
              <div className="flex items-center justify-between text-[14px] font-regular text-ash-gray">
                <span>Display / Page Title</span>
                <span className="font-mono">44px / LH 1.15 / LS -0.02em / Weight 350</span>
              </div>
              <p className="text-[36px] md:text-[44px] font-book tracking-tight text-off-black leading-[1.15]">
                Приватная и быстрая конвертация в ЕС
              </p>
            </div>

            <div className="space-y-2 pb-6 border-b border-black/[0.06]">
              <div className="flex items-center justify-between text-[14px] font-regular text-ash-gray">
                <span>Heading</span>
                <span className="font-mono">27px / LH 32.4px / LS -0.54px / Weight 350</span>
              </div>
              <h2 className="text-[27px] font-book tracking-tight text-off-black leading-[1.2]">
                Конфиденциальность документов уровня ISO 27001
              </h2>
            </div>

            <div className="space-y-2 pb-6 border-b border-black/[0.06]">
              <div className="flex items-center justify-between text-[14px] font-regular text-ash-gray">
                <span>Subheading</span>
                <span className="font-mono">18px / LH 21.6px / LS -0.36px / Weight 350</span>
              </div>
              <h3 className="text-[18px] font-book tracking-tight text-off-black leading-[1.2]">
                Файлы пользователей никогда не передаются внешним облачным сервисам
              </h3>
            </div>

            <div className="space-y-2 pb-6 border-b border-black/[0.06]">
              <div className="flex items-center justify-between text-[14px] font-regular text-ash-gray">
                <span>Body / Основной текст</span>
                <span className="font-mono">16px / LH 19.2px / LS -0.32px / Weight 350</span>
              </div>
              <p className="text-[16px] font-book tracking-tight text-steel-gray leading-relaxed max-w-[840px]">
                Вся обработка происходит исключительно на изолированных вычислительных мощностях в дата-центрах
                Европейского Союза. Данные автоматически стираются через заданный TTL (от 1 часа до 24 часов).
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[14px] font-regular text-ash-gray">
                <span>Caption / Служебные подписи</span>
                <span className="font-mono">14px / LH 14px / Weight 400 (Regular)</span>
              </div>
              <p className="text-[14px] font-regular tracking-tight text-ash-gray">
                Форматы: PDF/A-1b, DOCX, PNG, JPEG. Лимит размера файла: до 500 МБ для аккаунтов Pro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Секция: Геометрия, сетка и радиусы */}
      <section id="geometry" className="space-y-6">
        <div className="space-y-1">
          <Badge variant="signal-chip">Раздел 03</Badge>
          <h2 className="text-[27px] font-book tracking-tight text-off-black">
            Геометрия, сетка и радиусы (Radii)
          </h2>
          <p className="text-[15px] font-book text-steel-gray max-w-[720px]">
            Контурная система Augen Pro использует деликатные волосяные рамки (0.5px) и строго
            выверенную иерархию скруглений: от мягких карточек (54px) до идеальных пилюль (9999px).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RADII_ITEMS.map((item) => (
            <div
              key={item.name}
              className="rounded-[24px] border border-black/[0.06] bg-pure-white p-6 space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[15px] font-regular text-off-black">{item.name}</span>
                  <span className="text-[14px] font-mono text-signal-blue">{item.value}</span>
                </div>
                <p className="text-[14px] font-book text-steel-gray mb-6 leading-relaxed">
                  {item.usage}
                </p>
              </div>

              {/* Визуальная форма */}
              <div className="h-28 rounded-[16px] bg-[#f2f2f4] flex items-center justify-center p-3">
                <div
                  className={cn(
                    'border border-signal-blue/40 bg-pure-white flex items-center justify-center text-[14px] font-mono text-signal-blue',
                    item.exampleClass
                  )}
                >
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Секция: Кнопки */}
      <section id="buttons" className="space-y-6">
        <div className="space-y-1">
          <Badge variant="signal-chip">Раздел 04</Badge>
          <h2 className="text-[27px] font-book tracking-tight text-off-black">
            Кнопки (Buttons)
          </h2>
          <p className="text-[15px] font-book text-steel-gray max-w-[720px]">
            Все кнопки используют радиус скругления <strong>26px (rounded-btn)</strong> или pill-shape.
            <strong> Категорически запрещено использовать сплошную заливку цветом Signal Blue</strong>.
            Основная кнопка имеет мягкую полупрозрачную подложку или темный тон Off-Black.
          </p>
        </div>

        <div className="rounded-card border border-black/[0.06] bg-pure-white p-6 md:p-12 space-y-10">
          {/* Сетка вариантов */}
          <div className="space-y-4">
            <h3 className="text-[18px] font-book text-off-black">Варианты стилизации (Variants)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Floating CTA */}
              <div className="space-y-2 p-4 rounded-[20px] bg-[#f2f2f4]/60">
                <span className="text-[14px] font-regular text-ash-gray block">
                  variant="floating-cta" (Основная кнопка)
                </span>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button variant="floating-cta">
                    <Sparkles className="h-4 w-4 text-signal-blue" />
                    Начать конвертацию
                  </Button>
                </div>
              </div>

              {/* Secondary */}
              <div className="space-y-2 p-4 rounded-[20px] bg-[#f2f2f4]/60">
                <span className="text-[14px] font-regular text-ash-gray block">
                  variant="secondary"
                </span>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button variant="secondary">
                    Настройки задания
                  </Button>
                </div>
              </div>

              {/* Outline */}
              <div className="space-y-2 p-4 rounded-[20px] bg-[#f2f2f4]/60">
                <span className="text-[14px] font-regular text-ash-gray block">
                  variant="outline" (Контур Signal Blue)
                </span>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Скачать DOCX
                  </Button>
                </div>
              </div>

              {/* Ghost */}
              <div className="space-y-2 p-4 rounded-[20px] bg-[#f2f2f4]/60">
                <span className="text-[14px] font-regular text-ash-gray block">
                  variant="ghost" (Без фона)
                </span>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button variant="ghost">
                    Отмена операции
                  </Button>
                </div>
              </div>

              {/* Link */}
              <div className="space-y-2 p-4 rounded-[20px] bg-[#f2f2f4]/60">
                <span className="text-[14px] font-regular text-ash-gray block">
                  variant="link" (Текстовая ссылка)
                </span>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button variant="link">
                    Подробнее о тарифах →
                  </Button>
                </div>
              </div>

              {/* Disabled состояние */}
              <div className="space-y-2 p-4 rounded-[20px] bg-[#f2f2f4]/60">
                <span className="text-[14px] font-regular text-ash-gray block">
                  Состояние disabled
                </span>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button variant="floating-cta" disabled>
                    Заблокировано
                  </Button>
                  <Button variant="outline" disabled>
                    Недоступно
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Размеры */}
          <div className="space-y-4 pt-6 border-t border-black/[0.06]">
            <h3 className="text-[18px] font-book text-off-black">Шкала размеров (Sizes)</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm" variant="floating-cta">
                size="sm" (34px)
              </Button>
              <Button size="default" variant="floating-cta">
                size="default" (42px)
              </Button>
              <Button size="lg" variant="floating-cta">
                size="lg" (48px)
              </Button>
              <Button size="icon" variant="secondary" title="Иконка">
                <Sparkles className="h-4 w-4 text-signal-blue" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Секция: Бейджи и чипы */}
      <section id="badges" className="space-y-6">
        <div className="space-y-1">
          <Badge variant="signal-chip">Раздел 05</Badge>
          <h2 className="text-[27px] font-book tracking-tight text-off-black">
            Бейджи, теги и статусы (Badges & Chips)
          </h2>
          <p className="text-[15px] font-book text-steel-gray max-w-[720px]">
            Бейджи имеют форму пилюли (rounded-pill, 9999px) и деликатную микро-рамку 0.5px.
            Фирменный вариант <strong>signal-chip</strong> является ключевым визуальным акцентом сервиса.
          </p>
        </div>

        <div className="rounded-card border border-black/[0.06] bg-pure-white p-6 md:p-12 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2 p-4 rounded-[20px] bg-[#f2f2f4]/60">
              <span className="text-[14px] font-regular text-ash-gray block">variant="signal-chip"</span>
              <div className="pt-2 flex flex-wrap gap-2">
                <Badge variant="signal-chip">
                  <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                  GDPR & EU Only
                </Badge>
                <Badge variant="signal-chip">PaddleOCR v4</Badge>
              </div>
            </div>

            <div className="space-y-2 p-4 rounded-[20px] bg-[#f2f2f4]/60">
              <span className="text-[14px] font-regular text-ash-gray block">variant="neutral"</span>
              <div className="pt-2 flex flex-wrap gap-2">
                <Badge variant="neutral">Тариф Pro</Badge>
                <Badge variant="neutral">DOCX → PDF</Badge>
              </div>
            </div>

            <div className="space-y-2 p-4 rounded-[20px] bg-[#f2f2f4]/60">
              <span className="text-[14px] font-regular text-ash-gray block">variant="muted"</span>
              <div className="pt-2 flex flex-wrap gap-2">
                <Badge variant="muted">TTL: 2 часа</Badge>
                <Badge variant="muted">В очереди</Badge>
              </div>
            </div>

            <div className="space-y-2 p-4 rounded-[20px] bg-[#f2f2f4]/60">
              <span className="text-[14px] font-regular text-ash-gray block">variant="success"</span>
              <div className="pt-2 flex flex-wrap gap-2">
                <Badge variant="success">
                  <Check className="h-3.5 w-3.5 mr-1" />
                  Конвертировано
                </Badge>
              </div>
            </div>

            <div className="space-y-2 p-4 rounded-[20px] bg-[#f2f2f4]/60">
              <span className="text-[14px] font-regular text-ash-gray block">variant="error"</span>
              <div className="pt-2 flex flex-wrap gap-2">
                <Badge variant="error">
                  <XCircle className="h-3.5 w-3.5 mr-1" />
                  Ошибка формата
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Секция: Формы и инпуты */}
      <section id="inputs" className="space-y-6">
        <div className="space-y-1">
          <Badge variant="signal-chip">Раздел 06</Badge>
          <h2 className="text-[27px] font-book tracking-tight text-off-black">
            Поля ввода и интерактивные контролы
          </h2>
          <p className="text-[15px] font-book text-steel-gray max-w-[720px]">
            Поля ввода имеют высоту 44px, скругление 10px (rounded-nav) и фокусную рамку Signal Blue
            без размытия теней.
          </p>
        </div>

        <div className="rounded-card border border-black/[0.06] bg-pure-white p-6 md:p-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Интерактивный инпут */}
            <div className="space-y-2">
              <label className="text-[14px] font-regular text-steel-gray block">
                Стандартное поле ввода (Input)
              </label>
              <Input
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                placeholder="Введите текст документа..."
              />
              <span className="text-[14px] font-book text-ash-gray block">
                Живое значение: {demoInput}
              </span>
            </div>

            {/* Инпут с ошибкой */}
            <div className="space-y-2">
              <label className="text-[14px] font-regular text-steel-gray block">
                Поле с ошибкой валидации (error=true)
              </label>
              <Input
                error
                defaultValue="invalid-api-key-format"
                placeholder="Ключ API"
              />
              <span className="text-[14px] font-book text-red-600 block">
                Неверный формат ключа (ожидается dc_live_...)
              </span>
            </div>

            {/* Заблокированное поле */}
            <div className="space-y-2">
              <label className="text-[14px] font-regular text-steel-gray block">
                Заблокированное поле (disabled)
              </label>
              <Input
                disabled
                defaultValue="readonly_system_file.pdf"
              />
              <span className="text-[14px] font-book text-ash-gray block">
                Редактирование запрещено
              </span>
            </div>

            {/* Чекбоксы */}
            <div className="space-y-3">
              <label className="text-[14px] font-regular text-steel-gray block">
                Флажки выбора (Checkbox)
              </label>
              <div className="space-y-2.5 pt-1">
                <Checkbox
                  checked={demoCheckbox}
                  onChange={(e) => setDemoCheckbox(e.target.checked)}
                  label="Включить оптическое распознавание текста (PaddleOCR v4)"
                />
                <Checkbox
                  defaultChecked
                  disabled
                  label="Изоляция данных в Европейском Союзе (Обязательно)"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Секция: Карточки и модальные диалоги */}
      <section id="cards" className="space-y-6">
        <div className="space-y-1">
          <Badge variant="signal-chip">Раздел 07</Badge>
          <h2 className="text-[27px] font-book tracking-tight text-off-black">
            Карточки и модальные диалоги
          </h2>
          <p className="text-[15px] font-book text-steel-gray max-w-[720px]">
            Контентные карточки используют скругление 54px и внутренние отступы 69px.
            Диалоговые окна имеют мягкое затемнение подложки (bg-black/25) без тяжелых теней.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Пример карточки */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="signal-chip">Демонстрационная карточка</Badge>
                <span className="text-[14px] font-mono text-ash-gray">p-6 md:p-[69px]</span>
              </div>
              <CardTitle>Структура Card компонента</CardTitle>
              <CardDescription>
                Внутри карточки размещаются заголовок, описание, контентный блок и подвал с кнопками действий.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-[14px] font-book text-steel-gray leading-relaxed">
                Смена оттенков между подложкой холста (#f2f2f4) и поверхностью карточки (#fdfdfd)
                создает ощущение объема без необходимости применять затемняющие тени.
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <span className="text-[14px] font-book text-ash-gray">Радиус: 54px</span>
              <Button variant="secondary" size="sm">
                Действие
              </Button>
            </CardFooter>
          </Card>

          {/* Интерактивный диалог */}
          <div className="rounded-card border border-black/[0.06] bg-pure-white p-6 md:p-12 space-y-6">
            <h3 className="text-[20px] font-book text-off-black">
              Модальное окно (Dialog)
            </h3>
            <p className="text-[14px] font-book text-steel-gray leading-relaxed">
              Нажмите кнопку ниже, чтобы открыть полнофункциональное модальное окно Augen Pro с
              поддержкой закрытия клавишей Esc, кликом по оверлею или кнопкой закрытия.
            </p>
            <div>
              <Button
                variant="floating-cta"
                onClick={() => setIsDialogOpen(true)}
              >
                <Maximize2 className="h-4 w-4 mr-1 text-signal-blue" />
                Открыть демонстрационный Dialog
              </Button>
            </div>
          </div>
        </div>

        {/* Реальный диалог */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent onClose={() => setIsDialogOpen(false)}>
            <DialogHeader>
              <DialogTitle>Подтверждение параметров конвертации</DialogTitle>
              <DialogDescription>
                Параметры безопасности и изоляции применяются к выбранным файлам.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4 text-[14px] font-book text-steel-gray">
              <div className="rounded-[16px] bg-[#f2f2f4] p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-off-black">Направление:</span>
                  <span className="font-mono text-signal-blue">PDF → DOCX (PaddleOCR)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-off-black">Шифрование S3:</span>
                  <span className="text-emerald-600">SSE-KMS (Европейский регион)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-off-black">TTL хранения:</span>
                  <span>2 часа после завершения</span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Отмена
              </Button>
              <Button variant="floating-cta" onClick={() => setIsDialogOpen(false)}>
                Подтвердить и продолжить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      {/* 9. Секция: Do & Don't и Zero-Shadows */}
      <section id="guidelines" className="space-y-6">
        <div className="space-y-1">
          <Badge variant="signal-chip">Раздел 08</Badge>
          <h2 className="text-[27px] font-book tracking-tight text-off-black">
            Свод правил: Do & Don’t
          </h2>
          <p className="text-[15px] font-book text-steel-gray max-w-[720px]">
            Критически важные инварианты дизайн-системы Augen Pro, обязательные для любого экрана и компонента.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DO */}
          <div className="rounded-[32px] border border-emerald-500/20 bg-pure-white p-7 space-y-5">
            <div className="flex items-center gap-2 text-emerald-600 text-[18px] font-regular">
              <CheckCircle2 className="h-5 w-5" />
              <span>ОБЯЗАТЕЛЬНО (Do)</span>
            </div>
            <ul className="space-y-3.5 text-[14px] font-book text-steel-gray">
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>Базовый вес шрифта <strong>350 (Book)</strong> для всех заголовков и текста.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>Все контентные карточки оформлять со скруглением <strong>54px</strong>, а чипы — <strong>9999px</strong>.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>Строгий вертикальный ритм <strong>90–100px</strong> между смысловыми блоками.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>Единый трекинг <strong>-0.02em</strong> для всех размеров шрифта.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>Тонкие волосяные рамки (0.5px border-black/[0.06]) для разделения поверхностей.</span>
              </li>
            </ul>
          </div>

          {/* DON'T */}
          <div className="rounded-[32px] border border-red-500/20 bg-pure-white p-7 space-y-5">
            <div className="flex items-center gap-2 text-red-600 text-[18px] font-regular">
              <XCircle className="h-5 w-5" />
              <span>КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО (Don’t)</span>
            </div>
            <ul className="space-y-3.5 text-[14px] font-book text-steel-gray">
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                <span><strong>Никаких теней (Zero-Shadows):</strong> размытые box-shadow и drop-shadow исключены.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                <span><strong>Никаких сплошных синих заливок:</strong> Signal Blue (#0071e3) только для рамок и текста ссылок.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                <span><strong>Запрещены жирные начертания (&gt; 400):</strong> bold и semibold ломают концепцию «whisper-weight».</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                <span><strong>Никаких фоновых градиентов или цветных пятен:</strong> холст стерильно монохромен.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                <span>Не превышать максимальную ширину контента <strong>1200px</strong>.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 10. Нижняя плашка с навигацией на конвертер */}
      <section className="text-center pt-8">
        <p className="text-[14px] font-book text-steel-gray mb-4">
          Готовы протестировать конвертацию в реальном интерфейсе?
        </p>
        <Link href="/convert/pdf-to-docx">
          <Button variant="floating-cta" size="lg">
            Перейти к конвертеру документов
            <ArrowRight className="h-4 w-4 ml-1 text-signal-blue" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
