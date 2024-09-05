import React, { useEffect, useState } from "react"

interface Notification {
  id: string
  message: string
}

const NotificationGudfy: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:9000/events")

    eventSource.addEventListener("notification.retrieved", (event) => {
      const newNotification: Notification = JSON.parse(event.data)
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        newNotification,
      ])
    })

    // Limpiar el EventSource cuando el componente se desmonta
    return () => {
      eventSource.close()
    }
  }, [])

  return (
    <div>
      <h2>Notificaciones:</h2>
      {notifications.length === 0 ? (
        <p>No hay nuevas notificaciones.</p>
      ) : (
        notifications.map((notification) => (
          <div key={notification.id}>
            <p>{notification.message}</p>
          </div>
        ))
      )}
    </div>
  )
}

export default NotificationGudfy
