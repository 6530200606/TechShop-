<template>
  <div>
    <AdminMenu v-if="isAdminOrEmployee" />
    <MainMenu v-if="isMember || !dutyId" />
    <router-view :key="$route.path" />
    <AppFooter />
  </div>
</template>

<script>
import MainMenu from "./components/MainMenu.vue";
import AppFooter from "./components/Footer.vue";
import AdminMenu from "./components/AdminMenu.vue";
import { EventBus } from "@/event-bus";

export default {
  name: "App",
  components: {
    MainMenu,
    AppFooter,
    AdminMenu,
  },
  data() {
    return {
      dutyId: null,
      isAdminOrEmployee: false,
      isMember: false,
    };
  },
  created() {
    this.checkSession();
    EventBus.on("loginok", this.checkSession); // ฟัง event loginok
    EventBus.on("logout", this.checkSession); // ฟัง event logout
  },
  beforeUnmount() {
    EventBus.off("loginok", this.checkSession); // ลบ event listener
    EventBus.off("logout", this.checkSession); // ลบ event listener
  },
  watch: {
    // เมื่อเส้นทางเปลี่ยนให้เรียก checkSession ใหม่
    $route() {
      this.checkSession();
    },
  },
  methods: {
    checkSession() {
      this.dutyId = localStorage.getItem("dutyId") || null;

      // ปรับการตรวจสอบสถานะ
      this.isAdminOrEmployee =
        this.dutyId === "admin" || this.dutyId === "employee";
      this.isMember = this.dutyId === "member";
    },
  },
};
</script>

<style>
/* ใส่ style ที่ต้องการที่นี่ */
</style>
