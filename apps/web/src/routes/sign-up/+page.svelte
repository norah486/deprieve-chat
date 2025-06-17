<script lang="ts">
	import type { PageData } from './$types';
	import { authClient } from '@web/lib/auth-client';

	async function signUp() {
		const { data, error } = await authClient.signUp.email(
			{
				email: 'test@example.com', // user email address
				password: '12345678', // user password -> min 8 characters by default
				name: 'My Name' // user display name
				// image, // User image URL (optional)
				// callbackURL: '/dashboard' // A URL to redirect to after the user verifies their email (optional)
			},
			{
				onRequest: (ctx) => {
					//show loading
					console.log('requesting');
				},
				onSuccess: (ctx) => {
					//redirect to the dashboard or sign in page
					console.log(data);
				},
				onError: (ctx) => {
					// display the error message
					alert(ctx.error.message);
				}
			}
		);
	}
</script>

<button onclick={signUp}>Sign Up Now</button>
