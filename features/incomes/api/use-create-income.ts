import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<typeof client.api.incomes.$post>
type RequestType = InferRequestType<typeof client.api.incomes.$post>['json']

export const useCreateIncome = () => {
	const queryClient = useQueryClient()

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async (json) => {
			const response = await client.api.incomes.$post({ json })
			return await response.json()
		},
		onSuccess: () => {
			toast.success('Criado com sucesso!')
			queryClient.invalidateQueries({ queryKey: ['incomes'] })
		},
		onError: () => {
			toast.error('Erro tentar criar, tente novamente mais tarde!')
		},
	})

	return mutation
}
