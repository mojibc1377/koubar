export function AdminField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-[#fffbf5]/70">{label}</span>
      {children}
    </label>
  );
}

export function AdminInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & { label?: string },
) {
  const { label, className = "", ...rest } = props;
  const field = (
    <input
      className={`w-full rounded-xl border border-[#fffbf52e] bg-[#343434] px-4 py-2.5 text-sm text-[#fffbf5] outline-none focus:border-[#575b49] ${className}`}
      {...rest}
    />
  );
  if (!label) return field;
  return <AdminField label={label}>{field}</AdminField>;
}

export function AdminTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string },
) {
  const { label, className = "", ...rest } = props;
  const field = (
    <textarea
      className={`min-h-[100px] w-full rounded-xl border border-[#fffbf52e] bg-[#343434] px-4 py-2.5 text-sm text-[#fffbf5] outline-none focus:border-[#575b49] ${className}`}
      {...rest}
    />
  );
  if (!label) return field;
  return <AdminField label={label}>{field}</AdminField>;
}

export function AdminSelect(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string },
) {
  const { label, className = "", children, ...rest } = props;
  return (
    <AdminField label={label}>
      <select
        className={`w-full rounded-xl border border-[#fffbf52e] bg-[#343434] px-4 py-2.5 text-sm text-[#fffbf5] outline-none focus:border-[#575b49] ${className}`}
        {...rest}
      >
        {children}
      </select>
    </AdminField>
  );
}
