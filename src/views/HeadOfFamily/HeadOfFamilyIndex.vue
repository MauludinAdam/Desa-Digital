<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { getHeadOfFamilies } from "@/services/headOfFamilyService";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import {
  deleteHeadOfFamily,
  deleteSelectedHeadOfFamily,
} from "@/services/headOfFamilyService.js";

const route = useRoute();

const router = useRouter();

const headOfFamilies = ref([]);

const currentPage = ref(1);
const lastPage = ref(1);
const totalData = ref(0);

const message = ref("");

const selectedItems = ref([]);

onMounted(() => {
  if (route.query.message) {
    message.value = route.query.message;

    setTimeout(() => {
      message.value = "";

      router.replace({
        query: {},
      });
    }, 4000);
  }
});

const perPage = ref(5);

const search = ref("");

const loading = ref(false);

let timeout = null;

const debounceSearch = () => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    currentPage.value = 1;
    getData();
  }, 500);
};

const isSearching = computed(() => {
  return search.value !== "";
});

const getData = async () => {
  try {
    loading.value = true;

    const response = await getHeadOfFamilies({
      page: currentPage.value,
      row_per_page: perPage.value,
      search: search.value || null,
    });

    console.log("FULL RESPONSE:", response.data);
    headOfFamilies.value = response.data.data.data;
    currentPage.value = response.data.data.meta.current_page;
    lastPage.value = response.data.data.meta.last_page;
    totalData.value = response.data.data.meta.total;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

// confirm delete data kepala keluarga menggunakan sweet alert starts
const deleteData = async (id) => {
  // console.log("Delete Diklik", id);
  const result = await Swal.fire({
    title: "Apakah yakin ?",
    text: "Data yang dihapus tidak dapat dikembalikan,",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Ya, Hapus",
    cancelButtonText: "Batal",
  });

  if (!result.isConfirmed) return;

  try {
    await deleteHeadOfFamily(id);

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Data berhasil dihapus",
      showConfirmButton: false,
      timer: 3000,
    });

    getData();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Gagal menghapus data.",
    });

    console.log(error);
  }
};
// confirm delete data kepala keluarga menggunakan sweet alert ends

// confirm delete checkbox all data data kepala keluarga menggunakan sweet alert starts
const toggleAll = (event) => {
  if (event.target.checked) {
    selectedItems.value = headOfFamilies.value.map((item) => item.id);
  } else {
    selectedItems.value = [];
  }
};

const deleteSelected = async () => {
  const result = await Swal.fire({
    title: "Apakah yakin ?",
    text: `Hapus ${selectedItems.value.length} data ini ?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Batal",
  });

  if (!result.isConfirmed) return;

  try {
    await deleteSelectedHeadOfFamily(selectedItems.value);

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Data berhasil dihapus",
      showConfirmButton: false,
      timer: 3000,
    });

    selectedItems.value = [];

    getData();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Ooops...!",
      text: "Gagal menghapus data.",
    });

    console.log(error);
  }
};
// confirm delete checkbox all data data kepala keluarga menggunakan sweet alert ends
const changePage = (page) => {
  if (page < 1 || page > lastPage.value) {
    return;
  }

  currentPage.value = page;

  getData();
};

watch(search, () => {
  debounceSearch();
});

watch(perPage, () => {
  currentPage.value = 1;
  getData();
});

onMounted(() => {
  getData();
});
</script>

<template>
  <!-- <p>{{ route.name?.startsWith("head-of-family") }}</p> -->
  <div class="col-md-12">
    <div class="card">
      <div class="card-header d-flex justify-content-between">
        <div class="card-title"><h5>Data Kepala Keluarga</h5></div>
        <div class="card-tools">
          <span v-if="selectedItems.length > 0" class="btn text-danger ms-3"
            >{{ selectedItems.length }} data dipilih</span
          >
          <button
            v-if="selectedItems.length"
            :disabled="selectedItems.length === 0"
            @click="deleteSelected"
            class="btn btn-danger mx-2"
          >
            <i class="fas fa-trash"></i> Hapus
          </button>
          <RouterLink
            :to="{ name: 'head-of-family-create' }"
            class="btn btn-info"
            ><i class="fas fa-plus"></i> Tambah Data</RouterLink
          >
        </div>
      </div>
      <div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <div class="col-md-3 mb-2 d-flex">
            <label for="" class="me-2">Show:</label>
            <select v-model="perPage" class="form-select" style="width: 80px">
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>
          <div class="col-4 mb-2">
            <input
              type="text"
              v-model="search"
              class="form-control"
              placeholder="Search Here..."
            />
          </div>
        </div>

        <div class="table-responsive table-scroll">
          <div
            v-if="message"
            class="alert alert-success alert-dismissible fade show"
            role="alert"
          >
            <i class="fas fa-check-circle"></i> {{ message }}
          </div>
          <table class="table text-nowrap mb-0 align-middle">
            <thead class="bg-info text-white">
              <tr>
                <th width="40">
                  <input type="checkbox" @change="toggleAll" />
                </th>
                <th width="5%">No</th>
                <th>Picture</th>
                <th>Nama</th>
                <th width="100%">No.Telp</th>
                <th width="100%">Jumlah Keluarga</th>
                <th width="50%" class="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="10" class="text-center py-4">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <p class="mt-2">Memuat data...</p>
                </td>
              </tr>
              <tr
                v-else-if="headOfFamilies.length > 0"
                v-for="(item, index) in headOfFamilies"
                :key="item.id"
              >
                <td>
                  <input
                    type="checkbox"
                    v-model="selectedItems"
                    :value="item.id"
                  />
                </td>
                <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
                <td>
                  <img
                    :src="item.profile_picture || '/assets/images/default.jpg'"
                    width="50"
                    height="50"
                    class="rounded-circle"
                    alt=""
                  />
                </td>
                <td>{{ item.user.name }}</td>
                <td>{{ item.phone_number }}</td>
                <td class="text-center">
                  <span class="badge badge-primary"
                    ><i class="fas fa-user-group"></i>
                    {{ item.family_members.length }} Orang</span
                  >
                </td>
                <td width="30%" class="d-flex gap-2">
                  <RouterLink
                    :to="{
                      name: 'head-of-family.detail',
                      params: { id: item.id },
                    }"
                    class="btn btn-info btn-sm"
                    ><i class="fas fa-eye"></i
                  ></RouterLink>
                  <RouterLink
                    :to="{
                      name: 'head-of-family.edit',
                      params: { id: item.id },
                    }"
                    class="btn btn-warning btn-sm"
                    ><i class="fas fa-pen-square"></i
                  ></RouterLink>
                  <button
                    @click="deleteData(item.id)"
                    class="btn btn-danger btn-sm"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-else>
                <td colspan="10" class="text-center">
                  {{ isSearching ? "Data Tidak Ditemukan" : "Data Kosong!" }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="d-flex align-items-center justify-content-between mt-2">
          <div class="total">
            <p>Halaman {{ currentPage }} dari {{ lastPage }}</p>
          </div>
          <div class="currentPage">
            <nav aria-label="Page navigation example">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button
                    class="page-link"
                    @click="changePage(currentPage - 1)"
                  >
                    Previous
                  </button>
                </li>
                <li
                  v-for="page in lastPage"
                  :key="page"
                  class="page-item"
                  :class="{ active: currentPage === page }"
                >
                  <button class="page-link" @click="changePage(page)">
                    {{ page }}
                  </button>
                </li>
                <li
                  class="page-item"
                  :class="{ disabled: currentPage === lastPage }"
                >
                  <button
                    class="page-link"
                    @click="changePage(currentPage + 1)"
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-scroll {
  overflow-y: auto;
}
</style>
