import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
	(typeof client.api.expenses)[':id']['$delete']
>

export const useDeleteExpense = (id?: string) => {
	const queryClient = useQueryClient()

	const mutation = useMutation<ResponseType, Error>({
		mutationFn: async (json) => {
			const response = await client.api.expenses[':id'].$delete({
				param: { id },
			})

			return await response.json()
		},
		onSuccess: () => {
			toast.success('Despesa excluída com sucesso!')
			queryClient.invalidateQueries({ queryKey: ['expense', { id }] })
			queryClient.invalidateQueries({ queryKey: ['expenses'] })
		},
		onError: () => {
			toast.error('Erro ao excluir a despesa, tente novamente mais tarde!')
		},
	})

	return mutation
}
