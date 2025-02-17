import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Minhas Finanças',
		short_name: 'Minhas Finanças',
		description:
			'Sistema completo para gerenciamento de finanças pessoais, permitindo o cadastro de contas, transações, despesas e receitas',
		start_url: '/',
		display: 'standalone',
		background_color: '#fff',
		theme_color: '#fff',
		icons: [
			{
				src: '/icons/web-app-manifest-192x192.png',
				sizes: '192x192',
				type: 'image/x-icon',
			},
			{
				src: '/icons/web-app-manifest-512x512.png',
				sizes: '512x512',
				type: 'image/x-icon',
			},
		],
	}
}
