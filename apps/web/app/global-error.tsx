'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="uk">
      <body className="min-h-screen flex items-center justify-center bg-[#f2f2f4] text-[#0f1012] font-sans p-4">
        <div className="max-w-md w-full text-center space-y-4 p-8 rounded-[36px] bg-white border border-black/10">
          <div className="w-12 h-12 mx-auto rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xl font-bold">
            500
          </div>
          <h1 className="text-2xl font-semibold">Помилка сервера / Ошибка сервера</h1>
          <p className="text-sm text-gray-500">
            An unexpected error occurred. Please try again.
          </p>
          {error?.digest && (
            <p className="text-xs font-mono text-gray-400">Digest: {error.digest}</p>
          )}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="px-6 py-2.5 rounded-full bg-[#0071e3] text-white text-sm font-medium hover:bg-[#0071e3]/90 transition-colors"
            >
              Спробувати знову / Попробовать снова
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

