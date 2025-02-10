'use client'

import { useMountedState } from 'react-use'

import EditAccountSheet from '@/features/accounts/components/edit-account-sheet'
import NewAccountSheet from '@/features/accounts/components/new-account-sheet'
import EditTransactionSheet from '@/features/transactions/components/edit-transaction-sheet'
import NewTransactionSheet from '@/features/transactions/components/new-transaction-sheet'

const SheetProvider = () => {
	const isMounted = useMountedState()

	if (!isMounted) {
		return null
	}

	return (
		<>
			<EditAccountSheet />
			<NewAccountSheet />
			<EditTransactionSheet />
			<NewTransactionSheet />
		</>
	)
}

export default SheetProvider
