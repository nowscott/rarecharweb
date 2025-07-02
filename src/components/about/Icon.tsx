import { iconPaths } from '@/lib/about/aboutConfig';

// 图标组件
interface IconProps {
  name: keyof typeof iconPaths;
  className?: string;
}

export function Icon({ name, className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPaths[name]} />
    </svg>
  );
}