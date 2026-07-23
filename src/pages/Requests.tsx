import { useAuth } from '@/context/auth-context';
import { useQuery } from '@tanstack/react-query';
import { api, TaskRequest } from '@/lib/api';
import { CheckCircle2, Clock, XCircle, Loader2 } from 'lucide-react';

const STATUS_LABELS: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  pending_admin_check: { label: 'Ожидает проверки',  icon: Clock,         color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  awaiting_approval:  { label: 'На рассмотрении',    icon: Clock,         color: 'text-blue-600 bg-blue-50 border-blue-200' },
  active:             { label: 'Активна',             icon: CheckCircle2,  color: 'text-green-600 bg-green-50 border-green-200' },
  completed:          { label: 'Выполнена',           icon: CheckCircle2,  color: 'text-green-700 bg-green-50 border-green-200' },
  rejected:           { label: 'Отклонена',           icon: XCircle,       color: 'text-red-600 bg-red-50 border-red-200' },
};

function RequestCard({ req }: { req: TaskRequest }) {
  const s = STATUS_LABELS[req.status] ?? { label: req.status, icon: Clock, color: 'text-muted-foreground bg-muted border-border' };
  const Icon = s.icon;
  const pct = req.completions_total > 0
    ? Math.round((req.completions_done / req.completions_total) * 100)
    : 0;

  return (
    <div className="rounded-2xl border bg-white shadow-sm p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold truncate">{req.channel_link}</p>
        <span className={`text-xs font-medium px-2 py-1 rounded-full border shrink-0 flex items-center gap-1 ${s.color}`}>
          <Icon className="w-3 h-3" />
          {s.label}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Выполнено: {req.completions_done} / {req.completions_total}</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        💰 {req.price_per_completion} Stars за подписчика
      </p>
    </div>
  );
}

export default function Requests() {
  const { userId } = useAuth();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['requests', userId],
    queryFn: () => api.getRequests(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/2" />
        {[1, 2].map(i => <div key={i} className="h-32 bg-muted rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Мои заявки</h1>
        <p className="text-sm text-muted-foreground">Статус ваших каналов в системе.</p>
      </div>

      {(!requests || requests.length === 0) ? (
        <div className="text-center p-8 rounded-2xl border border-dashed">
          <Loader2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-semibold">Нет заявок</p>
          <p className="text-sm text-muted-foreground mt-1">Добавьте канал для продвижения!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(req => <RequestCard key={req.id} req={req} />)}
        </div>
      )}
    </div>
  );
}
