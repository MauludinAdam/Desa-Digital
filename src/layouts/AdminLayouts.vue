<script setup>
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
</script>

<template>
  <div
    class="page-wrapper"
    id="main-wrapper"
    data-layout="vertical"
    data-navbarbg="skin6"
    data-sidebartype="full"
    data-sidebar-position="fixed"
    data-header-position="fixed"
  >
    <!-- Sidebar Start -->
    <Sidebar />
    <!--  Sidebar End -->
    <!--  Main wrapper -->
    <div class="body-wrapper">
      <!--  Header Start -->
      <Navbar />
      <!--  Header End -->
      <div class="container-fluid">
        <main class="main-content">
          <RouterView />
        </main>

        <!-- Footer Starts -->
        <Footer />
        <!-- Footer Ends -->
      </div>
    </div>
  </div>
</template>

<style scoped></style>
