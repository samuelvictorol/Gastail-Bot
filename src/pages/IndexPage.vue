<template>
  <q-page class="q-pa-md flex flex-center column" v-if="usuario != null">
    <q-card class="q-mb-lg border-bottom" bordered>
      <q-card-section class="text-h5 text-center w100">
        <q-icon name="account_circle" size="2em" class="q-mb-sm" />
        {{ usuario.nome }}
      </q-card-section>
      <q-card-section class="text-subtitle2">
        Chat ID: {{ usuario.chat_id }}
      </q-card-section>
      <q-card-section class="text-subtitle2">
        Criado em: {{ formatarDataHora(usuario.createdAt) }}
      </q-card-section>
    </q-card>
    <div class="w100 text-center q-py-md text-h5 text-bold">
      💰 Carteiras
    </div>
    <div v-if="loading" class="loading row w100 no-wrap justify-center q-gutter-x-sm">
      <q-spinner-dots
      color="orange"
      size="2em"
    />
    <q-spinner-dots
    color="red"
    size="2em"
    />
    <q-spinner-dots
    color="yellow-14"
    size="2em"
    />
    </div>
    <div class="wallet-card-1 relative" v-if="carteiras != null && loading == false">
        <div class="wallet-header w100 justify-between q-px-md">
          <img src="https://static.vecteezy.com/ti/vetor-gratis/p1/14022367-icone-de-de-logotipo-de-saco-de-dinheiro-um-saco-de-dinheiro-preto-e-branco-com-cifrao-vetor.jpg" alt="Ícone Moeda" class="wallet-icon">
          <span class="wallet-name text-h5">Total</span>
        </div>
        <div class="wallet-balance">
          <span class="balance ">{{ carteiras.saldo }}</span>
        </div>
      </div>
    <div class="wallet-card relative" v-if="carteiras != null && loading == false">
        <div class="wallet-header w100 justify-between q-px-md">
          <img src="https://www.creativefabrica.com/wp-content/uploads/2021/06/14/Cryptocurrency-Tether-Usdt-Logo-Graphics-13393983-1.jpg" alt="Ícone Moeda" class="wallet-icon">
          <span class="wallet-name text-h5">Tether</span>
        </div>
        <div class="wallet-balance column ">
          <span class="balance">$ {{ carteiras.usdt }}</span>
        </div>
        <div class="wallet-balance column text-green-14">
          <span class="balance">{{ carteiras.usdtBrl }}</span>
        </div>
      </div>
    <div class="wallet-card relative" v-if="carteiras != null && loading == false">
        <div class="wallet-header w100 justify-between q-px-md">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png" alt="Ícone Moeda" class="wallet-icon">
          <span class="wallet-name text-h5">Bitcoin</span>
        </div>
        <div class="wallet-balance column ">
          <span class="balance">🪙 {{ carteiras.btc.toFixed(6) }}</span>
        </div>
        <div class="wallet-balance column text-green-14">
          <span class="balance">{{ carteiras.btcBrl }}</span>
        </div>
      </div>
    <div class="wallet-card relative" v-if="carteiras != null && loading == false">
        <div class="wallet-header w100 justify-between q-px-md">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9MoxYn2yoPOlth1JLi7-5AbW-IQtcxz6y9w&s" alt="Ícone Moeda" class="wallet-icon">
          <span class="wallet-name text-h5">Ethereum</span>
        </div>
        <div class="wallet-balance column ">
          <span class="balance">🪙 {{ carteiras.eth }}</span>
        </div>
        <div class="wallet-balance column text-green-14">
          <span class="balance">{{ carteiras.ethBrl }}</span>
        </div>
      </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';

const $q = useQuasar();
const router = useRouter();
const usuario = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

const carteiras = ref(null);
const loading = ref(true);
onBeforeMount(async () => {
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
  await getCarteiras();
});

function formatarDataHora (data) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  return new Date(data).toLocaleString('pt-BR', options);
}


async function getCarteiras() {
  loading.value = true;
  await api.post('/saldo', { token: usuario.token })
    .then((response) => {
      carteiras.value = response.data;
    })
    .catch((error) => {
      $q.notify({
        color: 'negative',
        position: 'top',
        message: error.response.data.message,
        icon: 'report_problem'
      });
    })
    .finally(() => {
      loading.value = false;
    });
}

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
.wallet-card-1 {
  width: 100%;
  max-width: 400px;
  background: linear-gradient(to top, #535353, #979797); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
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