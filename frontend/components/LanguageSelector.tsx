import { Languages } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

export default function LanguageSelector() {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2" htmlFor="language-select">
        <Languages className="w-4 h-4" />
        {t('settings.language')}
      </Label>
      <Select value={i18n.language} onValueChange={handleLanguageChange}>
        <SelectTrigger id="language-select" aria-label={t('settings.language')}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">{t('languages.en')}</SelectItem>
          <SelectItem value="es">{t('languages.es')}</SelectItem>
          <SelectItem value="fr">{t('languages.fr')}</SelectItem>
          <SelectItem value="nl">{t('languages.nl')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
