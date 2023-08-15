import UnderlineLink from "@modules/common/components/underline-link"
import Image from "next/image"

const Hero = () => {
  return (
    <div className="h-[80vh] w-full relative">
      <div className="text-white absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:text-left small:justify-end small:items-start small:p-32">
        <h1 className="text-2xl-semi mb-4 drop-shadow-md shadow-black">
          Tus Gifcards favoritas en un solo lugar
        </h1>
        <p className="text-base-regular max-w-[32rem] mb-6 drop-shadow-md shadow-black">
          Somos la market place más confiable y segura. 
        </p>
        <UnderlineLink href="/store">Explorar productos</UnderlineLink>
      </div>
      <Image
        src="/fondo_banner_gudfy.webp"
        loading="eager"
        priority={true}
        quality={90}
        alt="fondo_banner_gudfy_home"
        className="absolute inset-0"
        draggable="false"
        fill
        sizes="100vw"
        style={{
          objectFit: "cover",
        }}
      />
    </div>
  )
}

export default Hero
