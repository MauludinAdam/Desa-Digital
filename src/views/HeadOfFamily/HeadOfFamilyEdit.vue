<script setup>
import {
  updateHeadOfFamily,
  getHeadOfFamily,
} from "@/services/headOfFamilyService";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "@/utils/swal";

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const message = ref("");

const form = ref({
  name: "",
  identity_number: "",
  gender: "",
  date_birth: "",
  phone_number: "",
  occupation: "",
  marital_status: "",
  profile_picture: null,
});

const previewImage = ref("");
const errors = ref({});

const getData = async () => {
  try {
    const response = await getHeadOfFamily(route.params.id);
    console.log(response.data.data);
    console.log(response.data.data.profile_picture);

    const data = response.data.data;

    form.value.name = data.user.name;
    form.value.email = data.user.email;
    form.value.password = data.user.password;
    form.value.identity_number = data.identity_number;
    form.value.gender = data.gender;
    form.value.date_birth = data.date_birth;
    form.value.phone_number = data.phone_number;
    form.value.occupation = data.occupation;
    form.value.marital_status = data.marital_status;
    previewImage.value = data.profile_picture;
  } catch (error) {
    console.log(error);
  }
};

const handleFile = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  form.value.profile_picture = file;

  // Hapus preview lama kalo ada
  if (previewImage.value?.startsWith("blob:")) {
    URL.revokeObjectURL(previewImage.value);
  }

  // Preview gambar baru
  previewImage.value = URL.createObjectURL(file);
};

const updateData = async () => {
  loading.value = true;
  message.value = "";
  errors.value = {};

  if (!form.value.name) {
    errors.value.name = ["Nama Harus Diisi"];
  }

  if (!form.value.identity_number) {
    errors.value.identity_number = ["NIK Harus Diisi"];
  }

  try {
    const formData = new FormData();

    formData.append("name", form.value.name);
    formData.append("email", form.value.email);
    formData.append("password", form.value.password);
    formData.append("identity_number", form.value.identity_number);
    formData.append("gender", form.value.gender);
    formData.append("date_birth", form.value.date_birth);
    formData.append("phone_number", form.value.phone_number);
    formData.append("occupation", form.value.occupation);
    formData.append("marital_status", form.value.marital_status);

    if (form.value.profile_picture instanceof File) {
      formData.append("profile_picture", form.value.profile_picture);
    }

    formData.append("_method", "PUT");

    await updateHeadOfFamily(route.params.id, formData);

    toast("success", "Data kepala keluarga berhasil diupdate!");
    router.push({
      name: "head-of-family",
    });
  } catch (error) {
    if (errors.response?.status === 422) {
      toast("error", "Periksa kembali data yang diinput");

      errors.value = error.response.data.errors;
    }

    console.log(error);
  }
};

onMounted(() => {
  getData();
});
</script>

<template>
  <div class="col-md-12">
    <div class="card">
      <div class="card-header d-flex justify-content-between">
        <div class="card-title"><h6>Edit Data kepala Keluarga</h6></div>
        <div class="card-tools"></div>
      </div>
      <div class="card-body">
        <form @submit.prevent="updateData">
          <div class="row">
            <div class="border rounded p-3">
              <h5 class="mb-4 text-center">
                <i class="fas fa-id-card"></i> Data Pribadi
              </h5>
              <div class="row">
                <div class="col-md-4">
                  <img
                    v-if="previewImage"
                    :src="previewImage"
                    class="rounded img-fluid"
                    width="260"
                    height="260"
                    alt=""
                  />
                  <div class="form-group mt-4">
                    <label for="">Ganti Foto</label>
                    <input
                      type="file"
                      class="form-control"
                      @change="handleFile"
                    />
                  </div>
                </div>
                <div class="col-md-8">
                  <div class="row">
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label for="">Nama</label>
                          <input
                            type="text"
                            v-model="form.name"
                            class="form-control"
                            :class="{ 'is-invalid': errors.name }"
                            placeholder=""
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
                          />
                          <small
                            class="text-danger"
                            v-if="errors.identity_number"
                            >{{ errors.identity_number[0] }}</small
                          >
                        </div>
                        <div class="form-group">
                          <label for="">Jenis kelamin</label>
                          <select
                            v-model="form.gender"
                            class="form-control"
                            :class="{ 'is-invalid': errors.gender }"
                          >
                            <option value="">
                              --- Pilih Jenis Kelamin ---
                            </option>
                            <option value="male">Laki-Laki</option>
                            <option value="female">Perempuan</option>
                          </select>
                          <small class="text-danger" v-if="errors.gender">{{
                            errors.gender[0]
                          }}</small>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label for="">Tgl Lahir</label>
                          <input
                            type="date"
                            v-model="form.date_birth"
                            class="form-control"
                            :class="{ 'is-invalid': errors.date_birth }"
                          />
                          <small class="text-danger" v-if="errors.date_birth">{{
                            errors.date_birth
                          }}</small>
                        </div>
                        <div class="form-group">
                          <label for="">No.Telp</label>
                          <input
                            v-model="form.phone_number"
                            type="number"
                            class="form-control"
                            :class="{ 'is-invalid': errors.phone_number }"
                          />
                          <small
                            class="text-danger"
                            v-if="errors.phone_number"
                            >{{ errors.phone_number }}</small
                          >
                        </div>
                        <div class="form-group">
                          <label for="">Pekerjaan</label>
                          <input
                            v-model="form.occupation"
                            type="text"
                            class="form-control"
                            :class="{ 'is-invalid': errors.occupation }"
                          />
                          <small class="text-danger" v-if="errors.occupation">{{
                            errors.occupation[0]
                          }}</small>
                        </div>
                      </div>
                      <div class="form-group">
                        <label for="">Status Perkawinan</label>
                        <select
                          v-model="form.marital_status"
                          class="form-control"
                          :class="{ 'is-invalid': errors.marital_status }"
                        >
                          <option value="">--- Pilih Status Perkawinan</option>
                          <option value="married">Menikah</option>
                          <option value="single">Belum Menikah</option>
                        </select>
                        <small
                          class="text-danger"
                          v-if="errors.marital_status"
                          >{{ errors.marital_status[0] }}</small
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="border rounded p-3 mt-3">
              <h5 class="mb-4">
                <i class="fas fa-user-lock me-2"></i> Data Akun
              </h5>
              <div class="form-group">
                <label for="">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': errors.email }"
                />
              </div>
              <div class="form-group">
                <label for="">Password</label>
                <input
                  v-model="form.password"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': errors.password }"
                  placeholder="Kosongkan jika tidak ingin diubah.."
                />
                <small class="text-danger" v-if="errors.password">{{
                  errors.password[0]
                }}</small>
              </div>
            </div>
            <div class="d-flex gap-2 mt-4">
              <RouterLink
                :to="{ name: 'head-of-family' }"
                class="btn btn-warning"
                ><i class="fas fa-arrow-left"></i> Kembali</RouterLink
              >
              <button
                @click="updateData"
                class="btn btn-primary"
                :disabled="loading"
              >
                <i class="fas fa-paper-plane"></i>
                {{ loading ? "Prosess Update..." : "Update" }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
