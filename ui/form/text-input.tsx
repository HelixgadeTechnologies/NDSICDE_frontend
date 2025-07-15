"use client";


type InputProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    name: string
    placeholder?: string;
    isUppercase?: boolean;
    isBigger?: boolean;
}

export default function TextInput ({
    value,
    onChange,
    label,
    name,
    placeholder,
    isUppercase,
    isBigger = false,
}: InputProps) {

    return (
        <div className="space-y-2 relative">
            <label className={`text-xs font-medium text-gray-900 block ${isUppercase && 'uppercase'}`}>{label}</label>
            <input 
            type="text"
            value={value}
            onChange={onChange}
            name={name}
            placeholder={placeholder}
            className={`${isBigger ? 'h-12': 'h-10'} w-full outline-none border border-gray-300 focus:border-[var(--primary-light)] rounded-[6px] p-4 text-sm`}
            />
        </div>
    )
}