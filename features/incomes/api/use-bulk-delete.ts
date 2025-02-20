import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
	(typeof client.api.incomes)['bulk-delete']['$post']
>
type RequestType = InferRequestType<
	(typeof client.api.incomes)['bulk-delete']['$post']
>['json']

export const useBulkDeleteIncomes = () => {
	const queryClient = useQueryClient()

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async (json) => {
			const response = await client.api.incomes['bulk-delete'].$post({
				json,
			})
			return await response.json()
		},
		onSuccess: () => {
			toast.success('Exclusão realizada com sucesso!')
			queryClient.invalidateQueries({ queryKey: ['incomes'] })
		},
		onError: () => {
			toast.error(
				'Erro ao tentar excluir o(s) registro(s), tente novamente mais tarde!',
			)
		},
	})

	return mutation
}
