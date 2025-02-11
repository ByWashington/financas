import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	type FormValues,
	formSchema,
} from '@/features/categories/components/category-form-values'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'

type Props = {
	id?: string
	defaultValues?: FormValues
	onSubmit: (values: FormValues) => void
	onDelete?: () => void
	disabled?: boolean
}

const CategoryForm = ({
	id,
	defaultValues,
	onSubmit,
	onDelete,
	disabled,
}: Props) => {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: defaultValues,
	})

	const handleSubmit = (values: FormValues) => {
		onSubmit(values)
	}

	const handleDelete = () => {
		onDelete?.()
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="space-y-4 pt-4"
			>
				<FormField
					name="name"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input
									disabled={disabled}
									placeholder="Shopping, Transporte, Mercado..."
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<Button className="w-full" disabled={disabled}>
					{id ? 'Salvar' : 'Adicionar'}
				</Button>

				{!!id && (
					<Button
						type="button"
						disabled={disabled}
						onClick={handleDelete}
						className="w-full"
						size="icon"
						variant="outline"
					>
						<Trash className="size-4 mr-2" />
						Excluir
					</Button>
				)}
			</form>
		</Form>
	)
}

export default CategoryForm
