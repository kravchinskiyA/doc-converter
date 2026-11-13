'use client';

import * as React from 'react';
import {
  FileText,
  Download,
  Trash2,
  Search,
  Filter,
  Globe,
  Terminal,
  Clock,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Input } from '@/shared/ui/input';
import { Checkbox } from '@/shared/ui/checkbox';
import type { useAccountState } from '../model/use-account-state';

type SavedFilesTableProps = ReturnType<typeof useAccountState>;

export function SavedFilesTable({
  files,
  allFilesCount,
  selectedFileIds,
  setSelectedFileIds,
  searchQuery,
  setSearchQuery,
  sourceFilter,
  setSourceFilter,
  handleDeleteFile,
  handleDeleteSelectedFiles,
  handleDownloadSingleFileZip,
  handleDownloadSelectedZip,
}: SavedFilesTableProps) {
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 МБ';
    const mb = bytes / (1024 * 1024);
    if (mb < 1024) return `${mb.toFixed(1)} МБ`;
    const gb = mb / 1024;
    return `${gb.toFixed(2)} ГБ`;
  };

  const formatDate = (isoString: string): string => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const allSelected = files.length > 0 && selectedFileIds.length === files.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedFileIds([]);
    } else {
      setSelectedFileIds(files.map((f) => f.id));
    }
  };

  const toggleSelectFile = (id: string) => {
    setSelectedFileIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <Card className="rounded-[40px] border-[0.5px] border-black/10 bg-pure-white p-6 md:p-10">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-black/5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="signal-chip">Хранение 6 месяцев</Badge>
            <Badge variant="neutral">Всего файлов: {allFilesCount}</Badge>
          </div>
          <CardTitle className="text-[22px] md:text-[26px]">Сохранённые результаты</CardTitle>
          <CardDescription className="text-steel-gray text-[14px]">
            Результаты конвертации через сайт и API с индивидуальным и пакетным ZIP-скачиванием
          </CardDescription>
        </div>

        {/* Панель массовых действий */}
        {selectedFileIds.length > 0 && (
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-black/[0.04] border-[0.5px] border-black/10">
            <span className="text-[14px] font-medium text-off-black px-3">
              Выбрано: {selectedFileIds.length}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownloadSelectedZip}
              className="gap-1.5 text-[14px] h-[32px] px-3"
            >
              <Download className="h-3 w-3" />
              Скачать ZIP
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteSelectedFiles}
              className="gap-1.5 text-[14px] h-[32px] px-3 border-red-500/30 text-red-600 hover:bg-red-500/5"
            >
              <Trash2 className="h-3 w-3" />
              Удалить
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {/* Фильтры и поиск */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-steel-gray" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по имени файла..."
              className="pl-9 h-[38px] text-[14px] rounded-full"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/[0.03] border-[0.5px] border-black/5 self-start sm:self-auto">
            <span className="text-[14px] text-steel-gray px-2 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Источник:
            </span>
            <button
              onClick={() => setSourceFilter('all')}
              className={`px-3 py-1 text-[14px] rounded-full transition-all ${
                sourceFilter === 'all'
                  ? 'bg-pure-white text-off-black font-medium shadow-none border-[0.5px] border-black/10'
                  : 'text-steel-gray hover:text-off-black'
              }`}
            >
              Все ({allFilesCount})
            </button>
            <button
              onClick={() => setSourceFilter('web')}
              className={`px-3 py-1 text-[14px] rounded-full transition-all flex items-center gap-1 ${
                sourceFilter === 'web'
                  ? 'bg-pure-white text-off-black font-medium shadow-none border-[0.5px] border-black/10'
                  : 'text-steel-gray hover:text-off-black'
              }`}
            >
              <Globe className="h-3 w-3" /> Сайт
            </button>
            <button
              onClick={() => setSourceFilter('api')}
              className={`px-3 py-1 text-[14px] rounded-full transition-all flex items-center gap-1 ${
                sourceFilter === 'api'
                  ? 'bg-pure-white text-off-black font-medium shadow-none border-[0.5px] border-black/10'
                  : 'text-steel-gray hover:text-off-black'
              }`}
            >
              <Terminal className="h-3 w-3" /> API
            </button>
          </div>
        </div>

        {/* Таблица результатов */}
        {files.length === 0 ? (
          <div className="rounded-[28px] border-[0.5px] border-dashed border-black/15 p-12 text-center space-y-3 bg-[#fdfdfd]">
            <FileText className="h-8 w-8 text-steel-gray/60 mx-auto" />
            <h4 className="text-[16px] font-book text-off-black">Нет сохранённых документов</h4>
            <p className="text-[14px] text-steel-gray max-w-sm mx-auto">
              Здесь будут автоматически отображаться все результаты ваших конвертаций через сайт или API.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[24px] border-[0.5px] border-black/10 bg-[#fdfdfd]">
            <table className="w-full text-left border-collapse text-[14px]">
              <thead>
                <tr className="border-b border-black/5 bg-black/[0.02] text-steel-gray text-[14px] font-regular">
                  <th className="py-3.5 pl-4 pr-2 w-10">
                    <Checkbox
                      id="select-all-files"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="py-3.5 px-3">Имя файла</th>
                  <th className="py-3.5 px-3">Формат</th>
                  <th className="py-3.5 px-3">Размер</th>
                  <th className="py-3.5 px-3">Источник</th>
                  <th className="py-3.5 px-3">Доступен до</th>
                  <th className="py-3.5 pr-4 pl-3 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {files.map((file) => {
                  const isSelected = selectedFileIds.includes(file.id);
                  return (
                    <tr
                      key={file.id}
                      className={`hover:bg-black/[0.015] transition-colors ${
                        isSelected ? 'bg-signal-blue/[0.03]' : ''
                      }`}
                    >
                      <td className="py-3 pl-4 pr-2">
                        <Checkbox
                          id={`file-${file.id}`}
                          checked={isSelected}
                          onChange={() => toggleSelectFile(file.id)}
                        />
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2 max-w-[260px] truncate">
                          <FileText className="h-4 w-4 text-steel-gray shrink-0" />
                          <span className="font-book text-off-black truncate" title={file.name}>
                            {file.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="neutral" className="text-[14px] px-2 py-0.5">
                          {file.format}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 font-mono text-[14px] text-steel-gray">
                        {formatBytes(file.sizeBytes)}
                      </td>
                      <td className="py-3 px-3">
                        {file.source === 'web' ? (
                          <span className="inline-flex items-center gap-1 text-[14px] text-steel-gray">
                            <Globe className="h-3 w-3 text-signal-blue" /> Web
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[14px] text-steel-gray">
                            <Terminal className="h-3 w-3 text-amber-600" /> API
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-steel-gray text-[14px]">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-steel-gray/80" />
                          {formatDate(file.expiresAt)}
                        </span>
                      </td>
                      <td className="py-3 pr-4 pl-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDownloadSingleFileZip(file)}
                            className="h-[30px] px-2.5 text-[14px] gap-1"
                            title="Скачать ZIP архив этого файла (ТЗ §10.2)"
                          >
                            <Download className="h-3 w-3" />
                            ZIP
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteFile(file.id)}
                            className="h-[30px] w-[30px] p-0 text-steel-gray hover:text-red-600"
                            title="Удалить файл"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

