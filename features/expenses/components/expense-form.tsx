import { AmountInput } from '@/components/amount-input'
import { DatePicker } from '@/components/date-picker'
import { Select } from '@/components/select'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	type ApiFormValues,
	type FormValues,
	formSchema,
} from '@/features/expenses/components/expense-form-values'
import { convertAmountToMiliunits, convertStringToBoolean } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'

type Props = {
	id?: string
	defaultValues?: FormValues
	onSubmit: (values: ApiFormValues) => void
	onDelete?: () => void
	disabled?: boolean
	categoryOptions: { label: string; value: string }[]
	onCreateCategory: (name: string) => void
}

const ExpenseForm = ({
	id,
	defaultValues,
	onSubmit,
	onDelete,
	disabled,
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

		console.log('aqi')

		onSubmit({
			...values,
			currentInstallment: Number.parseFloat(values.currentInstallment ?? '0'),
			numberInstallments: Number.parseFloat(values.numberInstallments ?? '0'),
			isEternal: convertStringToBoolean(values.isEternal),
			isActive: convertStringToBoolean(values.isActive),
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
									{...field}
									value={field.value ?? ''}
									disabled={disabled}
									placeholder="Conta de internet..."
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

				<div className="flex flex-row gap-4">
					<FormField
						name="currentInstallment"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Parcela atual</FormLabel>
								<FormControl>
									<Input
										{...field}
										value={field.value ?? ''}
										disabled={disabled}
										type="number"
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						name="numberInstallments"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Número de parcelas</FormLabel>
								<FormControl>
									<Input
										{...field}
										value={field.value ?? ''}
										disabled={disabled}
										type="number"
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>

				<FormField
					name="isEternal"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className="flex items-center space-x-2">
									<Checkbox value={field.value} onChange={field.onChange} />
									<label
										htmlFor="terms2"
										className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										Despesa eterna
									</label>
								</div>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					name="isActive"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className="flex items-center space-x-2">
									<Checkbox value={field.value} onChange={field.onChange} />
									<label
										htmlFor="terms2"
										className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										Despesa ativa
									</label>
								</div>
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

export default ExpenseForm
