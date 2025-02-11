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
import { useDeleteTransaction } from '@/features/transactions/api/use-delete-transaction'
import { useEditTransaction } from '@/features/transactions/api/use-edit-transaction'
import { useGetTransaction } from '@/features/transactions/api/use-get-transaction'
import TransactionForm from '@/features/transactions/components/transaction-form'
import type {
	ApiFormValues,
	FormValues,
} from '@/features/transactions/components/transaction-form-values'
import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction'
import { useConfirm } from '@/hooks/use-confirm'
import { Loader2 } from 'lucide-react'

const EditTransactionSheet = () => {
	const { isOpen, onClose, id } = useOpenTransaction()
	const [ConfirmationDialog, confirm] = useConfirm(
		'Você tem certeza?',
		'Não será possível recuperar a conta',
	)

	const transactionsQuery = useGetTransaction(id)
	const editMutation = useEditTransaction(id)
	const deleteMutation = useDeleteTransaction(id)

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
		transactionsQuery.isLoading ||
		categoryQuery.isLoading ||
		accountQuery.isLoading

	if (!transactionsQuery || !transactionsQuery.data) {
		return null
	}

	const defaultValues = {
		name: transactionsQuery.data.name,
		description: transactionsQuery.data.description,
		date: new Date(transactionsQuery.data.date),
		amount: transactionsQuery.data.amount.toString(),
		document: transactionsQuery.data.document,
		categoryId: transactionsQuery.data.categoryId,
		accountId: transactionsQuery.data.accountId,
	}

	console.log(defaultValues.date)

	return (
		<>
			<ConfirmationDialog />
			<Sheet open={isOpen} onOpenChange={onClose}>
				<SheetContent className="space-y-4">
					<SheetHeader>
						<SheetTitle>Alterar</SheetTitle>
						<SheetDescription>
							Gerencie as suas transações cadastradas
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
							defaultValues={defaultValues}
							id={id}
							onDelete={onDelete}
							categoryOptions={categoryOptions}
							onCreateCategory={onCreateCategory}
							accountOptions={accountOptions}
							onCreateAccount={onCreateAccount}
						/>
					)}
				</SheetContent>
			</Sheet>
		</>
	)
}

export default EditTransactionSheet
