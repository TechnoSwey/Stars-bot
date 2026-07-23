import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="text-center p-8">
      <p className="text-4xl font-bold text-muted-foreground">404</p>
      <p className="mt-2 text-muted-foreground">Страница не найдена</p>
      <Link href="/" className="mt-4 inline-block text-blue-600 underline">На главную</Link>
    </div>
  );
}
