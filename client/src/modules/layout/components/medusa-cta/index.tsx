import Image from "next/image"

const MedusaCTA = () => {
  return (
    <div className="bg-blue-gf flex justify-center p-3 flex">
      <div className="text-[#C7C7C7] font-[300] text-[14px]">
        Ver nuestros comentarios en
        <a
          href="https://es.trustpilot.com/review/gudfy.com"
          target="_blank"
          rel="noreferrer"
        >
          <Image
            src="/image_coins/trust_pilot_icon.webp"
            alt="You can see our comments on trustpilot"
            width={180}
            height={180}
            className=" transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
          />
        </a>
      </div>
      <div></div>
      <div></div>
    </div>
  )
}

export default MedusaCTA
