type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};

export function Textarea({ label, className = "", id, ...props }: TextareaProps) {
  const inputId = id ?? label;
  return (
    <label htmlFor={inputId} className="block">
      <span className="mb-2 block text-sm text-muted">{label}</span>
      <textarea
        id={inputId}
        className={`min-h-[120px] w-full resize-y border border-border bg-card px-4 py-3 text-foreground outline-none transition placeholder:text-foreground/35 focus:border-accent ${className}`}
        {...props}
      />
    </label>
  );
}
