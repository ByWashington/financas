'use client'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDeleteTransaction } from '@/features/transactions/api/use-delete-transaction'
import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction'
import { useConfirm } from '@/hooks/use-confirm'
import { Edit, MoreHorizontal, Trash } from 'lucide-react'

type Props = {
	id: string
}

export const Actions = ({ id }: Props) => {
	const deleteMutation = useDeleteTransaction(id)

	const [ConfirmationDialog, confirm] = useConfirm(
		'Você tem certeza?',
		'Não será possível recuperar a transação',
	)

	const { onOpen } = useOpenTransaction()

	const onDelete = async () => {
		const ok = await confirm()

		if (ok) {
			deleteMutation.mutate()
		}
	}

	return (
		<>
			<ConfirmationDialog />
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="size-8 p-0">
						<MoreHorizontal className="size-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem disabled={false} onClick={() => onOpen(id)}>
						<Edit className="size-4 mr-2" />
						Editar
					</DropdownMenuItem>
					<DropdownMenuItem
						disabled={deleteMutation.isPending}
						onClick={onDelete}
					>
						<Trash className="size-4 mr-2" />
						Excluir
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	)
}
