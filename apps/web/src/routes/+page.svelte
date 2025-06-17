<script lang="ts">
	import { api } from '@libs';
	import { onMount, tick } from 'svelte';
	import type { Post, User } from 'apps/api/generated/prisma';
	import { authClient } from '@web/lib/auth-client';

	const session = authClient.useSession();

	type PostWithUser = Post & { user: User };
	let posts: PostWithUser[] = $state([]);
	let scrollbarDiv: HTMLDivElement | undefined = $state();
	let noMoreData: boolean = $state(false);
	let message: string = $state('');

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
				posts.push(message.data);
			}
		});
	});

	async function sendMessage() {
		await api.chat.post({
			message: message
		});
		message = '';
	}
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
			<li><b class="font-bold">{post.user.name}</b>: {post.message}</li>
		{/each}
	</ul>
</div>

<br />

<input class="border border-black p-2 ml-36" bind:value={message} placeholder="type a message" />
<button class="hover:cursor-pointer bg-blue-400 p-2 rounded-lg" onclick={sendMessage}>
	Send Message
</button>
