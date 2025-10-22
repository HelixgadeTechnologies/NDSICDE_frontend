'use client';


type CardProps = {
  children: React.ReactNode;
  height?: string;
  fitWidth?: boolean;
};

export default function CardComponent({ 
    children,
    height = "fit-content",
    fitWidth = false,
}: CardProps) {
  return (
    <div className="rounded-lg bg-white px-3 md:px-6 py-[35px] shadow-md border border-gray-200" style={{height: height, width: fitWidth ? 'w-fit' : 'w-full'}}>
        { children }
    </div>
  );
}