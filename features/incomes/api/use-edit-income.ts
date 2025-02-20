import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
	(typeof client.api.incomes)[':id']['$patch']
>
type RequestType = InferRequestType<
	(typeof client.api.incomes)[':id']['$patch']
>['json']

export const useEditIncome = (id?: string) => {
	const queryClient = useQueryClient()

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async (json) => {
			const response = await client.api.incomes[':id'].$patch({
				json,
				param: { id },
			})

			return await response.json()
		},
		onSuccess: () => {
			toast.success('Receita alterada com sucesso!')
			queryClient.invalidateQueries({ queryKey: ['income', { id }] })
			queryClient.invalidateQueries({ queryKey: ['incomes'] })
		},
		onError: () => {
			toast.error('Erro ao alterar a receita, tente novamente mais tarde!')
		},
	})

	return mutation
}
