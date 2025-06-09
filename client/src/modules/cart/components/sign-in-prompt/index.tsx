import Button from "@modules/common/components/button"
import Link from "next/link"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal"
import LoginLight from "@modules/account/components/login/login-light"
import { useState } from "react"
import RegisterLight from "@modules/account/components/register/register-light"

const SignInPrompt = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [auth, setAuth] = useState<"LOGIN" | "REGISTER">("LOGIN")
  const handlerAuth = (payload: "LOGIN" | "REGISTER") => {
    setAuth(payload)
    onOpen()
  }
  return (
    <div className="bg-white flex flex-col md:flex-row items-center md:items-start justify-between gap-4 p-4">
      <div className="text-center md:text-left w-full md:w-auto">
        <h2 className="text-xl-semi">¿Ya tienes una cuenta?</h2>
        <p className="text-base-regular text-gray-700 mt-2">
          Inicia sesión o Regístrate para una mejor experiencia.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <Button variant="primary" onClick={() => handlerAuth("LOGIN")} className="w-full sm:w-auto">
          Iniciar sesión
        </Button>
        <Button variant="primary" onClick={() => handlerAuth("REGISTER")} className="w-full sm:w-auto">
          Registrarse
        </Button>
      </div>
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody>
                  {auth == "LOGIN" ? <LoginLight /> : <RegisterLight />}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" onClick={onClose}>
                    Cerrar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </div>
  )
}

export default SignInPrompt
