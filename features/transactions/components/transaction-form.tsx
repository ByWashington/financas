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
} from '@/features/transactions/components/transaction-form-values'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, formatDate, parse, setDate } from 'date-fns'
import { Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import type { date } from 'zod'

type Props = {
	id?: string
	defaultValues?: FormValues
	onSubmit: (values: FormValues) => void
	onDelete?: () => void
	disabled?: boolean
}

const TransactionForm = ({
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
		console.log(values)
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
									placeholder="Conta de internet..."
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					name="description"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Descrição</FormLabel>
							<FormControl>
								<Input
									disabled={disabled}
									placeholder="Conta de internet do mês de janeiro..."
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					name="price"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Valor</FormLabel>
							<FormControl>
								<Input disabled={disabled} {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="date"
					render={({ field }) => (
						<FormItem className="flex w-72 flex-col gap-2">
							<FormLabel>Data</FormLabel>
							<FormControl>
								<Input disabled={disabled}  {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					name="category"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Categoria</FormLabel>
							<FormControl>
								<Input
									disabled={disabled}
									placeholder="Essenciais..."
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<Button className="w-full" disabled={disabled}>
					{id ? 'Salvar alterações' : 'Criar transação'}
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
						Excluir transação
					</Button>
				)}
			</form>
		</Form>
	)
}

export default TransactionForm
