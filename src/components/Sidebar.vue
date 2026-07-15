<template>
  <aside class="left-sidebar">
    <!-- Sidebar scroll-->
    <div>
      <div class="brand-logo d-flex align-items-center justify-content-between">
        <a href="./index.html" class="text-nowrap logo-img">
          <i class="fas fa-home fa-2x text-success"></i>
          <span
            class="text-dark mx-2"
            style="font-size: 1.4rem; font-weight: bold"
            >Desa Digital</span
          >
        </a>
        <div
          class="close-btn d-xl-none d-block sidebartoggler cursor-pointer"
          id="sidebarCollapse"
        >
          <i class="ti ti-x fs-8"></i>
        </div>
      </div>
      <!-- Sidebar navigation-->
      <nav class="sidebar-nav scroll-sidebar" data-simplebar="">
        <ul id="sidebarnav">
          <li class="nav-small-cap">
            <i class="ti ti-dots nav-small-cap-icon fs-4"></i>
            <span class="hide-menu">Home</span>
          </li>
          <li class="sidebar-item">
            <RouterLink to="/" class="sidebar-link" aria-expanded="false">
              <span>
                <i class="ti ti-layout-dashboard"></i>
              </span>
              <span class="hide-menu">Dashboard</span>
            </RouterLink>
          </li>
          <li class="nav-small-cap">
            <i class="ti ti-dots nav-small-cap-icon fs-4"></i>
            <span class="hide-menu">Family</span>
          </li>
          <li class="sidebar-item">
            <RouterLink
              to="/head-of-family"
              class="sidebar-link"
              aria-expanded="false"
            >
              <span>
                <i class="fas fa-people-roof"></i>
              </span>
              <span class="hide-menu">Head Of Family</span>
            </RouterLink>
          </li>
          <li class="sidebar-item">
            <a class="sidebar-link" href="./index.html" aria-expanded="false">
              <span>
                <i class="fas fa-users-rectangle"></i>
              </span>
              <span class="hide-menu">Family Member</span>
            </a>
          </li>
        </ul>
      </nav>
      <!-- End Sidebar navigation -->
    </div>
    <!-- End Sidebar scroll-->
  </aside>
</template>
