<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { createHeadOfFamily } from "@/services/headOfFamilyService";

const router = useRouter();

const loading = ref(false);
const errors = ref({});
const message = ref("");

const form = ref({
  name: "",
  email: "",
  password: "",
  identity_number: "",
  gender: "",
  date_birth: "",
  phone_number: "",
  occupation: "",
  marital_status: "",
  profile_picture: "",
});

// Handle Upload Foto
const handleFile = (event) => {
  form.value.profile_picture = event.target.files[0];
};

const genders = [
  { value: "male", label: "Laki-Laki" },
  { value: "female", label: "Perempuan" },
];

const maritalStatuses = [
  { value: "single", label: "Belum Menikah" },
  { value: "married", label: "Menikah" },
];

// Simpan data
const saveData = async () => {
  loading.value = true;
  errors.value = {};
  message.value = "";

  if (!form.value.name) {
    errors.value.name = ["Nama Harus Diisi"];
  }

  if(!form.value.email) {
    errors.value.email = ["Email Harus Diisi"];
  }

  if(!form.value.password) {
    errors.value.password = ["Password Harus Diisi"];
  }

  if (!form.value.identity_number) {
    errors.value.identity_number = ["NIK Harus Diisi"];
  }

  if (!form.value.gender) {
    errors.value.gender = ["Jenis Kelamin Harus Diisi"];
  }

  if (!form.value.date_birth) {
    errors.value.date_birth = ["Tanggal Lahir Harus Diisi"];
  }

  if (!form.value.phone_number) {
    errors.value.phone_number = ["No.Telp Harus Diisi"];
  }

  if (!form.value.occupation) {
    errors.value.occupation = ["Pekerjaan Harus Diisi"];
  }

  if (!form.value.marital_status) {
    errors.value.marital_status = ["Status Perkawinan Harus Diisi"];
  }

  try {
    const formData = new FormData();

    Object.keys(form.value).forEach((key) => {
      formData.append(key, form.value[key]);
    });

    for(let pair of formData.entries()){
      console.log(pair[0], pair[1]);
    }

    await createHeadOfFamily(formData);
    router.push({
      name: "head-of-family",
      query: {
        message: "Data kepala keluarga berhasil ditambahkan"
      }
    });
  } catch (error) {
    console.log(error.response.data);

    if (error.response?.status === 422) {
      errors.value = error.response.data.errors;
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title"><h6>Tambah Data Kepala Keluarga</h6></div>
    </div>
    <div class="card-body">
      <form @submit.prevent="saveData">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="">Name</label>
              <input
                type="text"
                v-model="form.name"
                class="form-control"
                :class="{ 'is-invalid': errors.name }"
                placeholder="Masukan Nama"
              />
              <small class="text-danger" v-if="errors.name">{{
                errors.name[0]
              }}</small>
        </div>
            <div class="form-group">
              <label for="">NIK</label>
              <input
                type="text"
                v-model="form.identity_number"
                class="form-control"
                :class="{ 'is-invalid': errors.identity_number }"
                placeholder="Masukkan NIK"
              />
              <small class="text-danger" v-if="errors.identity_number">{{
                errors.identity_number[0]
              }}</small>
            </div>
            <div class="form-group">
              <label for="">Jenis Kelamin</label>
              <select
                v-model="form.gender"
                class="form-control"
                :class="{ 'is-invalid': errors.gender }"
              >
                <option value="">--- Pilih Jenis kelamin ---</option>
                <option
                  v-for="gender in genders"
                  :key="gender.value"
                  :value="gender.value"
                >
                  {{ gender.label }}
                </option>
              </select>
              <small class="text-danger" v-if="errors.gender">{{
                errors.gender[0]
              }}</small>
            </div>
            <div class="form-group">
              <label for="">Tgl Lahir</label>
              <input
                type="date"
                class="form-control"
                v-model="form.date_birth"
                :class="{ 'is-invalid': errors.date_birth }"
              />
              <small class="text-danger" v-if="errors.date_birth">{{
                errors.date_birth[0]
              }}</small>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="">No.Telp</label>
              <input
                type="text"
                v-model="form.phone_number"
                class="form-control"
                :class="{ 'is-invalid': errors.phone_number }"
                placeholder="Masukkan No.Telp"
              />
              <small class="text-danger" v-if="errors.phone_number">{{
                errors.phone_number[0]
              }}</small>
            </div>
            <div class="form-group">
              <label for="">Pekerjaan</label>
              <input
                type="text"
                v-model="form.occupation"
                class="form-control"
                :class="{ 'is-invalid': errors.occupation }"
                placeholder="Masukkan Pekerjaan"
              />
              <small class="text-danger" v-if="errors.occupation">{{
                errors.occupation[0]
              }}</small>
            </div>
            <div class="form-group">
              <label for="">Status Perkawinan</label>
              <select
                class="form-control"
                v-model="form.marital_status"
                :class="{ 'is-invalid': errors.marital_status }"
              >
                <option value="">--- Pilih Status Perkawinan ---</option>
                <option
                  v-for="status in maritalStatuses"
                  :key="status.value"
                  :value="status.value"
                >
                  {{ status.label }}
                </option>
              </select>
              <small class="text-danger" v-if="errors.marital_status">{{
                errors.marital_status[0]
              }}</small>
            </div>
            <div class="form-group">
              <label for="">Picture</label>
              <input type="file" name="" class="form-control" @change="handleFile" />
            </div>
          </div>
          </div>
        <p>
          -----------------------------------------------------------------------------------------------------------------------------------------
        </p>
        <h4 class="fw-bold mb-3">Data Akun Dashboard</h4 class="fw-bold text-center">
        <div class="form-group">
          <label for="">Email</label>
          <input
            type="email"
            v-model = "form.email"
            class="form-control" :class="{ 'is-invalid' : errors.email}"
            placeholder="Masukkan EMail"
          />
          <small class="text-danger" v-if="errors.email">{{ errors.email[0] }}</small>
        </div>
        <div class="form-group">
          <label for="">Password</label>
          <input
            type="password" v-model="form.password"
            class="form-control" :class="{ 'is-invalid' : errors.password}"
            placeholder="Masukkan Password"
          />
          <small class="text-danger" v-if="errors.password">{{ errors.password[0] }}</small>
        </div>
        <div class="d-flex align-items-center gap-2">
          <RouterLink :to="{ name: 'head-of-family' }" class="btn btn-warning"
            ><i class="fas fa-arrow-left"></i> Kembali</RouterLink
          >
          <button
            @click="saveData"
            type="submit"
            class="btn btn-info"
            :disabled="loading"
          >
            <i class="fas fa-paper-plane"></i>
            {{ loading ? "Menyimpan..." : "Simpan" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
