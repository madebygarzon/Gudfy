import React from "react"

const ComoComprar = () => {
  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden pb-[56.25%]">
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/https://www.youtube.com/watch?v=Q1Nzjric_ls`}
          title="YouTube Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  )
}

export default ComoComprar
