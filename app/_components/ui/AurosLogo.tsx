type AurosLogoProps = {
  size?: number;
};

export function AurosLogo({ size = 22 }: AurosLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="0.75"
        y="0.75"
        width="20.5"
        height="20.5"
        stroke="#ffffff"
        strokeWidth="1.5"
        fill="none"
      />
      <rect x="15" y="0" width="7" height="7" fill="#ff2d2d" />
    </svg>
  );
}
