import React, { useEffect, useState } from "react"
import axios from "axios"
import ProgressStars from "./progress-stars"

type props = {
  id: string
  review: Array<object>
}
type dataStars = {
  dataStars: Array<{ rating: number; cantidad: string }>
  media: number
  total: number
}

const StarsReview: React.FC<props> = ({ id, review }) => {
  const [dataStars, setDataStars] = useState<dataStars>()

  const data = { id }
  useEffect(() => {
    axios
      .get(`http://localhost:9000/store/products/${id}/stars/`, {
        params: data,
      })
      .then((e) => {
        setDataStars(e.data)
        console.log(e.data)
      })
      .catch((e) => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [review])

  return (
    <div>
      {dataStars ? (
        <div className="flex px-5 justify-center">
          <div className="flex flex-col w-[500] items-center">
            <samp className="text-[48px] text-center font-black w-full mt-">
              {!dataStars.media ? "0" : dataStars.media.toFixed(1)}
            </samp>
            <div className="flex ">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`text-2xl px-[1px] ${
                    star <= dataStars.media
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <span>{`Basado en ${dataStars.total} reseñas.`}</span>
          </div>

          <div className="mx-5 w-[70%] max-w-[600px]">
            <ProgressStars
              stars={dataStars.dataStars}
              total={dataStars.total}
            />
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  )
}

export default StarsReview
