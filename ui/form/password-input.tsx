"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

type PasswordProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    name: string
    placeholder?: string;
}

export default function PasswordInput ({
    value,
    onChange,
    label,
    name,
    placeholder,
}: PasswordProps) {
    const [isHidden, setIsHidden] = useState(true);

    const handlePasswordVisibility = () => {
        setIsHidden(!isHidden);
    };


    return (
        <div className="space-y-2 relative">
            <label className="text-xs uppercase font-medium text-gray-900 block">{label}</label>
            <input 
            type={isHidden ? "password" : "text"} 
            value={value}
            onChange={onChange}
            name={name}
            placeholder={placeholder}
            className="h-12 w-full outline-none border border-gray-300 focus:border-[var(--primary-light)] rounded-[6px] p-4 text-sm"
            />
            <span onClick={handlePasswordVisibility} className="absolute right-4 top-[50%] hover:cursor-pointer text-gray-500 ">
                {/* {isHidden ? <EyeOffIcon size={18}/> : <EyeIcon size={18}/>} */}
                <Icon icon={isHidden ? "fluent:eye-off-32-regular" :"fluent:eye-32-regular"} width={20} height={20}/>
            </span>
        </div>
    )
}