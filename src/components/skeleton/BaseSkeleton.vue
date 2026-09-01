<script setup>
const props = defineProps({
    width: {
        type: String,
        default: "100%",
    },
    height: {
        type: String,
        default: "20px",
    }
});
</script>

<template>
    <div class="placeholder-glow" :style="{width: props.width, height: props.height}">
        <span class="placeholder w-100 h-100 rounded"></span>
    </div>
</template>