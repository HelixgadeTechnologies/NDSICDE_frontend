type TextareaProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label?: string;
  name: string;
  placeholder?: string;
};

export default function TextareaInput({
  value,
  onChange,
  label,
  name,
  placeholder,
}: TextareaProps) {
  return (
    <div className="space-y-2 relative">
      <label className="text-sm capitalize font-medium text-gray-900 block">
        {label}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        rows={4}
        className="w-full outline-none border border-gray-300 focus:border-(--primary-light) rounded-md p-4 text-sm resize-none"
      />
    </div>
  );
}
