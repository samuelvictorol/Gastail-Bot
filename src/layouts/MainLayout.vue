<template>
  <q-layout view="hHh lpR fFf">

    <q-header class="bg-1 text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://media.istockphoto.com/id/1421764176/pt/vetorial/abstract-phoenix-bird-vector-illustration.jpg?s=612x612&w=0&k=20&c=4Cv8qtj6WsCpDhMPTe0-JhmFKP_3Vj2wAtHZ5RpOzh8=">
          </q-avatar>
          Gastail
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="center">
        <q-route-tab to="/app" label="Carteiras"  icon="account_balance_wallet"/>
        <q-route-tab to="/app/acoes" label="Ações" icon="analytics"/>
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
      <q-footer class="bg-1 text-white q-py-xs">
        <div class="text-center">
          Desenvolvidor por <a href="https://samuelvictorol.github.io/portfolio/" target="_blank" class="text-white">Samuel Victor</a>
        </div>
      </q-footer>
    </q-page-container>

  </q-layout>
</template>