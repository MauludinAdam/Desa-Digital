<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import { login, logout } from "@/services/authService";

const router = useRouter();

const form = ref({
  email: "",
  password: "",
});

const message = ref("");
const successMessage = ref("");
const loading = ref(false);
const errors = ref({});

const logoutMessage = localStorage.getItem("logoutMessage");
if (logoutMessage) {
  successMessage.value = logoutMessage;
  localStorage.removeItem("logoutMessage");

  setTimeout(() => {
    successMessage.value = "";
  }, 4000);
}

const submitLogin = async () => {
  loading.value = true;
  message.value = "";
  errors.value = {};

  if (!form.value.email) {
    errors.value.email = ["Email harus diisi"];
  }

  // validasi format email
  if (form.value.email && !form.value.email.includes("@")) {
    errors.value.email = ["Format email tidak valid"];
  }

  if (!form.value.password) {
    errors.value.password = ["password harus diisi"];
  }

  if (form.value.password && form.value.password.length < 8) {
    errors.value.password = ["Password harus terdiri dari 8 karakter"];
  }

  // jika ada error, stop proses login
  if (Object.keys(errors.value).length > 0) {
    loading.value = false;

    return;
  }

  try {
    const response = await login(form.value);

    console.log(response.data);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    router.push("/");
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        message.value = "Email atau password salaha";
      } else if (error.response.status === 500) {
        message.value =
          "Terjadi kesalahan pada server, Silahkan coba lagi nanti.";

        setTimeout(() => {
          message.value = "";
        }, 4000);
      } else {
        message.value = error.response.data.message || "Terjadi kesalahan";

        setTimeout(() => {
          message.value = "";
        }, 4000);
      }
    } else {
      message.value =
        "Tidak dapat terhubung ke server. Periksa koneksi internet!.";

      setTimeout(() => {
        message.value = "";
      }, 4000);
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="col-lg-7 mt-5 py-4 offset-md-3">
    <div class="card shadow login-card">
      <div class="row p-4">
        <div class="col-md-6">
          <img
            src="/assets/images/LG.jpeg"
            class="rounded"
            width="340"
            height="390"
            alt=""
          />
        </div>
        <div class="col-md-6 p-3">
          <h3 class="text-center fw-bold">
            Selamat Datang Di <br />
            Desa Lewogeka Digital
          </h3>

          <p class="text-center text-muted mb-4">Silakan login ke akun Anda</p>
          <div v-if="successMessage" class="alert bg-success text-white">
            <i class="fas fa-check-circle"></i> {{ successMessage }}
          </div>
          <div
            v-if="message"
            class="alert bg-danger alert-dismissable fade show text-white"
          >
            <i class="fas fa-exclamation-triangle me-2"></i>
            {{ message }}
          </div>
          <form @submit.prevent="submitLogin">
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input
                type="email"
                class="form-control"
                :class="{ 'is-invalid': errors.email }"
                v-model="form.email"
                placeholder="enter Your Email"
              />
              <span class="invalid-feedback">{{ errors.email?.[0] }}</span>
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                :class="{ 'is-invalid': errors.password }"
                v-model="form.password"
                placeholder="Masukkan email"
              />
              <span class="invalid-feedback">{{ errors.password?.[0] }}</span>
            </div>
            <button
              type="submit"
              class="btn btn-info w-100"
              :disabled="loading"
            >
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
              {{ loading ? "Loading..." : "login" }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
