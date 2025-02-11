import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { useDeleteCategory } from '@/features/categories/api/use-delete-category'
import { useEditCategory } from '@/features/categories/api/use-edit-category'
import { useGetCategory } from '@/features/categories/api/use-get-category'
import CategoryForm from '@/features/categories/components/category-form'
import type { FormValues } from '@/features/categories/components/category-form-values'
import { useOpenCategory } from '@/features/categories/hooks/use-open-category'
import { useConfirm } from '@/hooks/use-confirm'
import { Loader2 } from 'lucide-react'

const EditCategorySheet = () => {
	const { isOpen, onClose, id } = useOpenCategory()
	const [ConfirmationDialog, confirm] = useConfirm(
		'Você tem certeza?',
		'Não será possível recuperar a categoria',
	)

	const categoriesQuery = useGetCategory(id)
	const editMutation = useEditCategory(id)
	const deleteMutation = useDeleteCategory(id)

	const isPending = editMutation.isPending || deleteMutation.isPending

	const onSubmit = (values: FormValues) => {
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

	const isLoading = categoriesQuery.isLoading

	const defaultValues = categoriesQuery.data
		? {
				name: categoriesQuery.data.name,
			}
		: {
				name: '',
			}

	return (
		<>
			<ConfirmationDialog />
			<Sheet open={isOpen} onOpenChange={onClose}>
				<SheetContent className="space-y-4">
					<SheetHeader>
						<SheetTitle>Alterar</SheetTitle>
						<SheetDescription>
							Gerencie as categorias das suas transações
						</SheetDescription>
					</SheetHeader>
					{isLoading ? (
						<div className="absolute inset-0 flex items-center justify-center">
							<Loader2 className="size-4 text-muted-foreground animate-spin" />
						</div>
					) : (
						<CategoryForm
							onSubmit={onSubmit}
							disabled={isPending}
							defaultValues={defaultValues}
							id={id}
							onDelete={onDelete}
						/>
					)}
				</SheetContent>
			</Sheet>
		</>
	)
}

export default EditCategorySheet
