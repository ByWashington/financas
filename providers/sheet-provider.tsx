'use client'

import { useMountedState } from 'react-use'

import EditAccountSheet from '@/features/accounts/components/edit-account-sheet'
import NewAccountSheet from '@/features/accounts/components/new-account-sheet'
import EditCategorySheet from '@/features/categories/components/edit-category-sheet'
import NewCategorySheet from '@/features/categories/components/new-category-sheet'
import EditExpenseSheet from '@/features/expenses/components/edit-expense-sheet'
import NewExpenseSheet from '@/features/expenses/components/new-expense-sheet'
import EditTransactionSheet from '@/features/transactions/components/edit-transaction-sheet'
import NewTransactionSheet from '@/features/transactions/components/new-transaction-sheet'
import { useAuth } from '@clerk/nextjs'

const SheetProvider = () => {
	const isMounted = useMountedState()

	if (!isMounted) {
		return null
	}

	const { userId } = useAuth()
	if (!userId) return

	return (
		<>
			<EditAccountSheet />
			<NewAccountSheet />
			<EditCategorySheet />
			<NewCategorySheet />
			<EditTransactionSheet />
			<NewTransactionSheet />
			<EditExpenseSheet />
			<NewExpenseSheet />
		</>
	)
}

export default SheetProvider
