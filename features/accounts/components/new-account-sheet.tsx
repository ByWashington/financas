import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { useCreateAccount } from '@/features/accounts/api/use-create-account'
import AccountForm from '@/features/accounts/components/account-form'
import type { FormValues } from '@/features/accounts/components/account-form-values'
import { useNewAccount } from '@/features/accounts/hooks/use-new-account'

const NewAccountSheet = () => {
	const { isOpen, onClose } = useNewAccount()

	const mutation = useCreateAccount()

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
				<AccountForm
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

export default NewAccountSheet
