"use client"

import React from "react"
import { Progress } from "@nextui-org/react"

export const TaskProgressIndicatorCart = () => {
  return (
    <Progress
      size="lg"
      aria-label="Loading..."
      value={10}
      className="max-w-md"
    />
  )
}

export const TaskProgressIndicatorCheckout = () => {
  return (
    <Progress
      size="lg"
      aria-label="Loading..."
      value={50}
      className="md:max-w-md max-w-sm"
    />
  )
}

export const TaskProgressIndicatorOrder = () => {
  return (
    <Progress
      size="lg"
      aria-label="Loading..."
      value={100}
      className="max-w-md"
    />
  )
}
