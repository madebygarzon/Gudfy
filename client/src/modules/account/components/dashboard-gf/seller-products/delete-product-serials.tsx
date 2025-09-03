"use client";
import React, { useState } from "react";
import DeleteSerialCode from "@modules/account/actions/serial-code/delete-serial-code";
import { Modal, ModalContent, ModalBody } from "@heroui/react";
import ButtonLigth from "@modules/common/components/button_light";

type Props = {
  serials: string[] | string;
  onOpenChange: (open: boolean) => void;
  isOpen: boolean;
  onCloseDelete: () => void;
  handlergetListProductSerials: () => void;
  /** Optional: parent can clear selections/state after success */
  onSuccess?: () => void;
};

export default function DeleteSerials({
  onCloseDelete,
  serials,
  onOpenChange,
  isOpen,
  handlergetListProductSerials,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const onDeleteListSerial = async () => {
    // Normalize to array and harden guards
    const ids = Array.isArray(serials) ? serials.filter(Boolean) : [serials].filter(Boolean);
    if (!ids.length || loading) return;

    try {
      setLoading(true);
      await DeleteSerialCode(ids); // <-- always an array
      await handlergetListProductSerials(); // refresh table
      onSuccess?.(); // optional: clear selections in parent
      onCloseDelete(); // close modal
    } catch {
      alert("Error al eliminar la lista de códigos");
    } finally {
      setLoading(false);
    }
  };

  const count = Array.isArray(serials) ? serials.length : (serials ? 1 : 0);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalContent className="rounded-lg shadow-lg">
        {() => (
          <ModalBody className="flex items-center justify-center gap-4 py-10 px-5">
            <strong>
              ¿Estás seguro de eliminar {count === 1 ? "1 código" : `${count} códigos`}?
            </strong>
            <ButtonLigth
              color="primary"
              className="bg-[#ff0040cc] hover:bg-[#ff0040] text-white border-none w-full sm:w-auto"
              onClick={onDeleteListSerial}
              disabled={loading || count === 0}
            >
              {loading ? "Eliminando..." : "Eliminar"}
            </ButtonLigth>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}
