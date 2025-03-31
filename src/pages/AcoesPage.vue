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
            <div class="text-h6">Distribuição dos Saldos</div>
            <canvas ref="saldoChart"></canvas>
          </div>
  
          <div class="chart-container">
            <div class="text-h6">Distribuição das Ações</div>
            <canvas ref="acoesChart"></canvas>
          </div>
        </div>
      </div>
    </q-page>
  </template>
  
  <script setup>
  import { ref, watch, nextTick } from 'vue';
  import Chart from 'chart.js/auto';
  import ChartDataLabels from 'chartjs-plugin-datalabels'; // Importa o plugin
  import { api } from 'src/boot/axios';
  
  // Registra o plugin no Chart.js
  Chart.register(ChartDataLabels);
  
  const loading = ref(true);
  const dash = ref({
    btcSaldo: 0,
    ethSaldo: 0,
    usdtSaldo: 0,
    btcAcoes: 0,
    ethAcoes: 0,
    usdtAcoes: 0
  });
  
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
            backgroundColor: ['#FF5733', '#33FF57', '#3357FF'],
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
            formatter: (value) => value // Formata os valores com 2 casas decimais
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
            backgroundColor: ['#FFA500', '#800080', '#008080'],
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
  
  // Buscar os dados da API e atualizar os gráficos
  const fetchData = async () => {
    loading.value = true;
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
  
  // Chamar a API ao iniciar
  fetchData();
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
  