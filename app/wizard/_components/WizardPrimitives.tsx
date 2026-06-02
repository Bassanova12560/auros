"use client";

type RadioRowProps = {
  step: number;
  title: string;
  subtitle: string;
  selected: boolean;
  onSelect: () => void;
};

export function WizardRadioRow({
  step,
  title,
  subtitle,
  selected,
  onSelect,
}: RadioRowProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      role="radio"
      aria-checked={selected}
      data-wizard-step={step}
      data-row=""
      className={
        selected ? "wizard-choice-row wizard-choice-row-active" : "wizard-choice-row"
      }
    >
      <span
        aria-hidden
        className={`h-3.5 w-3.5 shrink-0 rounded-full border transition ${
          selected ? "border-accent bg-accent" : "border-white bg-transparent"
        }`}
      />
      <span className="flex min-w-0 flex-col gap-1">
        <span className="font-mono text-sm tracking-wide text-white">{title}</span>
        <span className="font-mono text-xs leading-relaxed text-white/45">
          {subtitle}
        </span>
      </span>
    </button>
  );
}

export function WizardDocumentRow({
  label,
  checked,
  onToggle,
  muted,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
  muted?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      data-wizard-step={5}
      data-row=""
      aria-pressed={checked}
      className={
        checked ? "wizard-choice-row wizard-choice-row-active" : "wizard-choice-row"
      }
    >
      <span
        aria-hidden
        className={
          checked ? "wizard-checkbox wizard-checkbox-active" : "wizard-checkbox"
        }
      >
        {checked ? (
          <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path
              d="M2 6.2 4.8 9 10 3.5"
              stroke="#030303"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </span>
      <span
        className={`font-mono text-sm tracking-wide ${muted && !checked ? "text-white/70" : "text-white"}`}
      >
        {label}
      </span>
    </button>
  );
}

export function WizardObjectiveCard({
  title,
  subtitle,
  selected,
  onClick,
}: {
  title: string;
  subtitle: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-wizard-step={6}
      data-card=""
      aria-pressed={selected}
      className={
        selected
          ? "wizard-objective-card wizard-objective-card-active"
          : "wizard-objective-card"
      }
    >
      <span className="font-mono text-sm tracking-wide text-white">{title}</span>
      <span className="font-mono text-xs leading-relaxed text-white/45">
        {subtitle}
      </span>
    </button>
  );
}

export function WizardSummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="wizard-summary-row">
      <span className="shrink-0 pt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
        {label}
      </span>
      <span className="text-right font-mono text-sm leading-relaxed tracking-wide text-white">
        {value}
      </span>
    </div>
  );
}
