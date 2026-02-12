'use client';


type CardProps = {
  children: React.ReactNode;
  height?: string;
  fitWidth?: boolean;
  className?: string;
};

export default function CardComponent({ 
    children,
    height = "fit-content",
    fitWidth = false,
    className = "",
}: CardProps) {
  return (
    <div className={`rounded-lg bg-white px-3 md:px-6 py-[35px] shadow-md border border-gray-200 ${className}`} style={{height: height, width: fitWidth ? 'w-fit' : 'w-full'}}>
        { children }
    </div>
  );
}