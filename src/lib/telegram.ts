/**
 * Хелперы для Telegram Mini App WebApp API.
 */

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
        };
        openLink: (url: string) => void;
        openTelegramLink: (url: string) => void;
        BackButton: {
          show: () => void;
          hide: () => void;
          onClick: (fn: () => void) => void;
        };
        MainButton: {
          show: () => void;
          hide: () => void;
          setText: (text: string) => void;
          onClick: (fn: () => void) => void;
        };
        colorScheme: 'light' | 'dark';
        themeParams: Record<string, string>;
      };
    };
  }
}

export function initTelegram(): void {
  window.Telegram?.WebApp?.ready();
  window.Telegram?.WebApp?.expand();
}

export function getTelegramUser() {
  const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
  if (user) {
    return {
      id: user.id,
      first_name: user.first_name,
      username: user.username,
    };
  }
  // Для локальной разработки (без Telegram)
  return { id: 0, first_name: 'Dev User', username: undefined };
}

export function openLink(url: string): void {
  if (window.Telegram?.WebApp?.openLink) {
    window.Telegram.WebApp.openLink(url);
  } else {
    window.open(url, '_blank');
  }
}
