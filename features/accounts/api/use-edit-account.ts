import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
	(typeof client.api.accounts)[':id']['$patch']
>
type RequestType = InferRequestType<
	(typeof client.api.accounts)[':id']['$patch']
>['json']

export const useEditAccount = (id: string) => {
	const queryClient = useQueryClient()

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async (json) => {
			const response = await client.api.accounts[':id'].$patch({
				json,
				param: { id },
			})

			return await response.json()
		},
		onSuccess: () => {
			toast.success('Conta alterada com sucesso!')
			queryClient.invalidateQueries({ queryKey: ['account', { id }] })
			queryClient.invalidateQueries({ queryKey: ['accounts'] })
		},
		onError: () => {
			toast.error('Erro ao alterar a conta, tente novamente mais tarde!')
		},
	})

	return mutation
}
