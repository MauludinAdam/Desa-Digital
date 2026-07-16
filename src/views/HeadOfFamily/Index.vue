<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { getHeadOfFamilies } from "@/services/headOfFamilyService";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";

const route = useRoute();

const router = useRouter();

const headOfFamilies = ref([]);

const currentPage = ref(1);
const lastPage = ref(1);
const totalData = ref(0);

const message = ref("");

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
  <div class="col-md-12">
    <div class="card">
      <div class="card-header d-flex justify-content-between">
        <div class="card-title"><h5>Data kepala keluarga</h5></div>
        <div class="card-tools">
          <RouterLink
            :to="{ name: 'head-of-family-create' }"
            class="btn btn-info"
            ><i class="fas fa-plus"></i> Tambah Data</RouterLink
          >
        </div>
      </div>
      <div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <div class="col-md-3 mb-3 d-flex">
            <label for="" class="me-2">Show:</label>
            <select v-model="perPage" class="form-select" style="width: 80px">
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>
          <div class="col-4">
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
                <th width="5%">No</th>
                <th>Picture</th>
                <th>Nama</th>
                <th>NIK</th>
                <th width="100%">No.Telp</th>
                <th width="100%">Jumlah Keluarga</th>
                <th width="50%" class="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="10" class="text-center">Loading...</td>
              </tr>
              <tr
                v-else-if="headOfFamilies.length > 0"
                v-for="(item, index) in headOfFamilies"
                :key="item.id"
              >
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
                <td>{{ item.identity_number }}</td>
                <td>{{ item.phone_number }}</td>
                <td class="text-center">
                  <span class="badge badge-primary"
                    ><i class="fas fa-users"></i> ({{
                      item.family_members.length
                    }}) Orang</span
                  >
                </td>
                <td width="30%" class="d-flex gap-2">
                  <a href="" class="btn btn-info btn-sm"
                    ><i class="fas fa-eye"></i
                  ></a>
                  <a href="" class="btn btn-warning btn-sm"
                    ><i class="fas fa-pen-square"></i
                  ></a>
                  <a href="" class="btn btn-danger btn-sm"
                    ><i class="fas fa-trash"></i
                  ></a>
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
