import Image from "next/image"

type EmailProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    name: string
    placeholder?: string;
}

export default function EmailInput({
    value,
    onChange,
    label,
    name,
    placeholder,
}: EmailProps) {
    return (
        <div className="space-y-2 relative">
            <label className="text-xs uppercase font-medium text-gray-900 block">{label}</label>
            <input 
            type="email" 
            value={value}
            onChange={onChange}
            name={name}
            placeholder={placeholder}
            className="h-12 w-full outline-none border border-gray-300 focus:border-[var(--primary-light)] rounded-[6px] p-4 text-sm"
            />
            <Image
            src={"/icons/email.svg"}
            alt="Email Icon"
            height={18}
            width={18}
            className="absolute right-4 top-[50%]"
            />
        </div>
    )
}