import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { useCreateCategory } from '@/features/categories/api/use-create-category'
import CategoryForm from '@/features/categories/components/category-form'
import type { FormValues } from '@/features/categories/components/category-form-values'
import { useNewCategory } from '@/features/categories/hooks/use-new-category'

const NewCategorySheet = () => {
	const { isOpen, onClose } = useNewCategory()

	const mutation = useCreateCategory()

	const onSubmit = (values: FormValues) => {
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
					<SheetTitle>Nova categoria</SheetTitle>
					<SheetDescription>
						Crie uma nova categoria e use para categorizar suas transações
					</SheetDescription>
				</SheetHeader>
				<CategoryForm
					onSubmit={onSubmit}
					disabled={mutation.isPending}
					defaultValues={{
						name: '',
					}}
				/>
			</SheetContent>
		</Sheet>
	)
}

export default NewCategorySheet
