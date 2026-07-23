import { useAuth } from '@/context/auth-context';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Star, Trophy, ArrowUpRight } from 'lucide-react';
import { Link } from 'wouter';

export default function Home() {
  const { userId } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => api.getProfile(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-40 bg-muted rounded-3xl" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 bg-muted rounded-2xl" />
          <div className="h-32 bg-muted rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-8">
      {/* Приветствие */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Привет, {profile.first_name}! 👋</h1>
          <p className="text-sm text-muted-foreground">Добро пожаловать в ErneStars</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
          {profile.first_name.charAt(0)}
        </div>
      </div>

      {/* Баланс */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-500 text-white p-8 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Star className="w-32 h-32" />
        </div>
        <p className="text-blue-100 font-medium mb-2">Доступный баланс</p>
        <div className="flex items-end gap-2">
          <span className="text-5xl font-extrabold">{profile.stars.toFixed(2)}</span>
          <span className="text-xl mb-1 text-blue-100">Stars</span>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-blue-50 p-5 flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Trophy className="w-6 h-6" />
          </div>
          <p className="text-2xl font-bold">{profile.completed_tasks_count}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Заданий выполнено</p>
        </div>
        <div className="rounded-2xl border bg-blue-50 p-5 flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Star className="w-6 h-6" />
          </div>
          <p className="text-2xl font-bold">{profile.total_earned.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Всего заработано</p>
        </div>
      </div>

      {/* Быстрые действия */}
      <div>
        <h2 className="text-lg font-bold mb-4">Быстрые действия</h2>
        <div className="space-y-3">
          <Link href="/tasks">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white border shadow-sm hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Заработать Stars</p>
                  <p className="text-xs text-muted-foreground">Выполнять задания за награды</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
          <Link href="/submit">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white border shadow-sm hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Продвинуть канал</p>
                  <p className="text-xs text-muted-foreground">Получить реальных подписчиков</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
