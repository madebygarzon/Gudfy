import { Button } from "@nextui-org/react"
import React from "react"
import { FaDownload } from "react-icons/fa6"

interface DownloadButtonProps {
  type?: "button" | "icon"
  data: string[]
  filename?: string
}

const DownloadButton = ({
  type = "icon",
  data,
  filename = "file.txt",
}: DownloadButtonProps) => {
  const handleDownload = () => {
    const fileContent = data.join("\n")
    const blob = new Blob([fileContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename

    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (type == "icon") {
    return (
      <Button
        onPress={handleDownload}
        className="p-0 bg-transparent text-white rounde "
      >
        <FaDownload size={20} color="#9b48ed" />
      </Button>
    )
  } else if (type == "button") {
    return (
      <Button
        onPress={handleDownload}
        className="p-0  text-white rounde  text-xs flex"
      >
        Descargar {data.length} Codigos <FaDownload size={15} color="#9b48ed" />
      </Button>
    )
  }
  return (
    <Button
      onPress={handleDownload}
      className="p-0 bg-transparent text-white rounde "
    >
      <FaDownload size={25} color="#9b48ed" />
    </Button>
  )
}

export default DownloadButton
