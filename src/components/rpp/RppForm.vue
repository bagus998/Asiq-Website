<script setup lang="ts">
import { ref } from "vue";
import { ChevronDown, Check } from "lucide-vue-next";

const emit = defineEmits(["submit-rpp"]);

const rawMaterial = ref("");
const studentProfile = ref("");
const namaSiswa = ref("");
const selectedJenjang = ref("");
const selectedMataPelajaran = ref("");
const selectedPertemuan = ref("");
const selectedDisabilitas = ref("");
const rppStep = ref(1);

const jenjangOptions = [
  "PAUD",
  "SD/MI Tingkat 1",
  "SD/MI Tingkat 2",
  "SD/MI Tingkat 3",
  "SD/MI Tingkat 4",
  "SD/MI Tingkat 5",
  "SD/MI Tingkat 6",
  "SMP/MTS Tingkat 7",
  "SMP/MTS Tingkat 8",
  "SMP/MTS Tingkat 9",
  "SMA/MA Tingkat 10",
  "SMA/MA Tingkat 11",
  "SMA/MA Tingkat 12",
  "Perguruan Tinggi",
  "Profesional/Trainer",
  "SMK",
];

const mataPelajaranOptions = [
  "Bahasa Indonesia",
  "Bahasa Inggris",
  "Matematika Wajib",
  "Sejarah Indonesia",
  "Pendidikan Pancasila",
  "PJOK",
  "Seni Budaya",
  "Prakarya",
  "Informatika",
  "Agama Islam",
  "Agama Kristen",
  "Agama Katolik",
  "Agama Hindu",
  "PENDIDIKAN AGAMA BUDDHA DAN BUDI PEKERTI",
  "Agama Khonghucu",
  "Matematika Peminatan",
  "Fisika",
  "Kimia",
  "Biologi",
  "Ekonomi",
  "Sosiologi",
  "Geografi",
  "Sejarah Peminatan",
  "Bahasa dan Sastra Indonesia",
  "Bahasa dan Sastra Inggris",
  "Bahasa Arab",
  "Bahasa Jepang",
  "Bahasa Mandarin",
  "Bahasa Jerman",
  "Bahasa Prancis",
  "Antropologi",
  "Al-Qur’an Hadis",
  "Akidah Akhlak",
  "Fiqih",
  "Sejarah Kebudayaan Islam (SKI)",
  "Kecerdasan Buatan (AI)",
  "Muatan Lokal (Bahasa Daerah)",
];

const jumlahPertemuanOptions = ["1x", "2x", "3x", "4x", "5x"];

const disabilitasOptions = [
  "Disabilitas Netra",
  "Disabilitas Rungu",
  "Disabilitas Daksa",
  "Disabilitas Intelektual",
  "Gangguan Emosi dan Perilaku",
  "Gangguan Komunikasi",
  "Disabilitas Mental",
  "Gangguan Perhatian dan Hiperaktivitas",
  "Kesulitan Belajar spesifik",
  "Gangguan Spektrum Autis (ASD)",
];

const handleSubmit = () => {
  if (!rawMaterial.value || !namaSiswa.value || !selectedJenjang.value || !selectedMataPelajaran.value || !selectedDisabilitas.value) {
    alert("Mohon lengkapi Materi Mentah, Nama Siswa, Jenjang, Mata Pelajaran, dan Disabilitas terlebih dahulu.");
    return;
  }

  emit("submit-rpp", {
    rawMaterial: rawMaterial.value,
    studentProfile: studentProfile.value,
    namaSiswa: namaSiswa.value,
    selectedJenjang: selectedJenjang.value,
    selectedMataPelajaran: selectedMataPelajaran.value,
    selectedPertemuan: selectedPertemuan.value,
    selectedDisabilitas: selectedDisabilitas.value,
  });
};
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-12 pb-20">
    <div class="space-y-2">
      <h1 class="text-3xl font-black text-slate-900">Rencana Pembelajaran (RPP)</h1>
      <p class="text-slate-500">Buat rencana pembelajaran secara otomatis sesuai dengan Standar Nasional</p>
    </div>

    <div class="flex items-center justify-between relative px-10">
      <div class="absolute h-0.5 bg-slate-100 left-10 right-10 top-1/2 -translate-y-1/2 z-0"></div>
      <div v-for="step in 3" :key="step" class="relative z-10">
        <div
          :class="[
            rppStep === step ? 'bg-blue-600 text-white ring-4 ring-blue-50' : rppStep > step ? 'bg-green-500 text-white' : 'bg-white text-slate-400 border border-slate-100',
            'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all',
          ]"
        >
          <Check v-if="rppStep > step" class="w-5 h-5" />
          <span v-else>{{ step }}</span>
        </div>
        <span class="absolute top-12 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 whitespace-nowrap uppercase tracking-widest">
          {{ step === 1 ? "Informasi Umum" : step === 2 ? "Isi Pembelajaran" : "Dukungan Pembelajaran" }}
        </span>
      </div>
    </div>

    <div class="bg-white rounded-3xl p-10 border border-slate-200 space-y-10 shadow-sm">
      <div class="space-y-6">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Dokumen</p>
        <div class="space-y-4">
          <label class="block text-sm font-bold text-slate-900">Materi Mentah (Teks)</label>
          <textarea
            v-model="rawMaterial"
            rows="6"
            placeholder="Masukkan teks materi pembelajaran Anda di sini..."
            class="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm text-slate-600"
          ></textarea>
          <p class="text-xs text-slate-400 italic">Materi yang dimasukkan akan dianalisis dan disesuaikan dengan kebutuhan siswa.</p>
        </div>
      </div>

      <div class="space-y-6">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Detail App</p>

        <div class="space-y-4">
          <label class="block text-sm font-bold text-slate-900">Nama Siswa *</label>
          <input v-model="namaSiswa" type="text" placeholder="Contoh: Budi Santoso" class="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-600 transition-all text-sm text-slate-600" />
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <label class="block text-sm font-bold text-slate-900">Jenjang/Tingkat</label>
            <div class="relative">
              <select v-model="selectedJenjang" class="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-600 appearance-none text-sm text-slate-600">
                <option value="" disabled>Pilih Jenjang & Tingkat</option>
                <option v-for="option in jenjangOptions" :key="option" :value="option">{{ option }}</option>
              </select>
              <ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
          <div class="space-y-4">
            <label class="block text-sm font-bold text-slate-900">Mata Pelajaran</label>
            <div class="relative">
              <select
                v-model="selectedMataPelajaran"
                :disabled="!selectedJenjang"
                :class="[!selectedJenjang ? 'opacity-50' : '', 'w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-600 appearance-none text-sm text-slate-600']"
              >
                <option value="" disabled>Pilih Mata Pelajaran</option>
                <option v-for="option in mataPelajaranOptions" :key="option" :value="option">{{ option }}</option>
              </select>
              <ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
            <p class="text-[10px] text-slate-400">Mata pelajaran hanya dapat dipilih setelah Jenjang/Tingkat dipilih.</p>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <label class="block text-sm font-bold text-slate-900">Jumlah Pertemuan</label>
            <div class="flex gap-4">
              <div class="relative flex-grow">
                <select v-model="selectedPertemuan" class="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-600 appearance-none text-sm text-slate-600">
                  <option value="" disabled>Pilih Jumlah</option>
                  <option v-for="option in jumlahPertemuanOptions" :key="option" :value="option">{{ option }}</option>
                </select>
                <ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
              <div class="px-6 py-4 bg-slate-100 rounded-xl text-xs font-bold text-slate-500 flex items-center">Pertemuan</div>
            </div>
          </div>
          <div class="space-y-4">
            <label class="block text-sm font-bold text-slate-900">Disabilitas</label>
            <div class="relative">
              <select v-model="selectedDisabilitas" class="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-600 appearance-none text-sm text-slate-600">
                <option value="" disabled>Disabilitas yang Dimiliki</option>
                <option v-for="option in disabilitasOptions" :key="option" :value="option">{{ option }}</option>
              </select>
              <ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <label class="block text-sm font-bold text-slate-900">Identifikasi Murid</label>
          <textarea
            v-model="studentProfile"
            rows="4"
            placeholder="Contoh: Murid kelas 3 non inklusi dengan pengetahuan level siswa belum mengenal energi di sekitar dengan sekolah daerah perkotaan dengan budaya belajar"
            class="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm text-slate-600"
          ></textarea>
        </div>
      </div>

      <button @click="handleSubmit" class="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">Selanjutnya</button>
    </div>
  </div>
</template>
