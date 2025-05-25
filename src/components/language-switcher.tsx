import { useTranslation } from "react-i18next";

import { cn } from "../utils/cn";

type LanguageSwitcherProps = {
  className?: string;
};

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  return (
    <div className={cn("dropdown dropdown-end", className)}>
      <div
        tabIndex={0}
        role="button"
        className="btn btn-square btn-ghost shadow"
      >
        <span className="i-lucide-globe size-4"></span>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-36 p-2 shadow"
      >
        <li>
          <a
            className="btn btn-ghost h-12"
            onClick={() => i18n.changeLanguage("en")}
          >
            English
          </a>
        </li>
        <li>
          <a
            className="btn btn-ghost h-12"
            onClick={() => i18n.changeLanguage("ja")}
          >
            日本語
          </a>
        </li>
      </ul>
    </div>
  );
}
