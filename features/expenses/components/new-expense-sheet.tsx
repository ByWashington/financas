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
import { useCreateExpense } from '@/features/expenses/api/use-create-expense'
import ExpenseForm from '@/features/expenses/components/expense-form'
import type {
	ApiFormValues,
	FormValues,
} from '@/features/expenses/components/expense-form-values'
import { useNewExpense } from '@/features/expenses/hooks/use-new-expense'
import { Loader2 } from 'lucide-react'

const NewExpenseSheet = () => {
	const { isOpen, onClose } = useNewExpense()

	const mutation = useCreateExpense()

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
						Adicione despesas não pagas e saiba os seus custos futuros
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
						categoryOptions={categoryOptions}
						onCreateCategory={onCreateCategory}
					/>
				)}
			</SheetContent>
		</Sheet>
	)
}

export default NewExpenseSheet
