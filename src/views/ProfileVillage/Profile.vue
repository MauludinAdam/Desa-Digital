<script setup>
import { ref, onMounted } from 'vue';
import { getProfileVillage } from '@/services/ProfileVillage';
import { useRoute } from 'vue-router';

const route = useRoute();

const profile = ref([]);

const loading = ref(false);

const getProfile = async () => {
    loading.value = true;

    try {
        const response = await getProfileVillage();
        
        profile.value = response.data.data ?? null;
    } catch (error) {
        console.log(error);
    }finally{
        loading.value = false;
    }
}

onMounted(() => {
    getProfile();
});

</script>

<template>
    <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <div class="card-title"><h5>Profile Desa</h5></div>
                <div class="mx-4">
                    <RouterLink :to="{name: 'profile-edit'}" class="btn text-white" style="background:#2F4F4F;">Edit profile</RouterLink>
                </div>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                            <table class="table">
                                <tbody>
                                    <tr>
                                        <th width="45%">Nama</th>
                                        <td width="5%">:</td>
                                        <td width="100%">{{ profile.name }}</td>
                                    </tr>
                                    <tr>
                                        <th>Kecamatan</th>
                                        <td>:</td>
                                        <td>{{ profile.district }}</td>
                                    </tr>
                                    <tr>
                                        <th>Kabupaten</th>
                                        <td>:</td>
                                        <td>{{ profile.regency }}</td>
                                    </tr>
                                    <tr>
                                        <th>Kepala Desa</th>
                                        <td>:</td>
                                        <td>{{ profile.headman }}</td>
                                    </tr>
                                    <tr>
                                        <th>Total Masayarakat</th>
                                        <td>:</td>
                                        <td>{{ profile.people }} Jiwa</td>
                                    </tr>
                                    <tr>
                                        <th>Total Wilayah</th>
                                        <td>:</td>
                                        <td>{{ profile.total_area }}/ Ha</td>
                                    </tr>
                                </tbody>
                            </table>
                    </div>
                    <div class="col-md-6">
                        <img :src="profile.thumbnail || '/src/assets/images/img-default.jpg'" class="rounded" width="400" height="320" alt="">
                    </div>
                </div>
            </div>
            <div class="mt-2 mx-4">
                <iframe class="rounded" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4820.047651492853!2d123.06682856008065!3d-8.443275861838446!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dac8299c89a6c8d%3A0xb1654f6cc0c492f5!2sLewogeka%2C%20Kec.%20Solor%20Tim.%2C%20Kabupaten%20Flores%20Timur%2C%20Nusa%20Tenggara%20Tim.!5e1!3m2!1sid!2sid!4v1787911825128!5m2!1sid!2sid" width="900" height="500" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
            </div>
        </div>
    </div>
</template>


