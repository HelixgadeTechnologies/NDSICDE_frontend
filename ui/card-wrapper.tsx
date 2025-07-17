'use client';


type CardProps = {
  children: React.ReactNode;
  height?: string;
};

export default function CardComponent({ 
    children,
    height = "fit-content"
}: CardProps) {
  return (
    <div className="w-full rounded-lg bg-white px-3 md:px-6 py-[35px] shadow-md border border-gray-200" style={{height: height}}>
        { children }
    </div>
  );
}