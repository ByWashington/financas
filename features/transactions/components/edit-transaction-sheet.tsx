import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { useDeleteTransaction } from '@/features/transactions/api/use-delete-transaction'
import { useEditTransaction } from '@/features/transactions/api/use-edit-transaction'
import { useGetTransaction } from '@/features/transactions/api/use-get-transaction'
import TransactionForm from '@/features/transactions/components/transaction-form'
import type { FormValues } from '@/features/transactions/components/transaction-form-values'
import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction'
import { useConfirm } from '@/hooks/use-confirm'
import { Loader2 } from 'lucide-react'

const EditTransactionSheet = () => {
	const { isOpen, onClose, id } = useOpenTransaction()
	const [ConfirmationDialog, confirm] = useConfirm(
		'Você tem certeza?',
		'Não será possível recuperar a conta',
	)

	const transactionsQuery = useGetTransaction(id)
	const editMutation = useEditTransaction(id)
	const deleteMutation = useDeleteTransaction(id)

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

	const isLoading = transactionsQuery.isLoading

	const defaultValues = transactionsQuery.data
		? {
				name: transactionsQuery.data.name,
				description: transactionsQuery.data.description,
				date: transactionsQuery.data.date,
				category: transactionsQuery.data.category,
				price: transactionsQuery.data.price,
				document: transactionsQuery.data.document,
			}
		: {
				name: '',
				description: '',
				date: '',
				category: '',
				price: '',
				document: '',
			}

	console.log(defaultValues.date)

	return (
		<>
			<ConfirmationDialog />
			<Sheet open={isOpen} onOpenChange={onClose}>
				<SheetContent className="space-y-4">
					<SheetHeader>
						<SheetTitle>Alterar</SheetTitle>
						<SheetDescription>
							Gerencie as suas contas cadastradas
						</SheetDescription>
					</SheetHeader>
					{isLoading ? (
						<div className="absolute inset-0 flex items-center justify-center">
							<Loader2 className="size-4 text-muted-foreground animate-spin" />
						</div>
					) : (
						<TransactionForm
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

export default EditTransactionSheet
