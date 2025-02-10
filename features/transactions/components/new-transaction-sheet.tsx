import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { useCreateTransaction } from '@/features/transactions/api/use-create-transaction'
import TransactionForm from '@/features/transactions/components/transaction-form'
import type { FormValues } from '@/features/transactions/components/transaction-form-values'
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction'

const NewTransactionSheet = () => {
	const { isOpen, onClose } = useNewTransaction()

	const mutation = useCreateTransaction()

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
					<SheetTitle>Nova conta</SheetTitle>
					<SheetDescription>
						Criar uma nova conta e monitorar as suas transações
					</SheetDescription>
				</SheetHeader>
				<TransactionForm
					onSubmit={onSubmit}
					disabled={mutation.isPending}
					defaultValues={{
						name: '',
						description: '',
						date: '',
						price: '',
						category: '',
						document: '',
					}}
				/>
			</SheetContent>
		</Sheet>
	)
}

export default NewTransactionSheet
