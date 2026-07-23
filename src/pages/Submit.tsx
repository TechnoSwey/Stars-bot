import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import { Star, Loader2 } from 'lucide-react';

export default function Submit() {
  const { userId, stars } = useAuth();
  const [link, setLink] = useState('');
  const [count, setCount] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  const totalCost = count && price ? Math.round(Number(count) * Number(price) * 100) / 100 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link || !count || !price) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await api.createRequest({
        user_id: userId,
        channel_link: link,
        completions_total: Number(count),
        price_per_completion: Number(price),
      });
      setResult({ ok: true, text: `✅ Заявка #${res.id} создана! Добавьте бота в канал как администратора.` });
      setLink(''); setCount(''); setPrice('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка создания заявки';
      setResult({ ok: false, text: msg.includes('insufficient') ? '❌ Недостаточно Stars на балансе.' : `❌ ${msg}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Добавить канал</h1>
        <p className="text-sm text-muted-foreground">Получайте реальных подписчиков за Stars.</p>
      </div>

      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
        <p className="text-sm text-blue-700">
          💡 Ваш баланс: <strong>{stars.toFixed(2)} Stars</strong>
        </p>
      </div>

      {result && (
        <div className={`p-4 rounded-2xl text-sm font-medium ${
          result.ok ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {result.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-5 rounded-2xl bg-white border shadow-sm space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="link">Ссылка на канал</label>
            <input
              id="link"
              type="url"
              placeholder="https://t.me/yourchannel"
              value={link}
              onChange={e => setLink(e.target.value)}
              required
              className="w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="count">Количество подписчиков</label>
            <input
              id="count"
              type="number"
              min="1"
              placeholder="100"
              value={count}
              onChange={e => setCount(e.target.value)}
              required
              className="w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="price">Stars за подписчика</label>
            <input
              id="price"
              type="number"
              min="0.1"
              step="0.1"
              placeholder="1.0"
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
              className="w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {totalCost > 0 && (
            <div className="pt-3 border-t flex items-center justify-between">
              <span className="font-semibold text-sm">Итого:</span>
              <div className="flex items-center gap-1.5 text-xl font-bold text-blue-600">
                <span>{totalCost}</span>
                <Star className="w-5 h-5 fill-blue-500" />
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 rounded-2xl bg-blue-600 text-white font-semibold text-base flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Star className="w-5 h-5" />}
          {loading ? 'Создаём заявку...' : 'Оплатить и отправить'}
        </button>
      </form>
    </div>
  );
}
