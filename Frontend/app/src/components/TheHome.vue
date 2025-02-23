<template>
  <div>
    <AdminHome v-if="isAdminOrEmployee" />
    <HomeDetailVue v-if="isMember || !dutyId" />
  </div>
</template>

<script>
import HomeDetailVue from "./HomeDetail.vue";
import AdminHome from "./AdminHome.vue";
import { EventBus } from "@/event-bus";

export default {
  name: "TheHome",
  components: {
    HomeDetailVue,
    AdminHome,
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
</style>