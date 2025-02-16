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
import { useDeleteExpense } from '@/features/expenses/api/use-delete-expense'
import { useEditExpense } from '@/features/expenses/api/use-edit-expense'
import { useGetExpense } from '@/features/expenses/api/use-get-expense'
import ExpenseForm from '@/features/expenses/components/expense-form'
import type {
	ApiFormValues,
	FormValues,
} from '@/features/expenses/components/expense-form-values'
import { useOpenExpense } from '@/features/expenses/hooks/use-open-expense'
import { useConfirm } from '@/hooks/use-confirm'
import { Loader2 } from 'lucide-react'

const EditExpenseSheet = () => {
	const { isOpen, onClose, id } = useOpenExpense()
	const [ConfirmationDialog, confirm] = useConfirm(
		'Você tem certeza?',
		'Não será possível recuperar a conta',
	)

	const expensesQuery = useGetExpense(id)
	const editMutation = useEditExpense(id)
	const deleteMutation = useDeleteExpense(id)

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

	const isPending =
		editMutation.isPending ||
		deleteMutation.isPending ||
		categoryMutation.isPending ||
		accountMutation.isPending

	const onSubmit = (values: ApiFormValues) => {
		editMutation.mutate(values, {
			onSuccess: () => {
				onClose()
			},
		})
	}

	const onDelete = async () => {
		const ok = await confirm()

		if (ok) {
			deleteMutation.mutate(undefined, {
				onSuccess: () => {
					onClose()
				},
			})
		}
	}

	const isLoading =
		expensesQuery.isLoading || categoryQuery.isLoading || accountQuery.isLoading

	if (!expensesQuery || !expensesQuery.data) {
		return null
	}

	const defaultValues = {
		name: expensesQuery.data.name,
		description: expensesQuery.data.description,
		date: new Date(expensesQuery.data.date),
		amount: expensesQuery.data.amount.toString(),
		currentInstallment: expensesQuery.data.currentInstallment?.toString(),
		numberInstallments: expensesQuery.data.numberInstallments?.toString(),
		isEternal: expensesQuery.data.isEternal.toString(),
		isActive: expensesQuery.data.isActive.toString(),
		categoryId: expensesQuery.data.categoryId,
	}

	return (
		<>
			<ConfirmationDialog />
			<Sheet open={isOpen} onOpenChange={onClose}>
				<SheetContent className="space-y-4">
					<SheetHeader>
						<SheetTitle>Alterar</SheetTitle>
						<SheetDescription>
							Gerencie as suas despesas cadastradas
						</SheetDescription>
					</SheetHeader>
					{isLoading ? (
						<div className="absolute inset-0 flex items-center justify-center">
							<Loader2 className="size-4 text-muted-foreground animate-spin" />
						</div>
					) : (
						<ExpenseForm
							onSubmit={onSubmit}
							disabled={isPending}
							defaultValues={defaultValues}
							id={id}
							onDelete={onDelete}
							categoryOptions={categoryOptions}
							onCreateCategory={onCreateCategory}
						/>
					)}
				</SheetContent>
			</Sheet>
		</>
	)
}

export default EditExpenseSheet
