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
import { useDeleteIncome } from '@/features/incomes/api/use-delete-income'
import { useEditIncome } from '@/features/incomes/api/use-edit-income'
import { useGetIncome } from '@/features/incomes/api/use-get-income'
import IncomeForm from '@/features/incomes/components/income-form'
import type {
	ApiFormValues,
	FormValues,
} from '@/features/incomes/components/income-form-values'
import { useOpenIncome } from '@/features/incomes/hooks/use-open-income'
import { useConfirm } from '@/hooks/use-confirm'
import { Loader2 } from 'lucide-react'

const EditIncomeSheet = () => {
	const { isOpen, onClose, id } = useOpenIncome()
	const [ConfirmationDialog, confirm] = useConfirm(
		'Você tem certeza?',
		'Não será possível recuperar a conta',
	)

	const incomesQuery = useGetIncome(id)
	const editMutation = useEditIncome(id)
	const deleteMutation = useDeleteIncome(id)

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
		incomesQuery.isLoading || categoryQuery.isLoading || accountQuery.isLoading

	if (!incomesQuery || !incomesQuery.data) {
		return null
	}

	const defaultValues = {
		name: incomesQuery.data.name,
		description: incomesQuery.data.description,
		date: new Date(incomesQuery.data.date),
		amount: incomesQuery.data.amount.toString(),
		currentInstallment: incomesQuery.data.currentInstallment?.toString(),
		numberInstallments: incomesQuery.data.numberInstallments?.toString(),
		isEternal: incomesQuery.data.isEternal.toString(),
		isActive: incomesQuery.data.isActive.toString(),
		categoryId: incomesQuery.data.categoryId,
	}

	return (
		<>
			<ConfirmationDialog />
			<Sheet open={isOpen} onOpenChange={onClose}>
				<SheetContent className="space-y-4">
					<SheetHeader>
						<SheetTitle>Alterar</SheetTitle>
						<SheetDescription>
							Gerencie as suas receitas cadastradas
						</SheetDescription>
					</SheetHeader>
					{isLoading ? (
						<div className="absolute inset-0 flex items-center justify-center">
							<Loader2 className="size-4 text-muted-foreground animate-spin" />
						</div>
					) : (
						<IncomeForm
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

export default EditIncomeSheet
