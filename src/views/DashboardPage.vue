<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { logoUrl } from '../constants'
import { supabase } from '../lib/supabase'
import { useRouter } from 'vue-router'
import { generateRPP, checkStatus, getResult, downloadPDF } from '../services/rppApi'
import { 
  LayoutDashboard, FolderOpen, GraduationCap, 
  Users, Library, Search, Bell, Settings, 
  HelpCircle, ChevronDown, Plus, FileText, 
  PenTool, BookOpen, UserCircle, LogOut,
  CheckCircle2, AlertCircle, ArrowRight, Download, Share2,
  MoreVertical, BookCopy, Zap, Clock, Check, Star
} from 'lucide-vue-next'

const router = useRouter()
const activeTab = ref('dashboard') // 'dashboard', 'rpp-form', 'processing', 'results'
const activeMenu = ref('Dasbor')
const userEmail = ref('')

onMounted(async () => {
  const { data } = await supabase.auth.getSession()
  if (!data.session) {
    router.push('/')
  } else {
    userEmail.value = data.session.user.email || ''
  }
})

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/')
}

const rawMaterial = ref('')
const studentProfile = ref('')

const selectedJenjang = ref('')
const selectedMataPelajaran = ref('')
const selectedPertemuan = ref('')
const selectedDisabilitas = ref('')

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
  'Bahasa Jerman', 'Bahasa Prancis', 'Antropologi', 'Al-Qur’an Hadis', 
  'Akidah Akhlak', 'Fiqih', 'Sejarah Kebudayaan Islam (SKI)', 
  'Kecerdasan Buatan (AI)', 'Muatan Lokal (Bahasa Daerah)'
];

const jumlahPertemuanOptions = ['1x', '2x', '3x', '4x', '5x'];

const disabilitasOptions = [
  'Disabilitas Netra', 'Disabilitas Rungu', 'Disabilitas Daksa', 
  'Disabilitas Intelektual', 'Gangguan Emosi dan Perilaku', 
  'Gangguan Komunikasi', 'Disabilitas Mental', 
  'Gangguan Perhatian dan Hiperaktivitas', 'Kesulitan Belajar spesifik', 
  'Gangguan Spektrum Autis (ASD)'
];

const sidebarItems = [
  { name: 'Dasbor', icon: LayoutDashboard, badge: '' },
  { name: 'Semua Proyek', icon: FolderOpen, badge: '' },
  { name: 'Kursus AI', icon: GraduationCap, badge: 'PRO' },
  { name: 'Kelola Tim', icon: Users, badge: 'TIM' },
  { name: 'Perpustakaan', icon: Library, badge: '' },
]

const stats = [
  { label: 'Projek', value: 0, icon: FolderOpen, color: 'bg-[#1e2b4d]' },
  { label: 'Berkas', value: 0, icon: FileText, color: 'bg-blue-500' },
  { label: 'Tim Diklat', value: 0, icon: Users, color: 'bg-slate-200' },
]

const recentRPP = ref({
  title: '',
  subText: '',
  readability: 0,
  accessibility: 0,
  strengths: [] as Array<{ title: string; desc: string }>,
  resources: [] as Array<{ name: string; type: string; icon: any }>,
  pdf_url: null as string | null,
})

const rppStep = ref(1)
const namaSiswa = ref('')
const currentJobId = ref<string | null>(null)
const currentStep = ref('')
let pollingInterval: ReturnType<typeof setInterval> | null = null

onUnmounted(() => { if (pollingInterval) clearInterval(pollingInterval) })

const startRPP = () => { activeTab.value = 'rpp-form' }

const processRPP = async () => {
  if (!namaSiswa.value || !selectedJenjang.value || !selectedMataPelajaran.value || !selectedDisabilitas.value) {
    alert('Mohon lengkapi Nama Siswa, Jenjang, Mata Pelajaran, dan Disabilitas terlebih dahulu.')
    return
  }
  currentStep.value = ''
  activeTab.value = 'processing'

  try {
    const job = await generateRPP({
      nama_siswa: namaSiswa.value,
      kelas: selectedJenjang.value,
      mata_pelajaran: selectedMataPelajaran.value,
      gejala: selectedDisabilitas.value + (studentProfile.value ? ': ' + studentProfile.value : ''),
      materi_mentah: rawMaterial.value || undefined,
    })
    currentJobId.value = job.job_id

    pollingInterval = setInterval(async () => {
      try {
        const status = await checkStatus(job.job_id)
        currentStep.value = status.step
        const s = status.status.toLowerCase()
        if (s === 'completed' || s === 'done' || s === 'finished') {
          clearInterval(pollingInterval!); pollingInterval = null
          const r = await getResult(job.job_id)

          recentRPP.value = {
            title: `RPP Inklusif — ${r.nama_siswa}`,
            subText: `${r.mata_pelajaran} · ${r.kelas}`,
            readability: r.readability_score,
            accessibility: r.wcag_score,
            strengths: [
              { title: 'Profil Siswa', desc: r.profiling },
              { title: 'Strategi Adaptif', desc: r.adaptive },
            ],
            resources: [{ name: 'Insight AI', type: r.insight, icon: FileText }],
            pdf_url: r.pdf_url,
          }

          // Simpan ke Supabase
          const { data: sessionData } = await supabase.auth.getSession()
          if (sessionData.session) {
            await supabase.from('materials').insert({
              user_id: sessionData.session.user.id,
              raw_content: rawMaterial.value,
              student_profile: studentProfile.value,
              readability_score: r.readability_score,
              accessibility_score: r.wcag_score,
            })
          }

          activeTab.value = 'results'
        } else if (s === 'failed' || s === 'error') {
          clearInterval(pollingInterval!); pollingInterval = null
          alert('Terjadi kesalahan saat memproses RPP. Coba lagi.')
          activeTab.value = 'rpp-form'
        }
      } catch (e: any) {
        clearInterval(pollingInterval!); pollingInterval = null
        alert('Error: ' + e.message)
        activeTab.value = 'rpp-form'
      }
    }, 2000)
  } catch (e: any) {
    alert('Gagal menghubungi API: ' + e.message)
    activeTab.value = 'rpp-form'
  }
}

const handleDownload = async () => {
  if (recentRPP.value.pdf_url) {
    const a = document.createElement('a')
    a.href = recentRPP.value.pdf_url
    a.download = 'RPP.pdf'
    a.target = '_blank'
    a.click()
    return
  }
  if (!currentJobId.value) return
  try {
    const blob = await downloadPDF(currentJobId.value)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'RPP.pdf'
    a.click()
    URL.revokeObjectURL(url)
  } catch (e: any) {
    alert('Gagal download: ' + e.message)
  }
}
</script>

<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden font-sans">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div class="p-6 flex items-center gap-2">
        <img :src="logoUrl" alt="ASIQ Logo" class="h-8 w-auto" />
      </div>

      <div class="px-4 py-2 border-b border-slate-50 flex items-center gap-3 mb-6">
        <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">P</div>
        <div class="flex flex-col">
          <span class="text-sm font-bold text-slate-900">Personal</span>
          <span class="text-xs text-slate-400">Account</span>
        </div>
        <ChevronDown class="w-4 h-4 ml-auto text-slate-400" />
      </div>

      <nav class="flex-grow px-4 pb-6 space-y-1">
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Menu Utama</p>
        <button 
          v-for="item in sidebarItems" :key="item.name"
          @click="activeMenu = item.name; activeTab = 'dashboard'"
          :class="[
            activeMenu === item.name ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50',
            'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 shrink-0" />
          <span class="text-sm font-semibold">{{ item.name }}</span>
          <span v-if="item.badge" class="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-600">
            {{ item.badge }}
          </span>
        </button>
      </nav>

      <div class="p-4 mx-4 mb-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200 relative overflow-hidden group">
        <div class="relative z-10 space-y-4 text-center">
          <div class="flex justify-center -mt-8">
            <div class="w-16 h-16 bg-white rounded-full p-3 shadow-xl transform group-hover:scale-110 transition-all">
              <Star class="w-full h-full text-yellow-500 fill-yellow-500" />
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-xs font-bold text-slate-900">Tingkatkan Pengalaman Anda dengan ASIQ</p>
            <button class="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-blue-200 transition-all">
              Upgrade Berlangganan
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-grow flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
        <div class="flex items-center gap-4 w-full max-w-xl">
          <div class="md:hidden p-2 text-slate-600"><LayoutDashboard class="w-6 h-6" /></div>
          <div class="relative flex-grow">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Cari di sini..." class="w-full pl-12 pr-4 py-2 bg-slate-50 border-2 border-transparent rounded-xl focus:border-blue-600 focus:bg-white outline-none transition-all text-sm" />
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 p-1 bg-slate-50 rounded-xl">
            <button class="px-4 py-2 border-2 border-blue-600 rounded-lg text-xs font-bold text-blue-600 flex items-center gap-2 hover:bg-blue-50 transition-all">
              Gunakan Voucher
            </button>
            <div class="h-8 w-px bg-slate-200 mx-2"></div>
            <div class="flex items-center gap-4 px-4 py-1">
              <div class="flex flex-col items-center">
                <span class="text-[10px] font-bold text-slate-400 uppercase">Gratis</span>
                <span class="text-sm font-bold text-slate-900">15</span>
              </div>
              <div class="flex flex-col items-center">
                <span class="text-[10px] font-bold text-slate-400 uppercase">Premium</span>
                <span class="text-sm font-bold text-slate-900">0</span>
              </div>
            </div>
          </div>
          
          <button class="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 relative">
            <Bell class="w-5 h-5" />
            <span class="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
          </button>

          <div class="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div class="flex flex-col items-end">
              <span class="text-sm font-bold text-slate-900 whitespace-nowrap">{{ userEmail ? userEmail.split('@')[0].toUpperCase() : 'USER' }}</span>
              <span class="text-[10px] font-bold text-green-500 uppercase">Online</span>
            </div>
            <button @click="handleLogout" class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold border-2 border-white shadow-sm overflow-hidden hover:bg-orange-200 transition-all">
               <LogOut class="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <!-- Scrollable Area -->
      <div class="flex-grow overflow-y-auto p-8">
        
        <!-- DASHBOARD VIEW -->
        <div v-if="activeTab === 'dashboard'" class="space-y-8 max-w-7xl mx-auto">
          <!-- Welcome Banner -->
          <div class="bg-white rounded-3xl p-10 border border-slate-200 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden group shadow-sm">
            <div class="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 opacity-50"></div>
            <div class="relative z-10 space-y-6 flex-grow">
              <div class="space-y-2">
                <h2 class="text-3xl font-black text-slate-900">Asisten Guru untuk <br /> Pembelajaran Adaptif</h2>
                <p class="text-slate-500 max-w-md leading-relaxed">Buat RPP, materi dan soal sesuai karakteristik belajar siswa lebih cepat dan berikan instruksi tambahan sesuai kebutuhan.</p>
              </div>
              <p class="text-blue-600 font-bold text-lg">#SolusiBelajarAdaptif</p>
              
              <div class="flex flex-wrap gap-8 pt-4 border-t border-slate-100">
                <div class="flex items-center gap-2 text-slate-600 text-sm font-medium">
                  <CheckCircle2 class="w-5 h-5 text-blue-500" /> Meaningful Learning
                </div>
                <div class="flex items-center gap-2 text-slate-600 text-sm font-medium">
                  <CheckCircle2 class="w-5 h-5 text-blue-500" /> Mindful Learning
                </div>
                <div class="flex items-center gap-2 text-slate-600 text-sm font-medium">
                  <CheckCircle2 class="w-5 h-5 text-blue-500" /> Joyful Learning
                </div>
              </div>
            </div>
            <div class="relative z-10 w-full lg:w-96 shrink-0 transform group-hover:scale-105 transition-all">
              <img src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2673&auto=format&fit=crop" class="w-full rounded-2xl shadow-2xl rotate-2" alt="Learning" />
            </div>
          </div>

          <!-- Quick Action Tiles -->
          <div class="grid md:grid-cols-3 gap-6">
            <button @click="startRPP" class="p-8 bg-[#eddef2] rounded-3xl text-left border border-fuchsia-100 hover:shadow-xl hover:shadow-fuchsia-100 transition-all group flex flex-col gap-4">
              <div class="w-12 h-12 bg-white/50 backdrop-blur rounded-2xl flex items-center justify-center p-2.5">
                <FileText class="w-full h-full text-fuchsia-600" />
              </div>
              <h3 class="text-lg font-bold text-slate-900 pr-8">AI Rencana Pembelajaran (RPP)</h3>
            </button>
            <button class="p-8 bg-[#e1daf5] rounded-3xl text-left border border-indigo-100 hover:shadow-xl hover:shadow-indigo-100 transition-all group flex flex-col gap-4">
              <div class="w-12 h-12 bg-white/50 backdrop-blur rounded-2xl flex items-center justify-center p-2.5">
                <PenTool class="w-full h-full text-indigo-600" />
              </div>
              <h3 class="text-lg font-bold text-slate-900 pr-8">AI Soal Latihan</h3>
            </button>
            <button class="p-8 bg-[#fdf2e1] rounded-3xl text-left border border-orange-100 hover:shadow-xl hover:shadow-orange-100 transition-all group flex flex-col gap-4">
              <div class="w-12 h-12 bg-white/50 backdrop-blur rounded-2xl flex items-center justify-center p-2.5">
                <BookOpen class="w-full h-full text-orange-600" />
              </div>
              <h3 class="text-lg font-bold text-slate-900 pr-8">AI Materi Ajar</h3>
            </button>
          </div>

          <!-- Summary Grid -->
          <div class="grid lg:grid-cols-3 gap-8">
            <!-- Left: Create Project Card -->
            <div class="lg:col-span-1 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
               <div class="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
               <div class="w-24 h-24 bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-2xl">
                 <Plus class="w-full h-full text-white" />
               </div>
               <div class="space-y-2">
                 <h3 class="text-2xl font-black text-white">Mulailah dengan membuat proyek baru</h3>
                 <p class="text-blue-100 text-sm">Kelola semua dokumen ajar dalam satu tempat mudah dan cepat</p>
               </div>
            </div>

            <!-- Middle: Analytics Summaries -->
            <div class="lg:col-span-1 bg-white rounded-3xl p-8 border border-slate-200 space-y-8 flex flex-col">
              <div class="flex items-center gap-2">
                <LayoutDashboard class="w-5 h-5 text-slate-400" />
                <h3 class="text-lg font-bold text-slate-900">Rangkuman Aktivitas Anda</h3>
              </div>
              <div class="flex-grow space-y-6 flex flex-col justify-center">
                <div class="flex items-center gap-3">
                  <Clock class="w-4 h-4 text-slate-400" />
                  <span class="text-sm font-semibold text-slate-900">Resume Kinerja</span>
                </div>
                <div class="grid grid-cols-3 gap-4">
                  <div v-for="stat in stats" :key="stat.label" class="flex flex-col items-center gap-4">
                    <div :class="[stat.color, 'w-full aspect-square rounded-2xl flex flex-col items-center justify-center p-2 text-white shadow-lg overflow-hidden relative']">
                       <component :is="stat.icon" class="w-6 h-6 opacity-30 absolute -right-2 -bottom-2" />
                       <span class="text-2xl font-black relative z-10">{{ stat.value }}</span>
                       <span class="text-[10px] font-bold uppercase tracking-widest relative z-10 opacity-70">{{ stat.label }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Subscriptions -->
            <div class="lg:col-span-1 bg-white rounded-3xl p-8 border border-slate-200 space-y-8">
              <div class="flex items-center gap-2">
                <FolderOpen class="w-5 h-5 text-slate-400" />
                <h3 class="text-lg font-bold text-slate-900">Paket Berlangganan Anda</h3>
              </div>
              <div class="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-6">
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md animate-pulse">
                     <Zap class="w-8 h-8 text-blue-500" />
                  </div>
                  <div class="flex flex-col">
                    <span class="text-lg font-black text-slate-900">Guru Inspiratif</span>
                    <span class="text-xs text-slate-500">Premium Account</span>
                  </div>
                </div>
                <button class="w-full py-4 text-sm font-bold text-blue-600 bg-white border border-slate-100 rounded-xl hover:shadow-lg transition-all">
                  Kelola Paket Berlangganan
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- RPP FORM VIEW -->
        <div v-if="activeTab === 'rpp-form'" class="max-w-4xl mx-auto space-y-12 pb-20">
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
                <label class="block text-sm font-bold text-slate-900">Materi Mentah (Teks)</label>
                <textarea v-model="rawMaterial" rows="6" placeholder="Masukkan teks materi pembelajaran Anda di sini..." class="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm text-slate-600"></textarea>
                <p class="text-xs text-slate-400 italic">Materi yang dimasukkan akan dianalisis dan disesuaikan dengan kebutuhan siswa.</p>
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
                <textarea v-model="studentProfile" rows="4" placeholder="Contoh: Murid kelas 3 non inklusi dengan pengetahuan level siswa belum mengenal energi di sekitar dengan sekolah daerah perkotaan dengan budaya belajar" class="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm text-slate-600"></textarea>
              </div>
            </div>

            <button @click="processRPP" class="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
              Selanjutnya
            </button>
          </div>
        </div>

        <!-- PROCESSING VIEW -->
        <div v-if="activeTab === 'processing'" class="h-full flex items-center justify-center p-8">
          <div class="max-w-2xl w-full bg-white rounded-[2.5rem] p-16 shadow-2xl border border-slate-100 flex flex-col items-center text-center space-y-12">
            <!-- Processing Animation Icons -->
            <div class="relative">
               <div class="w-48 h-48 rounded-full border-[12px] border-blue-50 border-t-blue-600 animate-spin"></div>
               <div class="absolute inset-0 flex items-center justify-center">
                 <div class="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-400 animate-pulse">
                    <Zap class="w-12 h-12 text-white" />
                 </div>
               </div>
               <!-- Random Floating Icons -->
               <div class="absolute -top-4 -left-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-500 animate-bounce">
                 <GraduationCap class="w-6 h-6" />
               </div>
               <div class="absolute top-1/2 -right-12 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-500 translate-y-10 animate-pulse">
                 <Search class="w-5 h-5" />
               </div>
               <div class="absolute -bottom-4 left-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-500 animate-bounce [animation-delay:0.5s]">
                 <FileText class="w-6 h-6" />
               </div>
            </div>

            <div class="space-y-4">
              <h2 class="text-4xl font-black text-slate-900 leading-tight">Multi-Agent sedang menganalisis RPP Anda...</h2>
              <p class="text-slate-500 max-w-sm mx-auto">Mohon tunggu sebentar sementara sistem kami yang cerdas memecah dan mengevaluasi dokumen Anda.</p>
            </div>

            <div class="w-full max-w-xs space-y-4">
              <div class="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-blue-600 w-2/3 rounded-full"></div>
              </div>
              <div class="space-y-3">
                <div class="flex items-center gap-3 text-slate-400 text-sm">
                   <div class="w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center"><Check class="w-3 h-3" /></div>
                   <span>Membaca dokumen RPP...</span>
                </div>
                <div class="flex items-center gap-3 text-blue-600 text-sm font-bold">
                   <div class="w-5 h-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
                   <span>Menyusun strategi pengajaran...</span>
                </div>
                <div class="flex items-center gap-3 text-slate-300 text-sm">
                   <div class="w-5 h-5 rounded-full border border-slate-100"></div>
                   <span>Mengevaluasi standar kurikulum...</span>
                </div>
              </div>
            </div>

            <p class="text-[10px] text-slate-400 italic">Proses ini mungkin memakan waktu beberapa saat tergantung pada kompleksitas RPP Anda. Jangan tutup halaman ini.</p>
          </div>
        </div>

        <!-- RESULTS VIEW -->
        <div v-if="activeTab === 'results'" class="space-y-10 max-w-7xl mx-auto pb-20">
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div class="p-8 bg-white rounded-[2rem] border-2 border-blue-50 flex-grow shadow-sm relative overflow-hidden">
              <div class="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
              <div class="flex items-center gap-2 text-blue-600 font-bold text-xs mb-4">
                <CheckCircle2 class="w-4 h-4" /> Analisis Selesai
              </div>
              <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div class="space-y-2">
                  <h1 class="text-3xl font-black text-slate-900">{{ recentRPP.title }}</h1>
                  <p class="text-slate-500 max-w-xl">{{ recentRPP.subText }}</p>
                </div>
                <div class="flex gap-3">
                  <button class="px-5 py-3 border-2 border-blue-100 rounded-xl text-blue-600 font-extrabold flex items-center gap-2 hover:bg-blue-50 transition-all">
                    <PenTool class="w-4 h-4" /> Edit RPP
                  </button>
                  <button @click="handleDownload" class="px-5 py-3 bg-blue-600 text-white rounded-xl font-extrabold flex items-center gap-2 hover:shadow-xl hover:shadow-blue-200 transition-all">
                    <Download class="w-4 h-4" /> Unduh PDF
                  </button>
                  <button class="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                    <Share2 class="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="grid lg:grid-cols-2 gap-8">
            <div class="bg-white rounded-[2.5rem] p-10 border border-slate-200 text-center space-y-8 flex flex-col items-center justify-center min-h-[350px]">
              <h3 class="text-xl font-bold text-slate-900">Readability Score</h3>
              <div class="relative flex items-center justify-center">
                <svg class="w-48 h-48 transform -rotate-90">
                  <circle cx="96" cy="96" r="80" stroke="currentColor" stroke-width="12" fill="transparent" class="text-slate-100" />
                  <circle cx="96" cy="96" r="80" stroke="currentColor" stroke-width="12" fill="transparent" :stroke-dasharray="2 * Math.PI * 80" :stroke-dashoffset="2 * Math.PI * 80 * (1 - 0.85)" stroke-linecap="round" class="text-blue-600" />
                </svg>
                <div class="absolute flex flex-col items-center">
                   <span class="text-5xl font-black text-slate-900">{{ recentRPP.readability }}</span>
                   <span class="text-xs font-bold text-slate-400">/100</span>
                </div>
              </div>
              <div class="px-6 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">High Confidence</div>
            </div>

            <div class="bg-white rounded-[2.5rem] p-10 border border-slate-200 text-center space-y-8 flex flex-col items-center justify-center min-h-[350px]">
              <h3 class="text-xl font-bold text-slate-900">Web Content Accessibility Guidelines</h3>
              <div class="relative flex items-center justify-center">
                <svg class="w-48 h-48 transform -rotate-90">
                  <circle cx="96" cy="96" r="80" stroke="currentColor" stroke-width="12" fill="transparent" class="text-slate-100" />
                  <circle cx="96" cy="96" r="80" stroke="currentColor" stroke-width="12" fill="transparent" :stroke-dasharray="2 * Math.PI * 80" :stroke-dashoffset="2 * Math.PI * 80 * (1 - 0.85)" stroke-linecap="round" class="text-blue-600 shadow-xl" />
                </svg>
                <div class="absolute flex flex-col items-center">
                   <span class="text-5xl font-black text-slate-900">{{ recentRPP.accessibility }}</span>
                   <span class="text-xs font-bold text-slate-400">/100</span>
                </div>
              </div>
              <div class="px-6 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">High Confidence</div>
            </div>
          </div>

          <div class="grid lg:grid-cols-2 gap-8">
             <!-- Kekuatan Utama -->
             <div class="bg-white rounded-[2.5rem] p-10 border border-slate-200 space-y-8">
               <div class="flex items-center gap-3 mb-4">
                 <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><CheckCircle2 class="w-6 h-6" /></div>
                 <h3 class="text-2xl font-black text-slate-900">Kekuatan Utama</h3>
               </div>
               <div class="space-y-8">
                 <div v-for="item in recentRPP.strengths" :key="item.title" class="flex gap-4">
                   <div class="w-8 h-8 rounded-full bg-blue-100 shrink-0 flex items-center justify-center text-blue-600 font-bold text-xs shadow-inner">
                     <Clock class="w-4 h-4" />
                   </div>
                   <div class="space-y-1">
                     <h4 class="font-bold text-slate-900">{{ item.title }}</h4>
                     <p class="text-sm text-slate-500 leading-relaxed">{{ item.desc }}</p>
                   </div>
                 </div>
               </div>
             </div>

             <!-- Sumber Belajar Terkait -->
             <div class="bg-white rounded-[2.5rem] p-10 border border-slate-200 space-y-8">
               <div class="flex items-center gap-3 mb-4">
                 <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><BookOpen class="w-6 h-6" /></div>
                 <h3 class="text-2xl font-black text-slate-900">Sumber Belajar Terkait</h3>
               </div>
               <div class="space-y-4">
                 <div v-for="res in recentRPP.resources" :key="res.name" class="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-all group cursor-pointer">
                    <div class="w-14 h-14 bg-slate-900/5 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <component :is="res.icon" class="w-6 h-6" />
                    </div>
                    <div class="flex-grow">
                      <h4 class="font-bold text-slate-900">{{ res.name }}</h4>
                      <p class="text-xs text-slate-400">{{ res.type }}</p>
                    </div>
                    <div class="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-blue-600">
                      <Download class="w-4 h-4" />
                    </div>
                 </div>
               </div>
             </div>
          </div>

          <!-- Bottom Button -->
          <div class="flex justify-start">
             <button @click="activeTab = 'dashboard'" class="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black flex items-center gap-3 shadow-2xl shadow-blue-200">
               <Plus class="w-5 h-5" /> Buat Baru
             </button>
          </div>
        </div>

      </div>

      <!-- Floating Button -->
      <button class="fixed bottom-8 right-8 px-6 py-3 bg-blue-600 text-white rounded-full font-bold flex items-center gap-3 shadow-2xl shadow-blue-200 hover:-translate-y-1 transition-all">
        <HelpCircle class="w-5 h-5" /> Butuh Bantuan?
      </button>
    </main>
  </div>
</template>

<style scoped>
/* Custom animations */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Hide scrollbar for Chrome, Safari and Opera */
.overflow-y-auto::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.overflow-y-auto {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
