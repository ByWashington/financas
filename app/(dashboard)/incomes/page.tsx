'use client'

import { columns } from '@/app/(dashboard)/incomes/columns'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useBulkDeleteIncomes } from '@/features/incomes/api/use-bulk-delete'
import { useGetIncomes } from '@/features/incomes/api/use-get-incomes'
import { useNewIncome } from '@/features/incomes/hooks/use-new-income'
import { Loader2, Plus } from 'lucide-react'

const IncomesPage = () => {
	const newIncome = useNewIncome()
	const incomesQuery = useGetIncomes()
	const incomes = incomesQuery.data || []

	const deleteIncomes = useBulkDeleteIncomes()

	const isDisabled = incomesQuery.isLoading || deleteIncomes.isPending

	if (incomesQuery.isLoading) {
		return (
			<div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
				<Card className="border-none drop-shadow-sm">
					<CardHeader>
						<Skeleton className="h-8 w-48" />
					</CardHeader>
					<CardContent>
						<div className="h-[500px] w-full flex items-center justify-center">
							<Loader2 className="size-6 text-slate-300 animate-spin" />
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
			<Card className="border-none drop-shadow-sm">
				<CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
					<CardTitle className="text-xl line-clamp-1">Receita</CardTitle>
					<Button onClick={newIncome.onOpen}>
						<Plus className="size-4 mr-2" /> Adicionar
					</Button>
				</CardHeader>
				<CardContent>
					<DataTable
						filterKey="name"
						filterDescription="Pesquisar por nome"
						columns={columns}
						data={incomes}
						onDelete={(row) => {
							const ids = row.map((r) => r.original.id)
							deleteIncomes.mutate({ ids })
						}}
						disabled={isDisabled}
					/>
				</CardContent>
			</Card>
		</div>
	)
}

export default IncomesPage
