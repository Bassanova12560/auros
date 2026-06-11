"use client";

type CompareSelectCheckboxProps = {
  checked: boolean;
  label: string;
  onToggle: () => void;
};

export function CompareSelectCheckbox({
  checked,
  label,
  onToggle,
}: CompareSelectCheckboxProps) {
  return (
    <label
      className="inline-flex cursor-pointer items-center"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        aria-label={label}
        className="h-4 w-4 rounded border-white/20 bg-white/[0.04] text-white accent-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
      />
    </label>
  );
}
