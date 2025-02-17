'use client'

import { ClerkLoaded, ClerkLoading, SignIn } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function Page() {
	return (
		<div className="min-w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
			<div className="h-full flex-col lg:flex  items-center justify-center px-4">
				<div className="h-full flex flex-col text-center space-y-4 pt-16 justify-center items-center">
					<ClerkLoading>
						<Loader2 className="animate-spin text-muted-foreground" />
					</ClerkLoading>
					<ClerkLoaded>
						<h1 className="font-bold text-3xl text-[#2E2A47]">
							Bem vindo de volta
						</h1>
						<p className="text-base text-[#7E8CA0]">
							Entre ou crie uma conta para acessar o Dashboard
						</p>
						<SignIn />
					</ClerkLoaded>
				</div>
			</div>
			<div className="w-full h-full bg-green-300 hidden lg:flex items-center justify-center">
				<Image src={'/logo.svg'} height={100} width={100} alt="logo" />
			</div>
		</div>
	)
}
