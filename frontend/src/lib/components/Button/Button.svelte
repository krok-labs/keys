<script lang="ts">
  function getBackgroundColor() {
    switch (color) {
      case "transparent":
        return "bg-transparent hover:bg-gray-200";

      case "blue":
        return "bg-blue-500 hover:bg-blue-600";
    
      default:
        return "bg-gray-100 hover:bg-gray-200"
    }
  };

  function getTextColor() {
    switch (color) {
      case "blue":
        return "text-white";
      
      default:
        return "text-black";
    }
  }

  let classes = "";

  export let color: "blue" | "gray" | "transparent" = "gray";
  export let icon: any;
  export let text: string;
  export { classes as class };
</script>

<button on:click class="{ classes } {getBackgroundColor()} {getTextColor()} rounded-xl py-3 px-7 flex items-center justify-center gap-2 transition duration-200">
  <svelte:component this={icon} />
  <p>{text}</p>
</button>
