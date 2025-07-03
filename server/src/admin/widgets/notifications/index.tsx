import type { WidgetConfig } from "@medusajs/admin";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { XMark, ArrowLongRight, ArrowLongLeft, Eye } from "@medusajs/icons";
import Spinner from "../../components/shared/spinner";
import {
  Table,
  Input,
  Select,
  Label,
  FocusModal,
  Button,
  Text,
  Heading,
  IconButton,
  Drawer,
  Tooltip,
} from "@medusajs/ui";
import { formatDate } from "../../utils/format-date";
import { getListStoreOrder } from "../../actions/orders/get-list-store-orders";
import OrderCancel from "../../components/orders/order-cancel";
import OrderDetail from "../../components/orders/order-detail";
import { BACKEND } from "../../actions";
import { getNotification } from "../../actions/notification/get-notification";
import clsx from "clsx";

type notification = {
    NotifiReqProd: boolean,
    NotifiSellerApplication: boolean,
    NotifiClaim: boolean,
    NotifiTicket: boolean,
    NotifiStore: boolean,
};


const Notifications = () => {
  const navigate = useNavigate();
  const [notificationData, setNotificationData] = useState<notification | null>(null);

  const handleButtonClick = (key: string) => {
    switch (key) {
      case 'NotifiReqProd':
        navigate('/a/products?offset=0&limit=15');
        break;
      case 'NotifiSellerApplication':
        navigate('/a/customers?offset=0&limit=15');
        break;
      case 'NotifiClaim':
        navigate('/a/reclamos');
        break;
      case 'NotifiTicket':
        navigate('/a/tickets');
        break;
      case 'NotifiStore':
        navigate('/a/wallet');
        break;
      default:
        break;
    }
  };

  const handlerGetNotification = async () => {
    const dataNotification = await getNotification();
    if (dataNotification) setNotificationData(dataNotification);
  };

  useEffect(() => {
    handlerGetNotification();
  }, []);

  const buttons = [
    {
      key: "NotifiReqProd",
      label: "Solic. Producto",
      icon: "📦",
    },
    {
      key: "NotifiSellerApplication",
      label: "Nuevos Vendedores",
      icon: "🛍️",
    },
    {
      key: "NotifiClaim",
      label: "Reclamos",
      icon: "⚠️",
    },
    {
      key: "NotifiTicket",
      label: "Tickets",
      icon: "🎫",
    },
    {
      key: "NotifiStore",
      label: "Pagos a Wallet",
      icon: "💰",
    },
  ] as const;

  return (
    <div className="bg-white p-8 border border-gray-200 rounded-lg">
      <div className="flex gap-4">
        {buttons.map((btn) => {
          const isActive = notificationData ? notificationData[btn.key as keyof notification] : false;
          const buttonEl = (
            <div className="relative">
              <Button
                variant={"secondary"}
                className="w-24 h-24 flex flex-col items-center justify-center relative"
                onClick={() => handleButtonClick(btn.key)}
              >
                <span className="text-2xl" role="img" aria-label={btn.label}>
                  {btn.icon}
                </span>
                <Text className="text-xxs mt-1">{btn.label}</Text>
                {isActive && (
                  <span className="absolute top-1 right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white"></span>
                )}
              </Button>
            </div>
          );

          return isActive ? (
            <Tooltip key={btn.key} content={"Tienes nuevas notificaciones"}>
              {buttonEl}
            </Tooltip>
          ) : (
            <div key={btn.key}>{buttonEl}</div>
          );
        })}
      </div>
    </div>
  );
};


export default Notifications;

export const config: WidgetConfig = {
    zone: "order.list.before",
  };
// 