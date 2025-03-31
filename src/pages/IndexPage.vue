<template>
  <q-page class="q-pa-md flex flex-center column">
    <q-card class="q-mb-lg" bordered>
      <q-card-section class="text-h6">
        👋🏼 Olá, {{ usuario.first_name }}!
      </q-card-section>
      <q-card-section class="text-subtitle2">
        Chat ID: {{ usuario.chat_id }}
      </q-card-section>
      <q-card-section class="text-subtitle2">
        Criado em: {{ usuario.createdAt }}
      </q-card-section>
    </q-card>
    <div v-for="carteira in carteiras" :key="carteira.id" class="wallet-card relative">
        <div class="wallet-header w100 justify-between q-px-md">
          <img :src="carteira.icone" alt="Ícone Moeda" class="wallet-icon">
          <span class="wallet-name text-h5">{{ carteira.moeda }}</span>
        </div>
        <div class="wallet-balance" v-if="carteira.saldo > 0">
          <span class="balance">{{ carteira.saldo }}</span>
        </div>
      </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const router = useRouter();

onBeforeMount(() => {
  const user = localStorage.getItem('user');
  if (!user) {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'Você não está logado. Faça login para continuar.',
      icon: 'report_problem'
    });
    router.push('/');
  }
});

const usuario = ref({
  first_name: 'Samuel Victor',
  chat_id: 123456789,
  createdAt: '27/03/2025 12:00',
})

const carteiras = ref([
  { id: 1, moeda: 'Total', saldo: 12543.23, icone: 'https://static.vecteezy.com/ti/vetor-gratis/p1/14022367-icone-de-de-logotipo-de-saco-de-dinheiro-um-saco-de-dinheiro-preto-e-branco-com-cifrao-vetor.jpg'},
  { id: 2, moeda: 'BTC', saldo: 0.030870, saldoBrl: 5000, icone: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png'},
  { id: 3, moeda: 'ETH', saldo: 0, saldoBrl: 0, icone: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9MoxYn2yoPOlth1JLi7-5AbW-IQtcxz6y9w&s' },
  { id: 4, moeda: 'USDT', saldo: 2, saldoBrl: 12.32, icone: 'https://www.creativefabrica.com/wp-content/uploads/2021/06/14/Cryptocurrency-Tether-Usdt-Logo-Graphics-13393983-1.jpg' }
]);
</script>

<style scoped>
.wallet-card {
  width: 100%;
  max-width: 400px;
  background: linear-gradient(to bottom, #1C0000, #440000); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.519);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  text-align: center;
}
.wallet-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.wallet-icon {
  width: 60px;
  border-radius: 100%;
  border-bottom: 4px solid #440000;
  height: 60px;
}
.wallet-name {
  font-size: 2em;
  font-weight: bold;
}
.wallet-balance {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 10px;
  align-items: center;
}
.balance {
  font-size: 1.5em;
  font-weight: bold;
}
.balance-brl {
  font-size: 1em;
  color: #ddd;
}
.q-page {
  background: #efefef;
  min-height: 100vh;
}
</style>