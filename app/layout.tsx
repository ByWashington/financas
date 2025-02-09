import { ptBR } from '@clerk/localizations'
import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'

import './globals.css'
import { QueryProvider } from '@/providers/query-provider'
import SheetProvider from '@/providers/sheet-provider'

import { Toaster } from '@/components/ui/sonner'

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
		<ClerkProvider localization={ptBR}>
			<html lang="pt">
				<body className={`${poppinsFont.variable}`} suppressHydrationWarning>
					<QueryProvider>
						<SheetProvider />
						<Toaster />
						{children}
					</QueryProvider>
				</body>
			</html>
		</ClerkProvider>
	)
}
