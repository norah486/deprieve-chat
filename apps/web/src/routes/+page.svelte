<script lang="ts">
	import { api } from '@libs';
	import { onMount, tick } from 'svelte';
	import type { Post } from 'apps/api/generated/prisma';

	let posts: Post[] = $state([]);
	let scrollbarDiv: HTMLDivElement | undefined = $state();

	onMount(async () => {
		const log = await api.chat.get({ query: {} });

		if (log.data) posts = log.data;

		const chat = api.chat.subscribe();

		chat.subscribe(async (message) => {
			if (scrollbarDiv) {
				const top = scrollbarDiv.scrollTop;
				const scrollHeight = scrollbarDiv.scrollHeight;
				posts.unshift(message.data);
				await tick().then(() => {
					if (scrollbarDiv && top !== 0)
						scrollbarDiv.scrollTop = top + scrollbarDiv.scrollHeight - scrollHeight;
				});
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
<br />
<br />

<div
	class="ml-36 flex max-h-96 max-w-96 flex-col overflow-visible overflow-y-scroll"
	bind:this={scrollbarDiv}
>
	<ul>
		{#each posts as post}
			<li>- {JSON.stringify(post.message)}</li>
		{/each}
	</ul>
</div>
