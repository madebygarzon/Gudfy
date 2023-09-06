import React from "react"
import Image from "next/image"

const SocialButtons = () => {
  return (
    <div className="flex gap-4 pt-2">
      <a
        href="http://localhost:9000/store/auth/facebook" // deberia de ser una variable de entorno
        type="button"
        className="text-white  bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-[5px] text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2 w-32 justify-center"
      >
        <svg
          className="mr-2 -ml-1 w-4 h-4"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="facebook-f"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
        >
          <path
            fill="currentColor"
            d="M279.1 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.4 0 225.4 0c-73.22 0-121.1 44.38-121.1 124.7v70.62H22.89V288h81.39v224h100.2V288z"
          ></path>
        </svg>
        Facebook
      </a>
      <a
        type="button"
        href="http://localhost:9000/store/auth/google" // deberia de ser una variable de entorno
        className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[5px] text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2 w-32 justify-center"
      >
        <svg
          className="mr-2 -ml-1 w-4 h-4"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="google"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
        >
          <path
            fill="currentColor"
            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
          ></path>
        </svg>
        Google
      </a>
      <a
        type="button"
        href="http://localhost:9000/store/auth/google" // deberia de ser una variable de entorno
        className="text-white bg-[#402e72] hover:bg-blue-gf focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[5px] text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2 w-32 justify-center"
      >
        <Image
          className="ml-auto mr-auto"
          alt="gudfy"
          src="/footer/gudfy_logo_2.svg"
          width={251.76}
          height={81.63}
        />
      </a>
    </div>
  )
}

export default SocialButtons
