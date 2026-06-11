<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Check, ChevronDown, UploadCloud, FileText, X } from 'lucide-vue-next'
import { useRppState } from '../../composables/useRppState'

export interface RppFormData {
  rawMaterial: string
  uploadedFile: File | null
  namaSiswa: string
  selectedJenjang: string
  selectedMataPelajaran: string
  studentProfile: string
}

const router = useRouter()
const { processRPP, savedFormData } = useRppState()

const rppStep = ref(1)

const uploadedFile = ref<File | null>(savedFormData.value?.uploadedFile || null)
const isDragging = ref(false)
const studentProfile = ref(savedFormData.value?.studentProfile || '')
const namaSiswa = ref(savedFormData.value?.namaSiswa || '')
const selectedJenjang = ref(savedFormData.value?.selectedJenjang || '')
const selectedMataPelajaran = ref(savedFormData.value?.selectedMataPelajaran || '')
const fileInputRef = ref<HTMLInputElement | null>(null)

const allowedTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]
const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.ppt', '.pptx']

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const handleFileSelect = (file: File) => {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(ext)) {
    alert('Format file tidak didukung. Gunakan PDF, DOC, DOCX, TXT, PPT, atau PPTX.')
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    alert('Ukuran file maksimal 10 MB.')
    return
  }
  uploadedFile.value = file
}

const onFileInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files && input.files[0]) {
    handleFileSelect(input.files[0])
  }
  input.value = ''
}

const onDrop = (e: DragEvent) => {
  isDragging.value = false
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    handleFileSelect(e.dataTransfer.files[0])
  }
}

const removeFile = () => {
  uploadedFile.value = null
}

const jenjangOptions = [
  'PAUD', 'SD/MI Tingkat 1', 'SD/MI Tingkat 2', 'SD/MI Tingkat 3', 
  'SD/MI Tingkat 4', 'SD/MI Tingkat 5', 'SD/MI Tingkat 6', 
  'SMP/MTS Tingkat 7', 'SMP/MTS Tingkat 8', 'SMP/MTS Tingkat 9', 
  'SMA/MA Tingkat 10', 'SMA/MA Tingkat 11', 'SMA/MA Tingkat 12', 
  'Perguruan Tinggi', 'Profesional/Trainer', 'SMK'
];

const mataPelajaranOptions = [
  'Bahasa Indonesia', 'Bahasa Inggris', 'Matematika Wajib', 'Sejarah Indonesia', 
  'Pendidikan Pancasila', 'PJOK', 'Seni Budaya', 'Prakarya', 'Informatika', 
  'Agama Islam', 'Agama Kristen', 'Agama Katolik', 'Agama Hindu', 
  'PENDIDIKAN AGAMA BUDDHA DAN BUDI PEKERTI', 'Agama Khonghucu', 
  'Matematika Peminatan', 'Fisika', 'Kimia', 'Biologi', 'Ekonomi', 
  'Sosiologi', 'Geografi', 'Sejarah Peminatan', 'Bahasa dan Sastra Indonesia', 
  'Bahasa dan Sastra Inggris', 'Bahasa Arab', 'Bahasa Jepang', 'Bahasa Mandarin', 
  'Bahasa Jerman', 'Bahasa Prancis', 'Antropologi', 'Al-Qur\u2019an Hadis', 
  'Akidah Akhlak', 'Fiqih', 'Sejarah Kebudayaan Islam (SKI)', 
  'Kecerdasan Buatan (AI)', 'Muatan Lokal (Bahasa Daerah)'
];

const handleSubmit = () => {
  if (!uploadedFile.value || !namaSiswa.value || !selectedJenjang.value || !selectedMataPelajaran.value) {
    alert('Mohon lengkapi File Materi, Nama Siswa, Jenjang, dan Mata Pelajaran terlebih dahulu.')
    return
  }

  const formData: RppFormData = {
    rawMaterial: 'Dummy raw text from file',
    uploadedFile: uploadedFile.value,
    namaSiswa: namaSiswa.value,
    selectedJenjang: selectedJenjang.value,
    selectedMataPelajaran: selectedMataPelajaran.value,
    studentProfile: studentProfile.value
  }

  savedFormData.value = formData

  processRPP(formData, router)
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-12 pb-20">
    <div class="space-y-2">
      <h1 class="text-3xl font-black text-slate-900">Rencana Pembelajaran (RPP)</h1>
      <p class="text-slate-500">Buat rencana pembelajaran secara otomatis sesuai dengan Standar Nasional</p>
    </div>

    <!-- Stepper -->
    <div class="flex items-center justify-between relative px-10">
      <div class="absolute h-0.5 bg-slate-100 left-10 right-10 top-1/2 -translate-y-1/2 z-0"></div>
      <div v-for="step in 3" :key="step" class="relative z-10">
        <div :class="[
          rppStep === step ? 'bg-blue-600 text-white ring-4 ring-blue-50' : (rppStep > step ? 'bg-green-500 text-white' : 'bg-white text-slate-400 border border-slate-100'),
          'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all'
        ]">
          <Check v-if="rppStep > step" class="w-5 h-5" />
          <span v-else>{{ step }}</span>
        </div>
        <span class="absolute top-12 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 whitespace-nowrap uppercase tracking-widest">
          {{ step === 1 ? 'Informasi Umum' : (step === 2 ? 'Isi Pembelajaran' : 'Dukungan Pembelajaran') }}
        </span>
      </div>
    </div>

    <!-- Form Content -->
    <div class="bg-white rounded-3xl p-10 border border-slate-200 space-y-10 shadow-sm">
      <div class="space-y-6">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Dokumen</p>
        <div class="space-y-4">
          <label class="block text-sm font-bold text-slate-900">Upload Materi Pembelajaran *</label>

          <!-- File not yet uploaded: show dropzone -->
          <div
            v-if="!uploadedFile"
            @click="fileInputRef?.click()"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop"
            :class="[
              'w-full p-10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-all',
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50'
            ]"
          >
            <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
              <UploadCloud class="w-8 h-8 text-blue-500" />
            </div>
            <div class="text-center space-y-1">
              <p class="text-sm font-bold text-slate-700">Klik atau seret file ke sini</p>
              <p class="text-xs text-slate-400">PDF, DOC, DOCX, TXT, PPT, PPTX — Maks 10 MB</p>
            </div>
          </div>

          <!-- File uploaded: show file info -->
          <div
            v-else
            class="w-full p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-4"
          >
            <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
              <FileText class="w-6 h-6 text-emerald-600" />
            </div>
            <div class="flex-grow min-w-0">
              <p class="text-sm font-bold text-slate-900 truncate">{{ uploadedFile.name }}</p>
              <p class="text-xs text-slate-500">{{ formatFileSize(uploadedFile.size) }}</p>
            </div>
            <button @click="removeFile" class="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all text-slate-400 shrink-0">
              <X class="w-4 h-4" />
            </button>
          </div>

          <input
            ref="fileInputRef"
            type="file"
            accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
            class="hidden"
            @change="onFileInput"
          />
          <p class="text-xs text-slate-400 italic">File materi yang diupload akan dianalisis dan disesuaikan dengan kebutuhan siswa.</p>
        </div>
      </div>

      <div class="space-y-6">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Detail App</p>

        <div class="space-y-4">
          <label class="block text-sm font-bold text-slate-900">Nama Siswa *</label>
          <input
            v-model="namaSiswa"
            type="text"
            placeholder="Contoh: Budi Santoso"
            class="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-600 transition-all text-sm text-slate-600"
          />
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
              <select v-model="selectedMataPelajaran" :disabled="!selectedJenjang" :class="[!selectedJenjang ? 'opacity-50' : '', 'w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-600 appearance-none text-sm text-slate-600']">
                <option value="" disabled>Pilih Mata Pelajaran</option>
                <option v-for="option in mataPelajaranOptions" :key="option" :value="option">{{ option }}</option>
              </select>
              <ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
            <p class="text-[10px] text-slate-400">Mata pelajaran hanya dapat dipilih setelah Jenjang/Tingkat dipilih.</p>
          </div>
        </div>

        <div class="space-y-4">
          <label class="block text-sm font-bold text-slate-900">Identifikasi Murid</label>
          <textarea v-model="studentProfile" rows="4" placeholder="Contoh: Murid kelas 3 non inklusi dengan pengetahuan level siswa belum mengenal energi di sekitar dengan sekolah daerah perkotaan dengan budaya belajar" class="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm text-slate-600"></textarea>
        </div>
      </div>

      <button @click="handleSubmit" class="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
        Selanjutnya
      </button>
    </div>
  </div>
</template>
