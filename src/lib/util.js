/**
 * Une clases condicionalmente, útil con Tailwind CSS.
 * Ej: cn("p-2", isActive && "bg-blue-500")
 */
export function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}
