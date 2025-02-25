import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { useCreateAccount } from '@/features/accounts/api/use-create-account'
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts'
import { useCreateCategory } from '@/features/categories/api/use-create-category'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { useGetExpenses } from '@/features/expenses/api/use-get-expenses'
import { useCreateTransaction } from '@/features/transactions/api/use-create-transaction'
import TransactionForm from '@/features/transactions/components/transaction-form'
import type { ApiFormValues } from '@/features/transactions/components/transaction-form-values'
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction'
import { Loader2 } from 'lucide-react'

const NewTransactionSheet = () => {
	const { isOpen, onClose } = useNewTransaction()

	const mutation = useCreateTransaction()

	const categoryQuery = useGetCategories()
	const categoryMutation = useCreateCategory()
	const onCreateCategory = (name: string) => categoryMutation.mutate({ name })
	const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
		label: category.name,
		value: category.id,
	}))

	const accountQuery = useGetAccounts()
	const accountMutation = useCreateAccount()
	const onCreateAccount = (name: string) => accountMutation.mutate({ name })
	const accountOptions = (accountQuery.data ?? []).map((account) => ({
		label: account.name,
		value: account.id,
	}))

	const expenseQuery = useGetExpenses()
	const expenseOptions = (expenseQuery.data ?? []).map((expense) => ({
		label: expense.name,
		value: expense.id,
	}))

	const isPending =
		mutation.isPending ||
		categoryMutation.isPending ||
		accountMutation.isPending

	const isLoading =
		categoryQuery.isLoading || accountQuery.isLoading || expenseQuery.isLoading

	const onSubmit = (values: ApiFormValues) => {
		mutation.mutate(values, {
			onSuccess: () => {
				onClose()
			},
		})
	}

	return (
		<Sheet open={isOpen} onOpenChange={onClose}>
			<SheetContent className="space-y-4">
				<SheetHeader>
					<SheetTitle>Adicionar</SheetTitle>
					<SheetDescription>
						Adicione o histórico de todas as suas transações
					</SheetDescription>
				</SheetHeader>

				{isLoading ? (
					<div className="absolute inset-0 flex items-center justify-center">
						<Loader2 className="size-4 text-muted-foreground animate-spin" />
					</div>
				) : (
					<TransactionForm
						onSubmit={onSubmit}
						disabled={isPending}
						categoryOptions={categoryOptions}
						onCreateCategory={onCreateCategory}
						accountOptions={accountOptions}
						onCreateAccount={onCreateAccount}
						expenseOptions={expenseOptions}
					/>
				)}
			</SheetContent>
		</Sheet>
	)
}

export default NewTransactionSheet
