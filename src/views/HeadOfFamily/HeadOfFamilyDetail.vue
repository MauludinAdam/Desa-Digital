<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { detailHeadOfFamily } from "@/services/headOfFamilyService";

const route = useRoute();

const data = ref({ family_members: [] });

const getData = async () => {
  const response = await detailHeadOfFamily(route.params.id);

  data.value = response.data.data;
};

onMounted(() => {
  getData();
});
</script>

<template>
  <div class="container">
    <div class="card">
      <div class="card-header d-flex justify-content-between">
        <div class="card-title"><h5>Detail Kepala Keluarga</h5></div>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-4">
            <img
              :src="data.profile_picture || '/assets/images/default.jpg'"
              class="rounded"
              width="270"
              height="250"
              alt=""
            />
            <div class="card py-2 mt-3 p-3">
              <h5
                class="text-success d-flex align-items-center justify-content-between"
              >
                <span>Jumlah keluarga</span>
                <span><i class="fas fa-user-group"></i></span>
              </h5>
              <div class="mt-2 text-center">
                <h2>
                  {{ data.family_members.length || 0 }}
                </h2>
              </div>
            </div>
          </div>
          <div class="col-md-8">
            <table class="table">
              <tr>
                <th>Nama</th>
                <td>:</td>
                <td>{{ data.user?.name }}</td>
              </tr>
              <tr>
                <th>NIK</th>
                <td>:</td>
                <td>{{ data.identity_number }}</td>
              </tr>
              <tr>
                <th>Jenis Kelamin</th>
                <td>:</td>
                <td>{{ data.gender }}</td>
              </tr>
              <tr>
                <th>No.Telp</th>
                <td>:</td>
                <td>{{ data.phone_number }}</td>
              </tr>
              <tr>
                <th>Pekerjaan</th>
                <td>:</td>
                <td>{{ data.occupation }}</td>
              </tr>
              <tr>
                <th>Status Perkawinan</th>
                <td>:</td>
                <td>{{ data.marital_status }}</td>
              </tr>
              <tr>
                <th>Tgl Lahir</th>
                <td>:</td>
                <td>{{ data.date_birth }}</td>
              </tr>

              <tr>
                <th>Email</th>
                <td>:</td>
                <td>{{ data.user?.email }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
