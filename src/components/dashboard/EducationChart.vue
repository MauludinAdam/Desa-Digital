<script setup>
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, plugins, Title, Tooltip } from 'chart.js';
import { Bar } from 'vue-chartjs';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
);

const ChartData = {
    Labels: [
        'SD', 'SMP','SMA','D3','S1','S2',
    ],

    datasets: [
        {
            label: 'Jumlah Penduduk', data: [450, 320, 580, 120, 350, 45],
        }
    ]
}

const ChartOptions = {
    responsive: true,
    maintainAspectRation: false,

    plugins: {
        legend: {
            display: false,
        },
    },
},

</script>

<template>
    <div style="height: 300px;">
        <Bar :data="ChartData" :options="ChartOptions" />
    </div>

</template>