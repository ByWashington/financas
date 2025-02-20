import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts'
import { useCreateCategory } from '@/features/categories/api/use-create-category'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { useCreateIncome } from '@/features/incomes/api/use-create-income'
import IncomeForm from '@/features/incomes/components/income-form'
import type {
	ApiFormValues,
	FormValues,
} from '@/features/incomes/components/income-form-values'
import { useNewIncome } from '@/features/incomes/hooks/use-new-income'
import { Loader2 } from 'lucide-react'

const NewIncomeSheet = () => {
	const { isOpen, onClose } = useNewIncome()

	const mutation = useCreateIncome()

	const categoryQuery = useGetCategories()
	const categoryMutation = useCreateCategory()
	const onCreateCategory = (name: string) => categoryMutation.mutate({ name })
	const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
		label: category.name,
		value: category.id,
	}))

	const accountQuery = useGetAccounts()

	const isPending = mutation.isPending || categoryMutation.isPending

	const isLoading = categoryQuery.isLoading || accountQuery.isLoading

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
						Adicione receitas e tenha controle dos seus valores recebidos e a
						receber
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
						categoryOptions={categoryOptions}
						onCreateCategory={onCreateCategory}
					/>
				)}
			</SheetContent>
		</Sheet>
	)
}

export default NewIncomeSheet
