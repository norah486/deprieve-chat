<script lang="ts">
  import { api } from "@libs";
  import { onMount } from "svelte";

  let data: string | null = $state("");
  onMount(async () => {
    const response = await api.get();
    data = response.data;
  });
</script>

<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read
  the documentation
  <br />
  {data}
</p>
