import { resolveCatalogLocale, type CatalogMap, type Locale } from "@/lib/i18n";

export type WizardShellMessages = {
  title: string;
  back: string;
  next: string;
  stepRequired: string;
  saved: string;
  autosave: string;
  phaseOf: string;
};

const FR: WizardShellMessages = {
  title: "Tokenisation · Wizard",
  back: "← Retour",
  next: "Suivant →",
  stepRequired: "Complétez les champs requis pour continuer.",
  saved: "Enregistré",
  autosave: "Sauvegarde auto",
  phaseOf: "Phase",
};

const EN: WizardShellMessages = {
  title: "Tokenization · Wizard",
  back: "← Back",
  next: "Next →",
  stepRequired: "Complete the required fields to continue.",
  saved: "Saved",
  autosave: "Auto-save",
  phaseOf: "Phase",
};

const ES: WizardShellMessages = {
  title: "Tokenización · Wizard",
  back: "← Atrás",
  next: "Siguiente →",
  stepRequired: "Complete los campos obligatorios para continuar.",
  saved: "Guardado",
  autosave: "Autoguardado",
  phaseOf: "Fase",
};

const CATALOG: CatalogMap< WizardShellMessages> = { fr: FR, en: EN, es: ES };

export function getWizardShellMessages(locale: Locale): WizardShellMessages {
  return CATALOG[resolveCatalogLocale(locale)] ?? FR;
}
