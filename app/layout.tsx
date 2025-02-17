import { ptBR } from '@clerk/localizations'
import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'

import './globals.css'
import { QueryProvider } from '@/providers/query-provider'
import SheetProvider from '@/providers/sheet-provider'

import { Toaster } from '@/components/ui/sonner'
import { Suspense } from 'react'

const poppinsFont = Poppins({
	weight: '400',
	subsets: ['latin'],
	variable: '--font-poppins',
})

export const metadata: Metadata = {
	title: 'Minhas finanças',
	description:
		'Minhas finanças é um webapp onde é possível acompanhar todo as suas finanças',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ClerkProvider localization={ptBR} waitlistUrl="/waitlist">
			<html lang="pt">
				<body className={`${poppinsFont.variable}`} suppressHydrationWarning>
					<Suspense>
						<QueryProvider>
							<SheetProvider />
							<Toaster />
							{children}
						</QueryProvider>
					</Suspense>
				</body>
			</html>
		</ClerkProvider>
	)
}
