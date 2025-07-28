type HeadingProps = {
    heading: string;
    subtitle?: string;
    spacing?: string;
    sm?: boolean;
    className?: string;
}

export default function Heading({ 
    heading, 
    subtitle,
    spacing = "1",
    sm,
    className,
 }: HeadingProps) {
    return (
        <div className={`text-gray-800 md:leading-6 space-y-1 md:space-y-${spacing} ${className}`}>
            <h2 className={`${sm ? 'text-sm md:text-base' : 'text-xl md:text-[23px]'} font-bold`}>{heading}</h2>
            <p className={`text-xs md:text-sm font-normal`}>{subtitle}</p>
          </div>
    )
}