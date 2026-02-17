import * as React from "react";
import { type LucideProps } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import dynamic from "next/dynamic";

const iconCache = new Map<string, React.ComponentType<LucideProps>>();

const loadIcon = (name: string) => {
  if (iconCache.has(name)) return iconCache.get(name)!;

  const Icon = dynamic(dynamicIconImports[name as keyof typeof dynamicIconImports] as any, {
    ssr: true,
    loading: () => <div className="size-5 animate-pulse bg-muted rounded" />,
  });

  iconCache.set(name, Icon);
  return Icon;
};

export interface IconProps extends Omit<LucideProps, "ref"> {
  name: keyof typeof dynamicIconImports;
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(({ name, className = "", size = 20, strokeWidth = 2, ...props }, ref) => {
  const LucideIcon = loadIcon(name);

  return (
    <LucideIcon
      ref={ref}
      size={size}
      strokeWidth={strokeWidth}
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
});

Icon.displayName = "Icon";