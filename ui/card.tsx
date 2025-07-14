'use client';


type CardProps = {
  children: React.ReactNode;
};

export default function CardComponent({ 
    children,
}: CardProps) {
  return (
    <div className="h-fit w-full rounded-lg bg-white px-3 md:px-6 py-[35px] shadow-md border border-gray-200">
        { children }
    </div>
  );
}