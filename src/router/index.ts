import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "../views/LandingPage.vue";
import LoginPage from "../views/LoginPage.vue";
import DashboardPage from "../views/DashboardPage.vue";

// Lazy-loaded dashboard child pages
const OverviewTab = () => import("../components/dashboard/OverviewTab.vue");
const RppFormTab = () => import("../components/dashboard/RppFormTab.vue");
const ProcessingTab = () => import("../components/dashboard/ProcessingTab.vue");
const ResultsTab = () => import("../components/dashboard/ResultsTab.vue");
const ProjectsView = () => import("../components/rpp/ProjectsView.vue");
const LibraryView = () => import("../components/rpp/LibraryView.vue");

const routes = [
  {
    path: "/",
    name: "home",
    component: LandingPage,
    meta: { transition: "page-fade" },
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
    meta: { transition: "page-fade" },
  },
  {
    path: "/dashboard",
    component: DashboardPage,
    meta: { transition: "page-slide" },
    children: [
      {
        path: "",
        name: "dashboard",
        component: OverviewTab,
      },
      {
        path: "rpp",
        name: "rpp-form",
        component: RppFormTab,
      },
      {
        path: "processing",
        name: "rpp-processing",
        component: ProcessingTab,
      },
      {
        path: "results",
        name: "rpp-results",
        component: ResultsTab,
      },
      {
        path: "projects",
        name: "projects",
        component: ProjectsView,
      },
      {
        path: "library",
        name: "library",
        component: LibraryView,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
