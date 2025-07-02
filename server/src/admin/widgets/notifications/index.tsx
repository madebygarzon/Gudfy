import type { WidgetConfig } from "@medusajs/admin";
import React, { useState, useEffect } from "react";
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
  const [notificationData, setNotificationData] = useState<notification | null>(null);

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
      label: "Vendedores",
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
      label: "Stores",
      icon: "🛒",
    },
  ] as const;

  return (
    <div className="bg-white p-8 border border-gray-200 rounded-lg">
      <div className="flex gap-4">
        {buttons.map((btn) => {
          const isActive = notificationData ? notificationData[btn.key as keyof notification] : false;
          const buttonEl = (
            <Button
                variant={"secondary"}
              className={clsx("w-24 h-24 flex flex-col items-center justify-center", {
                "bg-blue-600 hover:bg-blue-700 text-white": isActive,
              })}
            >
              <span className="text-2xl" role="img" aria-label={btn.label}>
                {btn.icon}
              </span>
              <Text className="text-xxs mt-1">{btn.label}</Text>
            </Button>
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