<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';

	import * as Popover from '$lib/components/ui/popover';

	import type { PageData } from './$types';
	import { cn } from '$lib/utils';
	import { buttonVariants } from '$lib/components/ui/button';
	import { CalendarIcon } from 'lucide-svelte';
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import {
		DateFormatter,
		getLocalTimeZone,
		parseDate,
		type DateValue
	} from '@internationalized/date';

	let { data }: { data: PageData } = $props();

	let publishNow: boolean = true;
	let publishDate;

	const df = new DateFormatter('de-DE', {
		dateStyle: 'long'
	});

	let dobValue: DateValue | undefined = publishDate ? parseDate(publishDate) : undefined;
</script>

<div class="space-y-6">
	<div>
		<h3 class="text-lg font-medium">Veröffentlichen</h3>
		<p class="text-muted-foreground text-sm">
			Lege fest, wann der Bericht veröffentlicht werden soll.
		</p>
	</div>
	<Separator class="w-full" />
	<form class="flex flex-col w-full gap-10" action="" method="post">
		<div class="flex flex-row items-center justify-between rounded-lg border p-4">
			<div class="space-y-0.5">
				<Label>Sofort veröffentlichen</Label>
				<p class="text-muted-foreground text-sm">
					Sobald der Bericht gespeichert wird, wird er veröffentlicht.
				</p>
			</div>
			<Switch includeInput bind:checked={publishNow} />
		</div>
		<div class="flex w-full max-w-sm flex-col gap-2">
			<Label for="publishDate">Veröffentlichungsdatum</Label>
			<Popover.Root>
				<Popover.Trigger
					class={cn(
						buttonVariants({ variant: 'outline' }),
						'w-[300px] justify-start text-left font-normal',
						!publishDate && 'text-muted-foreground'
					)}
				>
					<CalendarIcon class="mr-2 h-4 w-4" />
					{publishDate ? df.format(publishDate.toDate(getLocalTimeZone())) : 'Wähle ein Datum'}
				</Popover.Trigger>
				<Popover.Content class="w-auto p-0" align="start">
					<Calendar
						locale="de"
						bind:value={publishDate}
						isDateDisabled={(currDate) => {
							const currDateObj = currDate.toDate(getLocalTimeZone());
							const today = new Date();

							if (currDateObj >= today) return false;

							return true;
						}}
						onValueChange={(value) => {
							if (value === undefined) {
								publishDate = '';
								return;
							}
							publishDate = value.toDate('UTC').toISOString();
						}}
					/>
				</Popover.Content>
				<input hidden bind:value={publishDate} name="publishDate" />
			</Popover.Root>
			<p></p>
		</div>

		<Button type="submit" class="ml-auto w-fit">Speichern</Button>
	</form>
</div>
