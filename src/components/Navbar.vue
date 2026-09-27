<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { logout as logoutService } from '@/services/authService';


const router = useRouter();

const user = ref(null);
const userData = localStorage.getItem('user')
if(userData){
    user.value = JSON.parse(userData)
}

const logout = async () => {
    try {
        await logoutService();
    } catch (error) {
        console.log('Logout api error:', error);
    }finally{
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        localStorage.setItem("logoutMessage", "Anda berhasil logout");

        router.push("/login");
    }
}


</script>


<template>
    <nav class="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom">
        <div class="container-fluid">
            <ul class="navbar-nav topbar-nav ms-md-auto align-items-center">
               
                <li class="nav-item topbar-user dropdown hidden-caret">
                    <a class="dropdown-toggle profile-pic" data-bs-toggle="dropdown" href="#" aria-expanded="false">
                        <div class="avatar-sm">
                            <img src="/assets/img/profile.jpg" alt="..." class="avatar-img rounded-circle" />
                        </div>
                        <span class="profile-username">
                            <span class="fw-bold">{{ user.name }}</span><br>
                            <small class="text-muted mx-2">{{ user.role?.name }}</small>
                        </span>
                    </a>
                    <ul class="dropdown-menu dropdown-user animated fadeIn">
                        <div class="dropdown-user-scroll scrollbar-outer">
                            <li>
                                <div class="user-box">
                                    <div class="avatar-lg">
                                        <img src="/assets/img/profile.jpg" alt="image profile"
                                            class="avatar-img rounded" />
                                    </div>
                                    <div class="u-text">
                                        <h4>{{ user.name }}</h4>
                                        <p class="text-muted">{{ user.email }}</p>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="dropdown-divider"></div>
                                <RouterLink :to="{name: 'profile-user'}" class="dropdown-item"><i class="fas fa-user"></i> Profile Saya</RouterLink>
                                <div class="dropdown-divider"></div>
                                <button class="dropdown-item" @click.prevent="logout"><i class="fas fa-sign-out-alt"></i> Logout</button>
                            </li>
                        </div>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>
</template>