<script lang="ts">
	import { api } from '@libs';
	import { onMount, tick } from 'svelte';
	import type { Post } from 'apps/api/generated/prisma';
	import { authClient } from '@web/lib/auth-client';

	const session = authClient.useSession();

	let posts: Post[] = $state([]);
	let scrollbarDiv: HTMLDivElement | undefined = $state();
	let noMoreData: boolean = $state(false);

	async function fetchData() {
		if (!scrollbarDiv || noMoreData) return;

		const lowest = posts.reduce((prev, curr) => {
			return curr.createdAt < prev.createdAt ? curr : prev;
		});

		const response = await api.chat.get({ query: { before: lowest.createdAt } });
		if (!response.data || response.data.length === 0) {
			noMoreData = true;
			return;
		}

		const divTop = scrollbarDiv.scrollTop;
		posts.unshift(...response.data.reverse());
		await tick().then(() => {
			if (scrollbarDiv) scrollbarDiv.scrollTop = divTop;
		});
	}

	onMount(async () => {
		const log = await api.chat.get({ query: {} });
		if (log.data) posts = log.data.reverse();

		if (scrollbarDiv) {
			scrollbarDiv.addEventListener('scroll', function () {
				if (scrollbarDiv) {
					if (-(scrollbarDiv.scrollHeight - scrollbarDiv.clientHeight) === scrollbarDiv.scrollTop) {
						fetchData();
					}
				}
			});
		}

		const chat = api.chat.subscribe();

		chat.subscribe(async (message) => {
			if (scrollbarDiv) {
				// const top = scrollbarDiv.scrollTop;
				// const scrollHeight = scrollbarDiv.scrollHeight;
				posts.push(message.data);
				//await tick().then(() => {
				//	if (scrollbarDiv && top !== 0)
				//		scrollbarDiv.scrollTop = top + scrollbarDiv.scrollHeight - scrollHeight;
				//});
			}
		});
	});
</script>

<h1>Welcome to SvelteKit</h1>
<p>
	Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
	<br />
</p>
<br />
<br />
Session: {JSON.stringify($session)}
<br />
<br />
<br />

<div
	class="ml-36 flex max-h-96 max-w-96 flex-col-reverse overflow-visible overflow-y-scroll"
	bind:this={scrollbarDiv}
>
	<ul>
		{#each posts as post}
			<li>- {JSON.stringify(post.message)}</li>
		{/each}
	</ul>
</div>
