import WebApp from '@twa-dev/sdk';

export function useTelegram() {
  const tg = WebApp;

  const initData = tg.initData;
  const user = tg.initDataUnsafe?.user;

  const close = () => tg.close();
  const expand = () => tg.expand();

  return { tg, initData, user, close, expand };
}
