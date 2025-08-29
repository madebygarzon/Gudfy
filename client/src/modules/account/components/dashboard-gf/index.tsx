import { Customer } from "@medusajs/medusa"
import Link from "next/link"
import { Avatar, Alert, Button } from "@heroui/react"
import ButtonLigth from "@modules/common/components/button_light"
import Cart from "@modules/common/icons/cart"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import { useNotificationContext } from "@lib/context/notification-context"
import Notification from "@modules/common/components/notification"

type DashboardProps = {
  orders?: number
  customer?: Omit<Customer, "password_hash">
}

const Dashboard = ({ orders, customer }: DashboardProps) => {
  const { t } = useTranslation("common")
  const { notifications } = useNotificationContext()

  return (
    <div>
  {/* <div className="flex items-center justify-center w-[50%]">
      <Alert
        color="secondary"
        description="¿Eras usuario de nuestra antigua plataforma?"
        endContent={
          <Link href="https://oldgudfy.online/mi-cuenta/" target="_blank">
          <Button color="secondary" size="sm" variant="flat">
            Conoce tu histórico aquí
          </Button>
          </Link>
        }
       
        variant="faded"
      />
    </div> */}
    <div className="w-full mt-8 flex items-center justify-center">
      
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Perfil */}
        
        <DashboardCard id="sct_per">

          <div className="h-auto w-full flex flex-col items-center justify-center overflow-hidden">
          
            <div className="flex flex-col items-center">
              <span className="text-xs text-center">
                Perfil {`${getProfileCompletion(customer)}%`} completado

              </span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 mt-3">
              <Avatar
                color="secondary"
                size="lg"
                className="w-24 h-24 md:w-28 md:h-28 text-5xl border-solid border-4 border-white opacity-100 transition-opacity duration-300 cursor-pointer"
                name={
                  customer
                    ? `${customer.first_name[0]}${customer.last_name[0]}`
                    : " "
                }
              />
              <div className="text-center md:text-left">
                <p className="text-xl md:text-2xl font-bold text-gray-700 capitalize mb-1">
                  {customer?.first_name} {customer?.last_name}
                </p>
                <span className="font-semibold text-gray-700">
                  {customer?.email}
                </span>
              </div>
            </div>
            <div className="flex items-center text-xs mt-2">
              <Cart size={16} className="mr-1" />
              <span>
                {t("acc_ind_purchases")}: {orders}
              </span>
            </div>
          </div>
        </DashboardCard>

        {/* Información de perfil */}
        <DashboardCard id="sct_profile">
          <DashboardContent
            imgSrc="/account/user.svg"
            imgAlt="user_gudfy"
            title={t("acc_profile_title")}
            subtitle="Información de tu perfil"
            link="/account/profile"
            btnText={t("acc_btn_profile")}
          />
        </DashboardCard>

        {/* Compras */}
        <DashboardCard id="sct_buy">
          <DashboardContent
            imgSrc="/account/cart.svg"
            imgAlt="sales_gudfy"
            title={t("acc_purchases_title")}
            subtitle={t("acc_purchases_subtitle")}
            link="/account/orders"
            btnText={t("acc_btn_subtitle")}
          >
            {notifications.map((n) =>
              n.notification_type_id === "NOTI_CLAIM_CUSTOMER_ID" ? (
                <Notification key={n.id} />
              ) : null
            )}
          </DashboardContent>
        </DashboardCard>

        {/* Soporte */}
        <DashboardCard id="sct_spp">
          <DashboardContent
            imgSrc="/account/support.svg"
            imgAlt="support_gudfy"
            title={t("acc_support_title")}
            subtitle={t("acc_support_subtitle")}
            link="/account/tickets"
            btnText={t("acc_btn_support")}
          />
        </DashboardCard>
      </div>
    </div>
    </div>
  )
}

// Componente para tarjetas
const DashboardCard = ({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) => (
  <div id={id} className="m-2 rounded-lg shadow-2xl p-6 bg-white">
    {children}
  </div>
)

// Componente para contenido de las tarjetas
const DashboardContent = ({
  imgSrc,
  imgAlt,
  title,
  subtitle,
  link,
  btnText,
  children,
}: {
  imgSrc: string
  imgAlt: string
  title: string
  subtitle: string
  link: string
  btnText: string
  children?: React.ReactNode
}) => (
  <div className="h-52 w-full flex flex-col items-center justify-center">
    <Image alt={imgAlt} src={imgSrc} width={80} height={80} />
    <h3 className="text-2xl text-gray-700 font-bold">{title}</h3>
    <p className="text-sm text-center">{subtitle}</p>
    <Link href={link}>
      <ButtonLigth
        name="perfil"
        variant="tertiary"
        className="bg-[#9B48ED] hover:bg-[#7b39c4] text-white mt-3"
      >
        {children}
        {btnText}
      </ButtonLigth>
    </Link>
  </div>
)

// Función para calcular porcentaje del perfil
const getProfileCompletion = (customer?: Omit<Customer, "password_hash">) => {
  if (!customer) return 0
  let count = 0
  if (customer.email) count++
  if (customer.first_name && customer.last_name) count++
  if (customer.phone) count++
  if (customer.billing_address) count++
  return (count / 4) * 100
}

export default Dashboard
