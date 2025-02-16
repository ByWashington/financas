import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
	(typeof client.api.expenses)[':id']['$patch']
>
type RequestType = InferRequestType<
	(typeof client.api.expenses)[':id']['$patch']
>['json']

export const useEditExpense = (id?: string) => {
	const queryClient = useQueryClient()

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async (json) => {
			const response = await client.api.expenses[':id'].$patch({
				json,
				param: { id },
			})

			return await response.json()
		},
		onSuccess: () => {
			toast.success('Despesa alterada com sucesso!')
			queryClient.invalidateQueries({ queryKey: ['expense', { id }] })
			queryClient.invalidateQueries({ queryKey: ['expenses'] })
		},
		onError: () => {
			toast.error('Erro ao alterar a transação, tente novamente mais tarde!')
		},
	})

	return mutation
}
