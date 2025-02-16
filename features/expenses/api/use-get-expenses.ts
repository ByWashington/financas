import { expenses } from '@/db/schema'
import { client } from '@/lib/hono'
import { convertAmountFromMiliunits } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'

export const useGetExpenses = () => {
	const params = useSearchParams()
	const isActive = params.get('isActive') || ''
	const name = params.get('name') || ''

	const query = useQuery({
		queryKey: ['expenses', { isActive, name }],
		queryFn: async () => {
			const response = await client.api.expenses.$get({
				query: {
					isActive,
					name,
				},
			})

			if (!response.ok) {
				throw new Error('Erro ao pesquisar as despesas')
			}

			const { data } = await response.json()
			return data.map((expense) => ({
				...expense,
				amount: convertAmountFromMiliunits(expense.amount),
			}))
		},
	})

	return query
}
