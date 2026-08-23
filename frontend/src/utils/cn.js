// Small classnames helper so components can conditionally join Tailwind classes
// without pulling in an extra dependency.
export function cn(...args) {
  return args.filter(Boolean).join(" ");
}
