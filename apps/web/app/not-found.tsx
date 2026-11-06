import Link from 'next/link';

export default function RootNotFound() {
  return (
    <html lang="uk">
      <body className="min-h-screen flex items-center justify-center bg-[#f2f2f4] text-[#0f1012] font-sans p-4">
        <div className="max-w-md w-full text-center space-y-4 p-8 rounded-[36px] bg-white border border-black/10">
          <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-[#0071e3] flex items-center justify-center text-xl font-bold">
            404
          </div>
          <h1 className="text-2xl font-semibold">Сторінку не знайдено / Страница не найдена</h1>
          <p className="text-sm text-gray-500">
            The requested page does not exist. Please return to the homepage.
          </p>
          <div className="pt-2">
            <Link
              href="/uk"
              className="inline-block px-6 py-2.5 rounded-full bg-[#0071e3] text-white text-sm font-medium hover:bg-[#0071e3]/90 transition-colors"
            >
              На головну / На главную
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
