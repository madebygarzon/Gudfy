import type { WidgetConfig } from "@medusajs/admin"
import React, { useEffect, useState } from "react"
import { Button, Table, Input } from "@medusajs/ui"
import {
  getCommissionGroups,
  postCommissionGroup,
  putCommissionGroup,
  deleteCommissionGroup,
} from "../../actions/commission"

interface GroupRow {
  id: string
  name: string
  rate: number
}

const CommissionGroups = () => {
  const [groups, setGroups] = useState<GroupRow[]>([])
  const [newName, setNewName] = useState("")
  const [newRate, setNewRate] = useState(0)

  const load = async () => {
    const data = await getCommissionGroups()
    setGroups(data)
  }

  useEffect(() => {
    load()
  }, [])

  const add = async () => {
    await postCommissionGroup(newName, newRate)
    setNewName("")
    setNewRate(0)
    load()
  }

  const update = async (id: string, name: string, rate: number) => {
    await putCommissionGroup(id, name, rate)
    load()
  }

  const remove = async (id: string) => {
    await deleteCommissionGroup(id)
    load()
  }

  return (
    <div className="p-4 flex flex-col gap-y-4">
      <div className="flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nombre"
        />
        <Input
          type="number"
          value={newRate}
          onChange={(e) => setNewRate(Number(e.target.value))}
          placeholder="%"
        />
        <Button variant="primary" onClick={add}>
          Añadir
        </Button>
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Nombre</Table.HeaderCell>
            <Table.HeaderCell>Porcentaje</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {groups.map((g) => (
            <Table.Row key={g.id}>
              <Table.Cell>
                <Input
                  value={g.name}
                  onChange={(e) =>
                    setGroups((prev) =>
                      prev.map((p) =>
                        p.id === g.id ? { ...p, name: e.target.value } : p
                      )
                    )
                  }
                />
              </Table.Cell>
              <Table.Cell>
                <Input
                  type="number"
                  value={g.rate}
                  onChange={(e) =>
                    setGroups((prev) =>
                      prev.map((p) =>
                        p.id === g.id ? { ...p, rate: Number(e.target.value) } : p
                      )
                    )
                  }
                />
              </Table.Cell>
              <Table.Cell className="flex gap-2">
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => update(g.id, g.name, g.rate)}
                >
                  Guardar
                </Button>
                <Button
                  size="small"
                  variant="danger"
                  onClick={() => remove(g.id)}
                >
                  Eliminar
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export const config: WidgetConfig = {
  zone: "product.list.before",
}

export default CommissionGroups
