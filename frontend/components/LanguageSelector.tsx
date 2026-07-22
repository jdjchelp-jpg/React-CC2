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
          <SelectItem value="de">{t('languages.de')}</SelectItem>
          <SelectItem value="it">{t('languages.it')}</SelectItem>
          <SelectItem value="pt">{t('languages.pt')}</SelectItem>
          <SelectItem value="ja">{t('languages.ja')}</SelectItem>
          <SelectItem value="zh">{t('languages.zh')}</SelectItem>
          <SelectItem value="ko">{t('languages.ko')}</SelectItem>
          <SelectItem value="ru">{t('languages.ru')}</SelectItem>
          <SelectItem value="hi">{t('languages.hi')}</SelectItem>
          <SelectItem value="ar">{t('languages.ar')}</SelectItem>
          <SelectItem value="tr">{t('languages.tr')}</SelectItem>
          <SelectItem value="pl">{t('languages.pl')}</SelectItem>
          <SelectItem value="sv">{t('languages.sv')}</SelectItem>
          <SelectItem value="no">{t('languages.no')}</SelectItem>
          <SelectItem value="da">{t('languages.da')}</SelectItem>
          <SelectItem value="fi">{t('languages.fi')}</SelectItem>
          <SelectItem value="uk">{t('languages.uk')}</SelectItem>
          <SelectItem value="vi">{t('languages.vi')}</SelectItem>
          <SelectItem value="th">{t('languages.th')}</SelectItem>
          <SelectItem value="el">{t('languages.el')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
