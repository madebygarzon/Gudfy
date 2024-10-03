export function hasPassed48Hours(createdAt?: string): boolean {
  if (!createdAt) return false

  const createdDate = new Date(createdAt)
  const currentTime = new Date()

  const differenceInMilliseconds = currentTime.getTime() - createdDate.getTime()

  const hoursDifference = differenceInMilliseconds / (1000 * 60 * 60)

  return hoursDifference > 48
}
