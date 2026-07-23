import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Star, CheckCircle2, Loader2 } from 'lucide-react';
import { openLink } from '@/lib/telegram';

export default function Tasks() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const [verifyingId, setVerifyingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', userId],
    queryFn: () => api.getTasks(userId),
    enabled: !!userId,
  });

  const handleTask = (task: { id: number; channel_link: string; already_completed: boolean }) => {
    if (task.already_completed || verifyingId !== null) return;
    openLink(task.channel_link);

    setTimeout(async () => {
      setVerifyingId(task.id);
      try {
        const res = await api.verifyTask(task.id, userId);
        if (res.success) {
          setMessage({ type: 'ok', text: `✅ Задание выполнено! +${res.stars_earned} Stars` });
          queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
          queryClient.invalidateQueries({ queryKey: ['profile', userId] });
        } else {
          setMessage({ type: 'err', text: res.message || 'Подпишитесь на канал и попробуйте снова.' });
        }
      } catch {
        setMessage({ type: 'err', text: 'Ошибка проверки. Попробуйте позже.' });
      } finally {
        setVerifyingId(null);
        setTimeout(() => setMessage(null), 3000);
      }
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/2" />
        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-muted rounded-2xl" />)}
      </div>
    );
  }

  const available = tasks?.filter(t => !t.already_completed) ?? [];
  const completed = tasks?.filter(t => t.already_completed) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Заработать Stars</h1>
        <p className="text-sm text-muted-foreground">Подписывайтесь на каналы и получайте награды.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl text-sm font-medium ${
          message.type === 'ok'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {available.length === 0 && completed.length === 0 && (
        <div className="text-center p-8 rounded-2xl border border-dashed">
          <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-semibold">Задания пока недоступны</p>
          <p className="text-sm text-muted-foreground mt-1">Приходите позже!</p>
        </div>
      )}

      {available.length > 0 && (
        <div>
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
            Доступные ({available.length})
          </h2>
          <div className="space-y-3">
            {available.map(task => (
              <button
                key={task.id}
                onClick={() => handleTask(task)}
                disabled={verifyingId !== null}
                className="w-full text-left p-4 rounded-2xl bg-white border shadow-sm hover:shadow-md transition-all disabled:opacity-60"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm truncate max-w-[220px]">{task.channel_link}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Нажмите, чтобы подписаться</p>
                  </div>
                  <div className="flex items-center gap-1 text-blue-600 font-bold text-sm ml-2 shrink-0">
                    {verifyingId === task.id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <><Star className="w-4 h-4 fill-blue-500" />+{task.stars_reward}</>
                    }
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
            Выполнено ({completed.length})
          </h2>
          <div className="space-y-2">
            {completed.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-4 rounded-2xl bg-muted/40 border opacity-60">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <p className="text-sm truncate">{task.channel_link}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
