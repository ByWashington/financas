import Image from 'next/image'
import Link from 'next/link'

const HeaderLogo = () => {
	return (
		<Link href={'/'}>
			<div className="items-center hidden lg:flex">
				<Image src={'/logo.svg'} alt="logo" height={28} width={28} />
				<p className="font-semibold text-green-100 text-2xl ml-2.5">Finanças</p>
			</div>
		</Link>
	)
}

export default HeaderLogo
