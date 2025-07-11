import Image from "next/image"

export default function Logo() {
    return (
        <div className="flex items-center gap-1.5">
            <div className="w-6 h-6">
                <Image
                src={"/images/NDSICDE-logo-small.svg"}
                alt="NDSICDE logo"
                height={26}
                width={26}
                style={{ width: "auto", height: "auto"}}
                priority
                />
            </div>
            <p  className="leading-6 space-x-1">
                <span>Powered by</span>
                <span className="font-bold">NDSICDE.</span>
            </p>
        </div>
    )
}