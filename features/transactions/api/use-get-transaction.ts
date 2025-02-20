import { client } from '@/lib/hono'
import { convertAmountFromMiliunits } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'

export const useGetTransaction = (id: string) => {
	const query = useQuery({
		enabled: !!id,
		queryKey: ['transactions', { id }],
		queryFn: async () => {
			const response = await client.api.transactions[':id'].$get({
				param: { id },
			})

			if (!response.ok) {
				throw new Error('Erro ao pesquisar a transação')
			}

			const { data } = await response.json()
			return {
				...data,
				amount: convertAmountFromMiliunits(data.amount),
			}
		},
	})

	return query
}
