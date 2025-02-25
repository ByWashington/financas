import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
	(typeof client.api.transactions)[':id']['$patch']
>
type RequestType = InferRequestType<
	(typeof client.api.transactions)[':id']['$patch']
>['json']

export const useEditTransaction = (id: string) => {
	const queryClient = useQueryClient()

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async (json) => {
			const response = await client.api.transactions[':id'].$patch({
				json,
				param: { id },
			})

			return await response.json()
		},
		onSuccess: () => {
			toast.success('Transação alterada com sucesso!')
			queryClient.invalidateQueries({ queryKey: ['transaction', { id }] })
			queryClient.invalidateQueries({ queryKey: ['transactions'] })
		},
		onError: () => {
			toast.error('Erro ao alterar a transação, tente novamente mais tarde!')
		},
	})

	return mutation
}
