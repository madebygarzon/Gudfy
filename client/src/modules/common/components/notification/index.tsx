import React from "react"

// Definición del tipo de las props, el número es opcional
interface NotificationProps {
  count?: number
}

const Notification: React.FC<NotificationProps> = ({ count }) => {
  return (
    <div className="absolute  inline-block -top-2 -right-2">
      <div className="w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full">
        {count == undefined ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-3 h-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        ) : (
          <span className="text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {count}
          </span>
        )}
      </div>
    </div>
  )
}

export default Notification
