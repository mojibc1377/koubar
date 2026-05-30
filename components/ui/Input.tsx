type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, className = "", id, ...props }: InputProps) {
  const inputId = id ?? label;
  return (
    <label htmlFor={inputId} className="block">
      <span className="mb-2 block text-sm text-muted">{label}</span>
      <input
        id={inputId}
        className={`w-full border border-border bg-card px-4 py-3 text-foreground outline-none transition placeholder:text-foreground/35 focus:border-accent ${className}`}
        {...props}
      />
    </label>
  );
}
