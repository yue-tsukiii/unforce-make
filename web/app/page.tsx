import { I18nProvider } from "@/lib/i18n";
import { Landing } from "./components/Landing";

export default function Page() {
  return (
    <I18nProvider>
      <Landing />
    </I18nProvider>
  );
}
