interface PokeballIconProps {
  size?: number;
}

export function PokeballIcon({ size = 24 }: PokeballIconProps) {
  return (
    <span
      aria-hidden="true"
      className="relative inline-flex overflow-hidden rounded-full border-2 border-gray-900"
      style={{ width: size, height: size }}
    >
      <span className="absolute inset-x-0 top-0 h-1/2 bg-red-500" />
      <span className="absolute inset-x-0 bottom-0 h-1/2 bg-white" />
      <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-gray-900" />
      <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-900 bg-white">
        <span className="absolute inset-0.5 rounded-full bg-gray-200" />
      </span>
    </span>
  );
}
