import { Link, useLocation } from 'wouter';
import { Star, ListTodo, PlusCircle, FileText } from 'lucide-react';

const NAV = [
  { href: '/',         label: 'Главная',  icon: Star },
  { href: '/tasks',    label: 'Задания',  icon: ListTodo },
  { href: '/submit',   label: 'Добавить', icon: PlusCircle },
  { href: '/requests', label: 'Заявки',   icon: FileText },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <main className="flex-1 px-4 py-6 pb-24 max-w-lg mx-auto w-full">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex max-w-lg mx-auto">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = location === href;
            return (
              <Link key={href} href={href} className="flex-1">
                <button
                  className={`w-full py-3 flex flex-col items-center gap-0.5 text-xs transition-colors
                    ${active ? 'text-blue-600' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : ''}`} />
                  <span className={active ? 'font-semibold' : ''}>{label}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
