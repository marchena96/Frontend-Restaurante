import { z } from 'zod'

export const clientFormSchema = z.object({
  firstName: z.string().min(1, 'El nombre es obligatorio'),
  lastName: z.string().min(1, 'El apellido es obligatorio'),
  phoneNumber: z.string().min(8, 'Telefono invalido'),
  idCard: z.string().min(1, 'La cedula es obligatoria'),
})

export type ClientFormValues = z.infer<typeof clientFormSchema>
