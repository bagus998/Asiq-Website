<script setup lang="ts">
import { ref } from "vue";
import { logoUrl } from "../constants";
import { useRouter } from "vue-router";
import { ArrowLeft, Mail, Lock, User, Chrome, Apple, CheckCircle2 } from "lucide-vue-next";
import { supabase } from "../lib/supabase";

const router = useRouter();
const isLoginFormVisible = ref(false);
const email = ref("");
const password = ref("");
const isSignUp = ref(false);
const loading = ref(false);
const errorMessage = ref("");

const handleSocialLogin = async (platform: string) => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: platform.toLowerCase() as "google" | "apple",
      options: {
        // Ini akan mengarahkan user kembali ke dashboard setelah login sukses
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) throw error;

    // Catatan: Untuk OAuth, fungsi ini tidak akan lanjut ke baris berikutnya
    // karena browser akan langsung pindah ke halaman login Google.
  } catch (err: any) {
    errorMessage.value = `Gagal login dengan ${platform}: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

const handleEmailAuth = async () => {
  loading.value = true;
  errorMessage.value = "";
  try {
    if (isSignUp.value) {
      const { error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      });
      if (error) throw error;
      alert("Pendaftaran berhasil! Cek email Anda untuk verifikasi.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      });
      if (error) throw error;
      router.push("/dashboard");
    }
  } catch (err: any) {
    errorMessage.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 p-4 md:p-8">
    <div class="max-w-5xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
      <!-- Left Content: Forms -->
      <div class="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative">
        <button v-if="isLoginFormVisible" @click="isLoginFormVisible = false" class="absolute top-8 left-8 p-2 text-slate-400 hover:text-slate-900 transition-colors">
          <ArrowLeft class="w-6 h-6" />
        </button>

        <Transition name="fade" mode="out-in">
          <!-- Step 1: Welcome / Pre-Auth -->
          <div v-if="!isLoginFormVisible" class="space-y-12 text-center flex flex-col items-center">
            <div class="space-y-4">
              <div class="flex items-center justify-center gap-3">
                <img :src="logoUrl" alt="ASIQ Logo" class="h-12 w-auto" />
              </div>
              <p class="text-slate-400 font-medium text-sm">Asisten Guru untuk Pembelajaran Adaptif</p>
            </div>

            <div class="space-y-4 w-full max-w-xs">
              <h2 class="text-2xl font-bold text-slate-900">Sign In</h2>
              <p class="text-slate-400 text-sm">Selamat Datang di Aplikasi ASIQ</p>
              <button
                @click="isLoginFormVisible = true"
                class="w-full py-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-900 hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center gap-3 shadow-sm"
              >
                <User class="w-5 h-5" /> Masuk
              </button>
            </div>
          </div>

          <!-- Step 2: Main Login Form -->
          <div v-else class="space-y-8">
            <div class="text-center space-y-4">
              <div class="flex items-center justify-center gap-3 mb-6">
                <img :src="logoUrl" alt="ASIQ Logo" class="h-10 w-auto" />
              </div>
              <h2 class="text-xl font-bold text-slate-900">{{ isSignUp ? "Buat Akun Baru" : "Masuk (login) dengan akun Anda" }}</h2>
            </div>

            <!-- Social Buttons -->
            <div class="space-y-3">
              <button @click="handleSocialLogin('Apple')" class="w-full py-3.5 px-6 border-2 border-slate-100 rounded-xl flex items-center justify-center gap-3 font-semibold text-slate-700 hover:border-slate-300 transition-all">
                <svg class="w-5 h-5" viewBox="0 0 384 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
                  />
                </svg>
                Lanjutkan dengan Apple
              </button>
              <button @click="handleSocialLogin('Google')" class="w-full py-3.5 px-6 border-2 border-slate-100 rounded-xl flex items-center justify-center gap-3 font-semibold text-slate-700 hover:border-slate-300 transition-all">
                <svg class="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                Lanjutkan dengan Google
              </button>
            </div>

            <div class="flex items-center gap-4 text-slate-300">
              <div class="h-px bg-slate-100 flex-grow"></div>
              <span class="text-xs uppercase font-bold tracking-widest">atau</span>
              <div class="h-px bg-slate-100 flex-grow"></div>
            </div>

            <!-- Email Form -->
            <form @submit.prevent="handleEmailAuth" class="space-y-4">
              <div v-if="errorMessage" class="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                {{ errorMessage }}
              </div>
              <div class="space-y-2">
                <div class="relative">
                  <User class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    v-model="email"
                    type="email"
                    required
                    placeholder="Email / Surel"
                    class="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-xl focus:border-blue-600 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div class="space-y-2">
                <div class="relative">
                  <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    v-model="password"
                    type="password"
                    required
                    placeholder="Kata Sandi"
                    class="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-xl focus:border-blue-600 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div class="flex justify-end" v-if="!isSignUp">
                <a href="#" class="text-sm font-semibold text-blue-600 hover:underline">Apakah Anda lupa kata sandinya?</a>
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ loading ? "Memproses..." : isSignUp ? "Daftar" : "Masuk (Login)" }}
              </button>

              <p class="text-center text-sm text-slate-500">
                {{ isSignUp ? "Sudah memiliki akun?" : "Belum memiliki akun?" }}
                <button type="button" @click="isSignUp = !isSignUp" class="font-bold text-blue-600 hover:underline">
                  {{ isSignUp ? "Masuk" : "Buat Akun" }}
                </button>
              </p>
            </form>
          </div>
        </Transition>
      </div>

      <!-- Right Content: Brand Illustration -->
      <div class="hidden md:block w-1/2 bg-gradient-to-br from-blue-400 to-blue-600 p-12 relative overflow-hidden">
        <!-- Abstract Patterns -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div class="relative h-full flex flex-col justify-center items-center text-center space-y-12">
          <!-- Illustration Box -->
          <div class="bg-white/20 backdrop-blur-xl border border-white/30 rounded-[2.5rem] p-10 w-full max-w-sm shadow-2xl relative">
            <div class="absolute top-12 -right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl">
              <CheckCircle2 class="w-8 h-8 text-green-500" />
            </div>
            <div class="absolute bottom-12 -left-6 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl p-3">
              <img src="https://api.iconify.design/noto-v1:open-book.svg" alt="Book" />
            </div>

            <h3 class="text-3xl font-black text-white leading-tight mb-6">
              Solusi <br />
              Pembelajaran <br />
              Adaptif untuk <br />
              Guru Masa Kini
            </h3>

            <div class="mt-8 flex justify-center">
              <img src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=2670&auto=format&fit=crop" alt="Teacher" class="w-48 h-48 rounded-2xl object-cover border-4 border-white shadow-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
