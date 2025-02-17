import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'
import type { SelectSingleEventHandler } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

type Props = {
	value?: Date
	onChange: SelectSingleEventHandler
	disabled?: boolean
	placeholder?: string
}

export const DatePicker = ({
	value,
	onChange,
	disabled,
	placeholder,
}: Props) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					disabled={disabled}
					variant="outline"
					className={cn(
						'w-full justify-start text-left font-normal',
						!value && 'text-muted-foreground',
					)}
				>
					<CalendarIcon className="size-4 mr-2" />
					{value ? (
						format(value, 'dd/MM/yyyy')
					) : (
						<span>{placeholder ?? 'Selecione uma data'}</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<Calendar
					mode="single"
					selected={value}
					onSelect={onChange}
					disabled={disabled}
					locale={ptBR}
				/>
			</PopoverContent>
		</Popover>
	)
}
