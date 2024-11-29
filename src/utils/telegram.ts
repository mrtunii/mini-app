declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
        };
        ready(): void;
        expand(): void;
        close(): void;
      };
      TelegramGameProxy?: {
        receiveEvent: (eventName: string, eventData?: string) => void;
      };
    };
    TelegramGameProxy?: {
      receiveEvent: (eventName: string, eventData?: string) => void;
    };
  }
}

export const isTelegramWebApp = (): boolean => {
  return Boolean(window.Telegram?.WebApp);
};

export const getTelegramInitData = (): string => {
  return window.Telegram?.WebApp?.initData || '';
};

export const initTelegramWebApp = (): void => {
  if (isTelegramWebApp()) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }

  // Initialize TelegramGameProxy if it doesn't exist
  if (!window.TelegramGameProxy) {
    window.TelegramGameProxy = {
      receiveEvent: (eventName: string, eventData?: string) => {
        console.log('Game event:', eventName, eventData);
        // Handle game events here
      }
    };
  }
};

// Helper function to send game events
export const sendGameEvent = (eventName: string, eventData?: string): void => {
  if (window.TelegramGameProxy?.receiveEvent) {
    window.TelegramGameProxy.receiveEvent(eventName, eventData);
  } else if (window.Telegram?.TelegramGameProxy?.receiveEvent) {
    window.Telegram.TelegramGameProxy.receiveEvent(eventName, eventData);
  }
};