<script setup>
import BaseSkeleton from './BaseSkeleton.vue';

defineProps({
    rows: {
        type: Number,
        default: 5,
    },
    columns: {
        type: Number,
        default: 5,
    },
});
</script>

<template>
    <table class="table">
        <tbody>
            <tr v-for="row in rows" :key="row">
                <td v-for="col in columns" :key="col">
                    <BaseSkeleton height="18px" />
                </td>
            </tr>
        </tbody>
    </table>
</template>