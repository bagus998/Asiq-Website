<script setup lang="ts">
import { Zap, Check, X } from "lucide-vue-next";

const emit = defineEmits(["close"]);

const plans = [
  {
    name: "Guru Terbantu",
    price: "Gratis",
    priceOld: "",
    period: "Tak ada batasan waktu",
    subtitle: "",
    badge: "",
    icon: null,
    features: [
      { text: "15 Energi/bulan", highlighted: false },
      { text: "3 Proyek Pertama", highlighted: false },
      { text: "Format Kurikulum Nasional", highlighted: false },
    ],
    button: "MULAI SEKARANG",
    buttonStyle: "outline",
    popular: false,
  },
  {
    name: "Guru Hebat",
    price: "Rp 125rb",
    priceOld: "Rp 250.000",
    period: "/ 12 Bulan",
    subtitle: "",
    badge: "PALING POPULER",
    icon: "zap",
    features: [
      { text: "Semua Fitur Gratis", highlighted: true },
      { text: "700 Energi Setahun", highlighted: true },
      { text: "Proyek Tanpa Batas", highlighted: true },
      { text: "Prompting Lanjutan", highlighted: true },
      { text: "Kursus Online AI", highlighted: true },
    ],
    button: "PILIH PAKET HEBAT",
    buttonStyle: "solid",
    popular: true,
  },
  {
    name: "Guru Kolaboratif",
    price: "Rp 200rb",
    priceOld: "",
    period: "",
    subtitle: "Sekolah & Tim",
    badge: "",
    icon: null,
    features: [
      { text: "Semua fitur Guru Hebat", highlighted: false },
      { text: "Manajemen Tim", highlighted: false },
      { text: "Kolaborasi Perangkat Ajar", highlighted: false },
    ],
    button: "SEGERA HADIR",
    buttonStyle: "outline",
    popular: false,
  },
  {
    name: "Enterprise",
    price: "Kustom",
    priceOld: "",
    period: "",
    subtitle: "Yayasan & Universitas",
    badge: "",
    icon: null,
    features: [
      { text: "Semua Fitur Terbuka", highlighted: false },
      { text: "Energi Kustom", highlighted: false },
      { text: "API Integrasi", highlighted: false },
      { text: "On-site Training", highlighted: false },
    ],
    button: "HUBUNGI TIM ASIQ",
    buttonStyle: "outline",
    popular: false,
  },
];
</script>

<template>
  <!-- Backdrop -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        @click.self="emit('close')"
      >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="emit('close')"></div>

        <!-- Modal Content -->
        <div
          class="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-blue-600 p-8 md:p-10 shadow-2xl"
        >
          <!-- Close Button -->
          <button
            @click="emit('close')"
            class="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors z-20"
          >
            <X class="w-5 h-5" />
          </button>

          <!-- Header -->
          <div class="text-center mb-10 space-y-3">
            <h2
              class="text-3xl md:text-4xl font-black text-white"
              style="font-family: 'Inter', sans-serif"
            >
              Rencanakan Pembelajaran Lebih Mudah
            </h2>
            <p class="text-blue-100 text-sm max-w-lg mx-auto leading-relaxed">
              Dapatkan fitur eksklusif untuk mengelola, berkolaborasi, dan
              menciptakan pengalaman belajar digital yang lebih interaktif.
            </p>
          </div>

          <!-- Pricing Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              v-for="(plan, index) in plans"
              :key="index"
              :class="[
                'relative bg-white rounded-2xl p-6 flex flex-col transition-all',
                plan.popular
                  ? 'ring-2 ring-yellow-400 shadow-xl scale-[1.03]'
                  : 'shadow-lg',
              ]"
            >
              <!-- Popular Badge -->
              <div
                v-if="plan.badge"
                class="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-green-500 text-white text-[10px] font-black uppercase tracking-wider rounded-full whitespace-nowrap shadow-md"
              >
                {{ plan.badge }}
              </div>

              <!-- Plan Icon (Guru Hebat) -->
              <div class="flex flex-col items-center text-center mb-4 mt-2">
                <div
                  v-if="plan.icon === 'zap'"
                  class="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-yellow-200"
                >
                  <Zap class="w-7 h-7 text-white fill-white" />
                </div>

                <h3 class="text-sm font-bold text-slate-500">
                  {{ plan.name }}
                </h3>

                <!-- Price -->
                <div class="mt-1">
                  <span
                    v-if="plan.priceOld"
                    class="text-xs text-slate-400 line-through block"
                  >
                    {{ plan.priceOld }}
                  </span>
                  <span
                    :class="[
                      'font-black',
                      plan.price === 'Gratis' || plan.price === 'Kustom'
                        ? 'text-2xl text-slate-900'
                        : 'text-2xl text-blue-600',
                    ]"
                  >
                    {{ plan.price }}
                  </span>
                  <span
                    v-if="plan.period"
                    class="text-xs text-slate-400 block"
                  >
                    {{ plan.period }}
                  </span>
                </div>

                <p
                  v-if="plan.subtitle"
                  class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1"
                >
                  {{ plan.subtitle }}
                </p>
              </div>

              <!-- Features -->
              <div class="flex-grow space-y-2.5 mb-6">
                <div
                  v-for="(feature, fi) in plan.features"
                  :key="fi"
                  class="flex items-start gap-2"
                >
                  <div
                    :class="[
                      'w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                      feature.highlighted
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-500',
                    ]"
                  >
                    <Check class="w-3 h-3" />
                  </div>
                  <span
                    :class="[
                      'text-sm',
                      feature.highlighted
                        ? 'font-bold text-slate-900'
                        : 'font-medium text-slate-600',
                    ]"
                  >
                    {{ feature.text }}
                  </span>
                </div>
              </div>

              <!-- Button -->
              <button
                :class="[
                  'w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all',
                  plan.buttonStyle === 'solid'
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                    : 'border-2 border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600',
                ]"
              >
                {{ plan.button }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}
.modal-fade-enter-active .relative {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-fade-enter-from {
  opacity: 0;
}
.modal-fade-enter-from .relative {
  transform: scale(0.95) translateY(20px);
}
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-leave-to .relative {
  transform: scale(0.95);
}
</style>
