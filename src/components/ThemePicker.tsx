import {
  DropdownMenu as Dropdown,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/src/components/ui/Dropdown';
import { Button } from '@/src/components/ui/Button';
import { useEffect, useState } from 'react';
import { HiComputerDesktop, HiMoon, HiSun } from 'react-icons/hi2';
import { IconType } from 'react-icons/lib';

type Theme = 'dark' | 'light' | 'system';
type ThemeOption = {
  value: Theme;
  label: string;
  icon: IconType;
};
const themes: ThemeOption[] = [
  {
    value: 'dark',
    label: 'Dark',
    icon: HiMoon,
  },
  {
    value: 'light',
    label: 'Light',
    icon: HiSun,
  },
  {
    value: 'system',
    label: 'System',
    icon: HiComputerDesktop,
  },
];

const ThemePicker = () => {
  const [theme, setTheme] = useState('dark');

  // Initial mode
  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    switch (theme) {
      case 'dark':
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
        break;
      case 'light':
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
        break;
      case 'system':
        if (window.matchMedia('(prefers-color-scheme: dark)').matches)
          document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        localStorage.removeItem('theme');
        break;
    }
  }, [theme]);

  return (
    <Dropdown>
      <DropdownMenuTrigger asChild>
        <Button>
          <HiMoon className="hidden h-10 w-10 dark:block" />
          <HiSun className="h-10 w-10 dark:hidden" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          {themes.map((theme) => (
            <DropdownMenuRadioItem
              key={theme.value}
              value={theme.value}
              className="flex flex-row gap-x-2 hover:cursor-pointer"
            >
              <theme.icon className="h-6 w-6" />
              {theme.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </Dropdown>
  );
};

export default ThemePicker;