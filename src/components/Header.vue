<script setup>
import { getMe } from '@/services/UserService';
import { ref, computed, onMounted } from 'vue';

console.log('🔥 HEADER YANG INI TERLOAD');

const user = ref(null);

const isAdmin = computed(() => {
    return user.value?.role?.name === 'Admin';
})

const isHeadman = computed(() => {
    return user.value?.role?.name === 'Kepala Desa';
})

const isOperator = computed(() => {
    return user.value?.role?.name === 'Operator';
})

const fetchUser = async() => {
    try {
        const response = await getMe();

        user.value = response.data.data;

    } catch (error) {
        console.log(error);
    }
}

onMounted(() =>{
    fetchUser();
})

</script>

<template>
    <div class="logo-header" style="background-color: linear-gradient(
            rgba(20, 83, 45, 0.92),
            rgba(20, 83, 45, 0.92)
        );">
        <a v-if="isAdmin || isHeadman" class="logo text-center text-white" style="font-size: 20px;">
            <h3 class="text-danger fw-bold" style="text-decoration: underline;">DESA DIGITAL</h3>
        </a>
        <a v-if="isOperator" class="logo text-center text-white" style="font-size: 20px;">
            <h5 class="text-danger fw-bold" style="text-decoration: underline;">BUMDES LEWOGEKA</h5>
        </a>
        <div class="nav-toggle">
            <button class="btn btn-toggle toggle-sidebar">
                <i class="gg-menu-right"></i>
            </button>
            <button class="btn btn-toggle sidenav-toggler">
                <i class="gg-menu-left"></i>
            </button>
        </div>
        <button class="topbar-toggler more">
            <i class="gg-more-vertical-alt"></i>
        </button>
    </div>
</template>
<style scoped>
.logo-header{
    background: linear-gradient(
            rgba(20, 83, 45, 0.92),
            rgba(20, 83, 45, 0.92)
        ),;
}
</style>