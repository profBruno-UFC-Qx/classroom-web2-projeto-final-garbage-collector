<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ShieldCheck, Users, MapPin, CircleDollarSign, ArrowRight } from 'lucide-vue-next'
</script>

<template>
  <div>
    <section class="flex flex-col-reverse items-center justify-between gap-8 rounded-lg py-8 md:flex-row">

      <div class="flex-1 text-center md:text-left">
        <h1 class="mb-4 text-4xl font-bold text-gray-900">
          Carona UFC Quixadá
        </h1>
        <p class="mb-8 text-lg leading-relaxed text-gray-600">
          Sistema de caronas solidárias exclusivo para a comunidade acadêmica da UFC. Conecte-se com colegas, economize dinheiro e contribua para um campus mais sustentável.
        </p>
        <div class="flex gap-4 justify-center md:justify-start">
          <RouterLink
            to="/cadastro"
            class="inline-flex items-center gap-2 rounded-md bg-gray-900 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-gray-700"
          >
            Começar agora <ArrowRight :size="16" />
          </RouterLink>
          <RouterLink
            to="/login"
            class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
          >
            Já tenho conta
          </RouterLink>
        </div>
      </div>

      <div class="flex h-[300px] w-4/5 flex-1 items-center justify-center overflow-hidden rounded-lg bg-gray-100 shadow-xl md:h-[400px] md:w-5/12">
        <img
          src="/images/campus-ufc-vista-aerea.jpg"
          alt="Vista aérea do campus da UFC em Quixadá"
          class="block h-full w-full object-cover"
        >
      </div>

    </section>

    <section class="mt-8 rounded-lg bg-white px-8 py-16">

      <h2 class="mb-12 text-center text-xl font-semibold text-gray-900">
        Por que usar o Carona UFC?
      </h2>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

        <div class="rounded-lg border border-gray-200 bg-white p-6 text-left shadow-md">
          <div class="mb-4 inline-flex rounded-lg bg-blue-100 p-3 text-blue-600">
            <ShieldCheck :size="24" />
          </div>
          <h3 class="mb-2 text-xl font-semibold text-gray-900">Seguro</h3>
          <p class="text-sm leading-normal text-gray-600">
            Apenas membros da comunidade UFC com e-mail institucional validado.
          </p>
        </div>

        <div class="rounded-lg border border-gray-200 bg-white p-6 text-left shadow-md">
          <div class="mb-4 inline-flex rounded-lg bg-emerald-100 p-3 text-emerald-600">
            <Users :size="24" />
          </div>
          <h3 class="mb-2 text-xl font-semibold text-gray-900">Comunidade</h3>
          <p class="text-sm leading-normal text-gray-600">
            Conecte-se com colegas e faça parte de uma rede solidária.
          </p>
        </div>

        <div class="rounded-lg border border-gray-200 bg-white p-6 text-left shadow-md">
          <div class="mb-4 inline-flex rounded-lg bg-violet-100 p-3 text-violet-600">
            <MapPin :size="24" />
          </div>
          <h3 class="mb-2 text-xl font-semibold text-gray-900">Conveniente</h3>
          <p class="text-sm leading-normal text-gray-600">
            Encontre caronas para o campus e principais destinos de Quixadá.
          </p>
        </div>

        <div class="rounded-lg border border-gray-200 bg-white p-6 text-left shadow-md">
          <div class="mb-4 inline-flex rounded-lg bg-amber-50 p-3 text-amber-600">
            <CircleDollarSign :size="24" />
          </div>
          <h3 class="mb-2 text-xl font-semibold text-gray-900">Econômico</h3>
          <p class="text-sm leading-normal text-gray-600">
            Divida custos e economize com transporte compartilhado.
          </p>
        </div>

      </div>
    </section>
  </div>
</template>

<style scoped>
</style>
