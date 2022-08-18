import { useSearchParams } from 'react-router-dom';
import { ApiLang } from '../types/api';

export const langs: ApiLang[] = ['en', 'es', 'de', 'fr', 'zh'];
export const flags = ['🇺🇸', '🇪🇸', '🇩🇪', '🇫🇷', '🇨🇳'];

export const useLang = (): ApiLang => {
  const [searchParams] = useSearchParams();
  return (searchParams.get('lang') ?? 'en') as ApiLang;
};
