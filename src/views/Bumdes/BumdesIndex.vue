<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getBumdes } from '@/services/ProfileBumdes';

const route = useRoute();

const bumdes = ref([]);

const loading = ref(false);

const getData = async () => {
    loading.value = true;

    try {
        const response = await getBumdes();

        bumdes.value = response.data.data ?? null;
    } catch (error) {
        console.log(error);
    }finally{
        loading.value = false;
    }
}

onMounted(() => {
    getData();
})

</script>

<template>
    <div class="d-flex align-items-center justify-content-between">
        <div class="fw-bold">
            <h3 class="fw-bold">Profile Bumdes</h3>
        </div>
        <div class="fw-bold">
            <RouterLink :to="{name: 'bumdes-edit'}" class="btn text-white" style="background: #2F4F4F;"> Edit Profile</RouterLink>
        </div>
    </div>

    <div class=" row mt-3 p-3" style="background: #fff;">
        <div class="col-md-4">
            <img :src="bumdes.logo || '/src/assets/images/img-default.jpg'" alt="" class="rounded" width="250" height="250">
        </div>
        <div class="col-md-8 py-2 mt-2">
            <div class="content align-items-center justify-content-center">
                <h3 class="fw-bold">{{ bumdes.name }}</h3>
                <h4 class="fw-bold" style="font-size: 2.5rem;">{{ bumdes.title }}</h4>
                <p>{{ bumdes.description }}.</p>
                <span><i class="fas fa-location-dot text-danger"></i> Desa Lewogeka</span>
                <span class="mx-3"><i class="fas fa-calendar-days"></i> Berdiri Sejak {{ bumdes.established_year }}</span>
            </div>
        </div>
    </div>

    <div class="mt-3 py-4 bg-white">
        <div class="title text-center">
            <h3>Informasi BUMDes</h3>
        </div>
        <div class="content mt-3 p-3">
            <table class="table">
                <tbody>

                    <tr>
                        <th width="20%">Nama Bumdes</th>
                        <td width="5%">:</td>
                        <td>{{ bumdes.name }}</td>
                    </tr>
                    <tr>
                        <th>Nomor Legalitas</th>
                        <td>:</td>
                        <td>{{ bumdes.title }}</td>
                    </tr>
                    <tr>
                        <th>Tahun Berdiri</th>
                        <td>:</td>
                        <td>Berdiri Sejak {{ bumdes.established_year }}</td>
                    </tr>
                    <tr>
                        <th>Alamat</th>
                        <td>:</td>
                        <td>{{ bumdes.address }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

</template>