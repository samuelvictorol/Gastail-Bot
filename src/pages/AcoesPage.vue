<template> 
    <q-page class="q-py-md q-px-md">
      <div v-if="loading" class="loading row w100 no-wrap justify-center q-gutter-x-sm">
        <q-spinner-dots color="orange" size="2em" />
        <q-spinner-dots color="red" size="2em" />
        <q-spinner-dots color="yellow-14" size="2em" />
      </div>
  
      <div class="dashboards" v-if="!loading">
        <div class="charts-wrapper">
          <div class="chart-container">
            <canvas ref="saldoChart"></canvas>
          </div>
          <div class="chart-container">
            <canvas ref="acoesChart"></canvas>
          </div>
        </div>
      </div>
      <div class="acoes" v-if="!loading && acoes.length > 0">
        <div v-for="moeda in acoes" :key="moeda.moeda" class="moeda-section">
          <h3>{{ moeda.moeda.toUpperCase() }}</h3>
          <div class="acoes-list">
            <q-card v-for="acao in moeda.acoes" :key="acao.id" class="q-mt-sm" 
                    :style="{ backgroundColor: acao.status === 'Venda' ? '#ececec' : (acao.icon === 'trending_up' ? '#e8f5e9' : '#ffebee') }">
              <q-card-section>
                <div class="w100 row justify-between items-center">
                  <span class="text-bold">{{ acao.status }}</span>
                  <q-icon v-if="acao.status === 'Compra'" :name="acao.icon" :color="acao.icon === 'trending_up' ? 'green' : 'red'" size="lg" />
                </div>
                <div class="acao-info">
                  <p v-if="acao.resultado && acao.status === 'Venda'"><strong>Resultado:</strong> R$ {{ acao.resultado }}</p>
                  <p><strong>Total:</strong> {{ acao.total }} {{ moeda.moeda.toLowerCase() }}</p>
                  <p><strong>Valor Pago:</strong> R$ {{ acao.valorPago }}</p>
                  <p><strong>Valor Atual:</strong> R$ {{ acao.valorAtual }}</p>
                </div>
              </q-card-section>
              <q-card-actions class="justify-end">
                <q-btn v-if="acao.status === 'Compra'" color="blue-14" glossy icon-right="payments" label="Vender" @click="venderAcao(acao)" />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
    </q-page>
  </template>
  
  <script setup>
  import { ref, watch, nextTick, onBeforeMount } from 'vue';
  import Chart from 'chart.js/auto';
  import ChartDataLabels from 'chartjs-plugin-datalabels'; // Importa o plugin
  import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';
  
  // Registra o plugin no Chart.js
  Chart.register(ChartDataLabels);
  
  const $q = useQuasar();
  const loading = ref(true);
  const dash = ref({
    btcSaldo: 0,
    ethSaldo: 0,
    usdtSaldo: 0,
    btcAcoes: 0,
    ethAcoes: 0,
    usdtAcoes: 0
  });
  
  async function venderAcao(acao){
    const confirm = window.confirm(`Você tem certeza que deseja registrar a venda dessa ação?`);
    if (!confirm) return;
    const token = JSON.parse(localStorage.getItem('user'))?.token;
    if (!token) {
      window.location.href = '/';
      return;
    }
    try {
      await api.post('/vender-acao', { token: token, acao: acao })
      $q.notify({
        color: 'green',
        textColor: 'white',
        icon: 'check_circle',
        message: 'Ação vendida com sucesso!'
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Erro ao vender ação:', error);
    }
  }

  const acoes = ref([]);

  async function getAcoes () {
    const token = JSON.parse(localStorage.getItem('user'))?.token;
    if (!token) {
      window.location.href = '/';
      return;
    }
    try {
      const response = await api.post('/acoes', { token: token });
      acoes.value = response.data;
    } catch (error) {
      console.error('Erro ao buscar dados das ações:', error);
    }
  }

  // Referências do DOM
  const saldoChart = ref(null);
  const acoesChart = ref(null);
  
  // Instâncias dos gráficos
  let saldoChartInstance = null;
  let acoesChartInstance = null;
  
  // Função para criar os gráficos
  const renderCharts = () => {
    if (!saldoChart.value || !acoesChart.value) return;
  
    // Destruir gráficos anteriores, se existirem
    if (saldoChartInstance) saldoChartInstance.destroy();
    if (acoesChartInstance) acoesChartInstance.destroy();
  
    // Criar gráfico de Saldos
    saldoChartInstance = new Chart(saldoChart.value.getContext('2d'), {
      type: 'pie',
      data: {
        labels: ['BTC', 'ETH', 'USDT'],
        datasets: [
          {
            label: 'Saldos',
            data: [dash.value.btcSaldo, dash.value.ethSaldo, dash.value.usdtSaldo],
            backgroundColor: ['#FFA500', '#3357FF', '#008080'],
            hoverOffset: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Distribuição dos Saldos' },
          datalabels: {
            color: '#fff',
            font: { weight: 'bold', size: 14 },
            formatter: (value) => value.toFixed(6)
          }
        }
      }
    });
  
    // Criar gráfico de Ações
    acoesChartInstance = new Chart(acoesChart.value.getContext('2d'), {
      type: 'pie',
      data: {
        labels: ['BTC', 'ETH', 'USDT'],
        datasets: [
          {
            label: 'Ações',
            data: [dash.value.btcAcoes, dash.value.ethAcoes, dash.value.usdtAcoes],
            backgroundColor: ['#FFA500', '#3357FF', '#008080'],
            hoverOffset: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Distribuição das Ações' },
          datalabels: {
            color: '#fff',
            font: { weight: 'bold', size: 14 },
            formatter: (value) => value // Formata os valores
          }
        }
      }
    });
  };
  
  const fetchData = async () => {
    const token = JSON.parse(localStorage.getItem('user'))?.token;
    if (!token) {
      window.location.href = '/';
      return;
    }
  
    try {
      const response = await api.post('/dash', { token });
      dash.value = response.data;
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      loading.value = false;
      await nextTick(); // Aguarda renderizar o DOM
      renderCharts();
    }
  };
  
  // Observar mudanças nos dados e renderizar gráficos
  watch(dash, async () => {
    if (!loading.value) {
      await nextTick();
      renderCharts();
    }
  });
  
 onBeforeMount(async () => {
    loading.value = true;
    await fetchData();
    await getAcoes();
    loading.value = false;
  });
  </script>
  
  <style scoped>
  .charts-wrapper {
    display: flex;
    justify-content: center;
    gap: 40px;
    flex-wrap: wrap;
  }
  
  .chart-container {
    width: 250px;
    height: 250px;
    text-align: center;
  }
  
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
  
  </style>
  