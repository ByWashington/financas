'use client'

import { columns } from '@/app/(dashboard)/expenses/columns'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useBulkDeleteExpenses } from '@/features/expenses/api/use-bulk-delete'
import { useGetExpenses } from '@/features/expenses/api/use-get-expenses'
import { useNewExpense } from '@/features/expenses/hooks/use-new-expense'
import { Loader2, Plus } from 'lucide-react'

const ExpensesPage = () => {
	const newExpense = useNewExpense()
	const expensesQuery = useGetExpenses()
	const expenses = expensesQuery.data || []

	const deleteExpenses = useBulkDeleteExpenses()

	const isDisabled = expensesQuery.isLoading || deleteExpenses.isPending

	if (expensesQuery.isLoading) {
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
					<CardTitle className="text-xl line-clamp-1">Despesas</CardTitle>
					<Button onClick={newExpense.onOpen}>
						<Plus className="size-4 mr-2" /> Adicionar
					</Button>
				</CardHeader>
				<CardContent>
					<DataTable
						filterKey="name"
						filterDescription="Pesquisar por nome"
						columns={columns}
						data={expenses}
						onDelete={(row) => {
							const ids = row.map((r) => r.original.id)
							deleteExpenses.mutate({ ids })
						}}
						disabled={isDisabled}
					/>
				</CardContent>
			</Card>
		</div>
	)
}

export default ExpensesPage
