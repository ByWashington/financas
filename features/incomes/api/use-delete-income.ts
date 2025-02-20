import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
	(typeof client.api.incomes)[':id']['$delete']
>

export const useDeleteIncome = (id?: string) => {
	const queryClient = useQueryClient()

	const mutation = useMutation<ResponseType, Error>({
		mutationFn: async (json) => {
			const response = await client.api.incomes[':id'].$delete({
				param: { id },
			})

			return await response.json()
		},
		onSuccess: () => {
			toast.success('Receita excluída com sucesso!')
			queryClient.invalidateQueries({ queryKey: ['income', { id }] })
			queryClient.invalidateQueries({ queryKey: ['incomes'] })
		},
		onError: () => {
			toast.error('Erro ao excluir a receita, tente novamente mais tarde!')
		},
	})

	return mutation
}
