<template>
    <q-layout view="hHh lpR fFf">
        <q-page-container>
            <q-page class="flex flex-center">
                <q-card class="q-ma-xs" style="width: 350px">
                    <q-card-section class="q-pt-none">
                        <div class="text-h5 text-bold text-red-14 text-center q-mt-md">🐦‍🔥 Entrar no Gastail Web</div>
                    </q-card-section>

                    <q-card-section>
                        <q-input outlined v-model="token" label="Token" autofocus color="green">
                            <template v-slot:append>
                                <q-btn flat color="green" icon="content_copy" @click="colarToken" class="q-ml-xs"></q-btn>
                            </template>
                        </q-input>
                    </q-card-section>

                    <q-card-actions vertical class="q-pa-none q-mx-md q-mb-md">
                        <q-btn @click="login" label="Login" color="green" icon-right="login" glossy class="full-width q-mb-xs"></q-btn>
                    </q-card-actions>
                </q-card>
            </q-page>
        </q-page-container>
    </q-layout>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';

const $q = useQuasar()
const token = ref('')
const router = useRouter()

async function login() {
    await api.post('/login', { token: token.value })
        .then((response) => {
                localStorage.setItem('user', JSON.stringify(response.data.user))
                router.push('/app')
                $q.notify({
                    color: 'positive',
                    position: 'top',
                    message: response.data.message,
                    icon: 'login'
                })
        })
        .catch((error) => {
            $q.notify({
                color: 'negative',
                position: 'top',
                message: error.response.data.message,
                icon: 'report_problem'
            })
        })
}

function colarToken() {
    navigator.clipboard.readText()
        .then((text) => {
            token.value = text
        })
        .catch((error) => {
            $q.notify({
                color: 'negative',
                message: 'Failed to copy token',
                icon: 'report_problem'
            })
        })
}

</script>
<style scoped>
.q-page {
    background: #8E0E00;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to top, #1F1C18, #8E0E00);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to top, #1F1C18, #8E0E00); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    
}
</style>