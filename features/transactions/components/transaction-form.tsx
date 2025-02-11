import { AmountInput } from '@/components/amount-input'
import { DatePicker } from '@/components/date-picker'
import { Select } from '@/components/select'
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
	type ApiFormValues,
	type FormValues,
	formSchema,
} from '@/features/transactions/components/transaction-form-values'
import { convertAmountToMiliunits } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'

type Props = {
	id?: string
	defaultValues?: FormValues
	onSubmit: (values: ApiFormValues) => void
	onDelete?: () => void
	disabled?: boolean
	accountOptions: { label: string; value: string }[]
	onCreateAccount: (name: string) => void
	categoryOptions: { label: string; value: string }[]
	onCreateCategory: (name: string) => void
}

const TransactionForm = ({
	id,
	defaultValues,
	onSubmit,
	onDelete,
	disabled,
	accountOptions,
	onCreateAccount,
	categoryOptions,
	onCreateCategory,
}: Props) => {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: defaultValues,
	})

	const handleSubmit = (values: FormValues) => {
		const amount = Number.parseFloat(values.amount)
		const amountInMiliunits = convertAmountToMiliunits(amount)

		onSubmit({
			...values,
			amount: amountInMiliunits,
		})
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
									{...field}
									value={field.value ?? ''}
									disabled={disabled}
									placeholder="Conta de internet do mês de janeiro..."
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					name="accountId"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Conta</FormLabel>
							<FormControl>
								<Select
									placeholder="Seleciona uma conta"
									options={accountOptions}
									onCreate={onCreateAccount}
									value={field.value}
									onChange={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					name="amount"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Valor</FormLabel>
							<FormControl>
								<AmountInput
									{...field}
									disabled={disabled}
									placeholder="R$ 0,00"
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="date"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<DatePicker
									value={field.value}
									onChange={(x) => {
										field.onChange(x)
									}}
									disabled={disabled}
									placeholder="Data de pagamento"
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					name="categoryId"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Categoria</FormLabel>
							<FormControl>
								<Select
									placeholder="Seleciona uma categoria"
									options={categoryOptions}
									onCreate={onCreateCategory}
									value={field.value}
									onChange={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					name="document"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Comprovante</FormLabel>
							<FormControl>
								<Input
									{...field}
									value={field.value ?? ''}
									disabled={disabled}
									placeholder="URL do documento"
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

export default TransactionForm
