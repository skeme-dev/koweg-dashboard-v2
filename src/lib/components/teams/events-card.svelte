<script lang="ts">
	import * as Card from '../ui/card/index';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	import Label from '../ui/label/label.svelte';
	import Button from '../ui/button/button.svelte';

	import { Ellipsis } from '../ui/breadcrumb';
	import { Calendar } from '../ui/calendar/index';
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { CirclePlus } from 'lucide-svelte';
	import { sortDates } from '$lib/dates';

	const isDateUnavailable: Calendar.RootProps['isDateUnavailable'] = (date) => {
		return date.day === 17 || date.day === 18;
	};

	let value = $state(today(getLocalTimeZone()));

	const compareToday = today(getLocalTimeZone());

	const monthNames = [
		'Januar',
		'Februar',
		'März',
		'April',
		'Mai',
		'Juni',
		'Juli',
		'August',
		'September',
		'Oktober',
		'November',
		'Dezember'
	];

	function toFormat(d: string) {
		const date = new Date(d);
		// return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'long' });
		return {
			day: date.getDay(),
			month: monthNames[date.getMonth()]
		};
	}

	function sortByDate(arr: any[], dateKey: string, desc: boolean = true) {
		return arr.sort((a, b) => {
			a = new Date(a[dateKey]);
			b = new Date(b[dateKey]);

			return desc ? a.getTime() - b.getTime() : b.getTime() - a.getTime();
		});
	}

	$effect(() => {
		console.log(value);
	});

	let { events } = $props();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Events</Card.Title>
		<Card.Description>Erstelle und verwalte alle Events des Teams</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid gap-10 sm:grid-cols-3">
			<div class="grid gap-3 col-span-2">
				<div class="flex flex-col gap-3">
					{#each sortByDate(events, 'event_start', false) as event}
						{@const formattedDate = toFormat(event.event_start)}
						<ol class="flex gap-3 items-center">
							<div
								class="bg-muted/40 border rounded-lg font-medium w-16 text-sm flex flex-col justify-center py-3 items-center"
							>
								<div class="">{formattedDate.day + 1}.</div>
								<div class="">{formattedDate.month.slice(0, 3)}</div>
							</div>
							<div class="flex flex-1 flex-col gap-2">
								<Label>{event.title}</Label>
								<p class="text-muted-foreground text-sm">{event.description}</p>
							</div>
							<div class="">
								<DropdownMenu.Root>
									<DropdownMenu.Trigger asChild let:builder>
										<Button aria-haspopup="true" size="icon" variant="outline" builders={[builder]}>
											<Ellipsis class="h-4 w-4" />
											<span class="sr-only">Toggle menu</span>
										</Button>
									</DropdownMenu.Trigger>
									<DropdownMenu.Content align="end">
										<DropdownMenu.Label>Aktionen</DropdownMenu.Label>
										<DropdownMenu.Item>Bearbeiten</DropdownMenu.Item>
										<DropdownMenu.Item>Löschen</DropdownMenu.Item>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</div>
						</ol>
					{/each}
				</div>
			</div>
			<div class="grid gap-3">
				<Calendar locale="de" bind:value class="" />
				<Button
					disabled={value.compare(compareToday) < 0}
					variant="outline"
					size="sm"
					class="h-8 gap-1"
				>
					<CirclePlus class="h-3.5 w-3.5" />
					<span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Event hinzufügen </span>
				</Button>
			</div>
		</div>
	</Card.Content>
</Card.Root>
