import React, { useEffect, useState } from "react"
import axios from "axios"

type props = {
  id: string
}
type dataStars = {
  dataStars: Array<{ rating: number; cantidad: number }>
  media: number
  total: number
}

const StarsReview: React.FC<props> = ({ id }) => {
  const [dataStars, setDataStars] = useState<dataStars>()

  const data = { id }
  useEffect(() => {
    axios
      .get(`http://localhost:9000/store/products/${id}/stars/`, {
        params: data,
      })
      .then((e) => {
        console.log(e)
        setDataStars(e.data)
      })
      .catch((e) => {
        console.log("no se logro", e)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      {dataStars ? (
        <div className="flex">
          <div>
            <samp className="text-[28px]">{dataStars.media}</samp>
          </div>
          <div></div>
        </div>
      ) : (
        ""
      )}
    </div>
  )
}

export default StarsReview
