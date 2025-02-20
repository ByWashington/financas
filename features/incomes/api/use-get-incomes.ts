import { incomes } from '@/db/schema'
import { client } from '@/lib/hono'
import { convertAmountFromMiliunits } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'

export const useGetIncomes = () => {
	const params = useSearchParams()
	const isActive = params.get('isActive') || ''
	const name = params.get('name') || ''

	const query = useQuery({
		queryKey: ['incomes', { isActive, name }],
		queryFn: async () => {
			const response = await client.api.incomes.$get({
				query: {
					isActive,
					name,
				},
			})

			if (!response.ok) {
				throw new Error('Erro ao pesquisar as receitas')
			}

			const { data } = await response.json()
			return data.map((income) => ({
				...income,
				amount: convertAmountFromMiliunits(income.amount),
			}))
		},
	})

	return query
}
