'use client'

import NavButton from '@/components/nav-button'
import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useMedia } from 'react-use'

const routes = [
	{
		href: '/',
		label: 'Dashboard',
	},
	{
		href: '/transactions',
		label: 'Transações',
	},
	{
		href: '/expenses',
		label: 'Despesas',
	},
	{
		href: '/incomes',
		label: 'Receitas',
	},
	{
		href: '/accounts',
		label: 'Contas',
	},
	{
		href: '/categories',
		label: 'Categorias',
	},
	// {
	// 	href: '/settings',
	// 	label: 'Configurações',
	// },
]

const Navigation = () => {
	const [isOpen, setIsOpen] = useState(false)

	const router = useRouter()
	const pathName = usePathname()
	const isMobile = useMedia('(max-width: 1024px)', false)

	const onClick = (href: string) => {
		router.push(href)
		setIsOpen(false)
	}

	if (isMobile) {
		return (
			<Sheet open={isOpen} onOpenChange={setIsOpen}>
				<SheetTrigger asChild>
					<Button
						variant="outline"
						size="sm"
						className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition"
					>
						<Menu className="size-4" />
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="px-2">
					<SheetHeader>
						<SheetTitle />
						<SheetDescription />
					</SheetHeader>
					<nav className="flex flex-col gap-y-2 pt-6">
						{routes.map((route) => (
							<Button
								key={route.href}
								variant={route.href === pathName ? 'secondary' : 'ghost'}
								onClick={() => onClick(route.href)}
								className="w-full justify-start"
							>
								{route.label}
							</Button>
						))}
					</nav>
				</SheetContent>
			</Sheet>
		)
	}

	return (
		<nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
			{routes.map((route) => (
				<NavButton
					key={route.href}
					href={route.href}
					label={route.label}
					isActive={pathName === route.href}
				/>
			))}
		</nav>
	)
}

export default Navigation
