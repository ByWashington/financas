import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { useDeleteAccount } from '@/features/accounts/api/use-delete-account'
import { useEditAccount } from '@/features/accounts/api/use-edit-account'
import { useGetAccount } from '@/features/accounts/api/use-get-account'
import AccountForm from '@/features/accounts/components/account-form'
import type { FormValues } from '@/features/accounts/components/account-form-values'
import { useOpenAccount } from '@/features/accounts/hooks/use-open-account'
import { useConfirm } from '@/hooks/use-confirm'
import { Loader2 } from 'lucide-react'

const EditAccountSheet = () => {
	const { isOpen, onClose, id } = useOpenAccount()
	const [ConfirmationDialog, confirm] = useConfirm(
		'Você tem certeza?',
		'Não será possível recuperar a conta',
	)

	const accountsQuery = useGetAccount(id)
	const editMutation = useEditAccount(id)
	const deleteMutation = useDeleteAccount(id)

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

	const isLoading = accountsQuery.isLoading

	const defaultValues = accountsQuery.data
		? {
				name: accountsQuery.data.name,
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
							Gerencie as suas contas cadastradas
						</SheetDescription>
					</SheetHeader>
					{isLoading ? (
						<div className="absolute inset-0 flex items-center justify-center">
							<Loader2 className="size-4 text-muted-foreground animate-spin" />
						</div>
					) : (
						<AccountForm
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

export default EditAccountSheet
