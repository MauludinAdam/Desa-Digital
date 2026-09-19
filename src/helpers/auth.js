import { computed, ref } from "vue";
import { getMe } from "@/services/UserService";

const user = ref(null);

const fetchUser = async () => {
    try {
        const response = await getMe();

        user.value = response.data.data;

        console.log('USER:', user.value);
        console.log('ROLE:', user.value?.role);

        console.log(user.value);
        
    } catch (error) {
        console.log(error)
    }
};

const isAdmin = computed(() => {
    return user.value?.role?.name === 'Admin';
});

const isHeadman = computed(() => {
    return user.value?.role?.name === 'Kepala Desa';
});

const isOperator = computed(() => {
    return user.value?.role?.name === 'Operator'
})

export const useAuth = () => {
    return {
        user, fetchUser, isAdmin, isHeadman, isOperator
    };
};
