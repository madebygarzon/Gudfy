import { Button } from "@nextui-org/react"
import React from "react"
import { FaDownload } from "react-icons/fa6"

interface DownloadButtonProps {
  data: string[]
  filename?: string
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  data,
  filename = "file.txt",
}) => {
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
