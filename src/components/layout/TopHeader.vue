<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Menu, Search, ChevronDown, Zap, Check, Plus, User, Crown, Moon, Sun, Settings, LogOut } from "lucide-vue-next";

const props = defineProps<{ userEmail: string }>();
const emit = defineEmits(["logout", "show-pricing", "toggle-sidebar"]);

const showDropdown = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const darkMode = ref(false);

function getUserDisplayName(email: string): string {
  if (!email) return "User";
  const local = email.split("@")[0];
  return local
    .split(/[._-]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getUserInitial(email: string): string {
  if (!email) return "U";
  return email.charAt(0).toUpperCase();
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function closeDropdown() {
  showDropdown.value = false;
}

function handleClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    closeDropdown();
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <header
    class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0"
  >
    <!-- Left: hamburger + search -->
    <div class="flex items-center gap-4 flex-grow max-w-md">
      <button @click="emit('toggle-sidebar')" class="p-1.5 text-slate-500 hover:text-slate-700 transition-colors md:hidden">
        <Menu class="w-5 h-5" />
      </button>
      <div class="relative flex-grow">
        <Search
          class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
        />
        <input
          type="text"
          placeholder="Cari di sini..."
          class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 focus:bg-white outline-none transition-all text-sm"
        />
      </div>
    </div>

    <!-- Right: voucher, credits, user -->
    <div class="flex items-center gap-3">
      <!-- Voucher Button -->
      <button
        class="px-4 py-2 border-2 border-blue-600 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50 transition-all flex items-center gap-2"
      >
        <svg
          class="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
        Gunakan Voucher
      </button>

      <!-- Credits -->
      <div class="flex items-center gap-0 bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div class="flex items-center gap-2 px-3 py-1.5 border-r border-slate-200">
          <Zap class="w-3.5 h-3.5 text-blue-500" />
          <div class="flex flex-col items-center leading-none">
            <span class="text-[9px] font-semibold text-slate-400 uppercase">Gratis</span>
            <span class="text-sm font-bold text-slate-900">15</span>
          </div>
        </div>
        <div class="flex flex-col items-center leading-none px-3 py-1.5">
          <span class="text-[9px] font-semibold text-slate-400 uppercase">Premium</span>
          <span class="text-sm font-bold text-slate-900">0</span>
        </div>
      </div>

      <!-- User + Dropdown -->
      <div ref="dropdownRef" class="relative">
        <button
          @click="toggleDropdown"
          class="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <div
            class="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
          >
            {{ getUserInitial(userEmail) }}
          </div>
          <span class="text-sm font-semibold text-slate-700 max-w-[120px] truncate">
            {{ getUserDisplayName(userEmail) }}
          </span>
          <ChevronDown
            :class="['w-4 h-4 text-slate-400 shrink-0 transition-transform', showDropdown ? 'rotate-180' : '']"
          />
        </button>

        <!-- Dropdown Menu -->
        <Transition name="dropdown">
          <div
            v-if="showDropdown"
            class="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
          >
            <!-- User Info -->
            <div class="p-5 flex items-center gap-4">
              <div class="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0">
                {{ getUserInitial(userEmail) }}
              </div>
              <div class="min-w-0">
                <p class="text-sm font-bold text-slate-900 truncate">{{ getUserDisplayName(userEmail) }}</p>
                <p class="text-xs text-slate-500 truncate">{{ userEmail }}</p>
              </div>
            </div>

            <!-- Organisasi -->
            <div class="px-5 pb-3">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Organisasi Anda</p>
              <div class="flex items-center justify-between py-2">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xs font-bold">P</div>
                  <span class="text-sm font-semibold text-slate-700">Personal</span>
                </div>
                <Check class="w-5 h-5 text-blue-500" />
              </div>
              <button class="flex items-center justify-between w-full py-2 group">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center group-hover:border-blue-400 transition-colors">
                    <Plus class="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <span class="text-sm font-medium text-slate-500 group-hover:text-blue-600 transition-colors">Tambah Organisasi</span>
                </div>
                <span class="px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-black rounded-md uppercase">PRO</span>
              </button>
            </div>

            <!-- Referral Banner -->
            <div class="mx-5 mb-4 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl relative overflow-hidden">
              <div class="absolute -right-4 -bottom-4 w-24 h-24 opacity-30">
                <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="10" y="20" width="60" height="50" rx="6" fill="white" opacity="0.3"/>
                  <rect x="20" y="10" width="40" height="10" rx="4" fill="white" opacity="0.4"/>
                  <circle cx="55" cy="15" r="8" fill="#FBBF24" opacity="0.8"/>
                  <path d="M52 15l2 2 4-4" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <p class="text-sm font-bold text-white relative z-10">Dapatkan Bonus Energi!</p>
              <p class="text-xs text-blue-100 mt-1 relative z-10">Dapatkan bonus energi setiap kali teman bergabung.</p>
            </div>

            <!-- Menu Items -->
            <div class="border-t border-slate-100">
              <button class="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <User class="w-5 h-5 text-slate-400" />
                <span class="text-sm font-medium text-slate-700">Profil Saya</span>
              </button>
              <button @click="emit('show-pricing'); closeDropdown()" class="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <Crown class="w-5 h-5 text-slate-400" />
                <span class="text-sm font-medium text-slate-700">Berlangganan</span>
              </button>
              <button @click="darkMode = !darkMode" class="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <component :is="darkMode ? Sun : Moon" class="w-5 h-5 text-slate-400" />
                <span class="text-sm font-medium text-slate-700 flex-grow text-left">Mode Terang</span>
                <!-- Toggle Switch -->
                <div
                  :class="[
                    'w-10 h-6 rounded-full p-0.5 transition-colors relative',
                    darkMode ? 'bg-blue-500' : 'bg-slate-300'
                  ]"
                >
                  <div
                    :class="[
                      'w-5 h-5 bg-white rounded-full shadow-md transition-transform',
                      darkMode ? 'translate-x-4' : 'translate-x-0'
                    ]"
                  ></div>
                </div>
              </button>
              <button class="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <Settings class="w-5 h-5 text-slate-400" />
                <span class="text-sm font-medium text-slate-700">Pengaturan</span>
              </button>
            </div>

            <!-- Keluar -->
            <div class="border-t border-slate-100">
              <button @click="emit('logout'); closeDropdown()" class="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-red-50 transition-colors">
                <LogOut class="w-5 h-5 text-red-500" />
                <span class="text-sm font-medium text-red-500">Keluar</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<style scoped>
.dropdown-enter-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
