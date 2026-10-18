<script setup>
import Footer from '@/components/Footer.vue';
import Navbar from '@/components/Navbar.vue';
import Sidebar from '@/components/sidebar.vue';
import { getMe } from '@/services/UserService';
import { ref, computed, onMounted } from 'vue';

const user = ref(null);

const userData = localStorage.getItem('user')
if(userData){
  user.value = JSON.parse(userData)
}

const fetchUser = async () => {
  try {
    const response = await getMe();

    user.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
}
const isAdmin = computed(() => {
  return user.value?.role?.name === 'Admin'; 
});

const isOperator = computed(() => {
  return user.value?.role?.name === 'Operator';
});

onMounted(() => {
  fetchUser();
})
</script>

<template>
    
   <div class="wrapper">
      <!-- Sidebar -->
      <Sidebar />
      <!-- End Sidebar -->

      <div class="main-panel">
        <div class="main-header">
          <div class="main-header-logo">
            <!-- Logo Header -->
            <div class="logo-header" data-background-color="dark">
              <a href="index.html" class="logo">
                <div v-if="isAdmin">
                  <h4 class="text-danger fw-bold text-decoration-underline">Desa Digital</h4>
                </div>
                <div v-if="isOperator">
                  <h4 class="text-danger fw-bold text-decoration-underline">BUMDES LEWOGEKA</h4>
                </div>
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
            <!-- End Logo Header -->
          </div>
          <!-- Navbar Header -->
        <Navbar/>
          <!-- End Navbar -->
        </div>

        <div class="container">
           <div class="page-inner">
            
          <RouterView/>

           </div>
        </div>

        <!-- Footer Starts -->
<Footer/>
        <!-- Footer ends -->
        
      </div>
   </div>
</template>