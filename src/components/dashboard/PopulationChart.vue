<script setup>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'vue-chartjs';

ChartJS.register(
    ArcElement, Tooltip, Legend
);

const chartOptions = {
    responsive: true,
    maintainAspectRation: false
};

</script>

<template>
<div style="height: 300px;">
    <Doughnut :data="chartData" :options="chartOptions" />
</div>

</template>