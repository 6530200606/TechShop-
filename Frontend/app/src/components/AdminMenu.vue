<template>
  <div>
    <nav
      :class="[
        'navbar',
        'navbar-expand-lg',
        'fixed-top',
        'bg-primary',
        'shadow',
      ]"
      style="padding: 1rem 2rem; background-color: #1e293b"
    >
      <div class="container-fluid">
        <router-link to="/" class="text-decoration-none">
          <a
            class="navbar-brand text-white"
            style="
              font-size: 1.8rem;
              font-weight: bold;
              display: flex;
              align-items: center;
            "
          >
            <i
              class="bi bi-cpu-fill"
              style="font-size: 2rem; margin-right: 0.5rem"
            ></i>
            TECHSHOP
          </a>
        </router-link>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarAdmin"
          aria-controls="navbarAdmin"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div
          class="collapse navbar-collapse justify-content-end"
          id="navbarAdmin"
        >
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <template v-if="dutyId === 'employee'">
              <li class="nav-item">
                <router-link
                  to="/orderlist"
                  class="nav-link text-white fw-bold"
                >
                  จัดการคำสั่งซื้อ
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  to="/productlist"
                  class="nav-link text-white fw-bold"
                >
                  จัดการข้อมูลสินค้า
                </router-link>
              </li>
            </template>
            <template v-else>
              <li class="nav-item">
                <router-link
                  to="/orderlist"
                  class="nav-link text-white fw-bold"
                >
                  จัดการคำสั่งซื้อ
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  to="/productlist"
                  class="nav-link text-white fw-bold"
                >
                  จัดการข้อมูลสินค้า
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  to="/employeelist"
                  class="nav-link text-white fw-bold"
                >
                  จัดการข้อมูลพนักงาน
                </router-link>
              </li>
            </template>
          </ul>
          <a
            @click="adminLogout"
            class="btn btn-light fw-bold ms-3"
            style="
              padding: 0.5rem 1.5rem;
              border-radius: 20px;
              box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
            "
          >
            Logout
          </a>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import axios from "axios";
import { EventBus } from "@/event-bus";
axios.defaults.withCredentials = true;

export default {
  name: "AdminMenu",
  data() {
    return {
      adminName: null,
      adminId: null,
      dutyId: null,
    };
  },
  methods: {
    async adminLogout() {
      const cf = window.confirm("ต้องการออกจากระบบหรือไม่");
      if (cf) {
        try {
          const response = await axios.get(
            "http://localhost:3000/admins/logout"
          );
          if (response.data.messagelogout === "ออกจากระบบเสร็จสิ้น") {
            window.alert(response.data.messagelogout);
            localStorage.clear();
            this.adminName = null;
            this.adminId = null;
            this.$router.push("/"); // กลับไปที่หน้าแรก
            EventBus.emit("logout"); // ส่ง event logout
          }
        } catch (err) {
          window.alert("เกิดข้อผิดพลาดในการออกจากระบบ กรุณาลองใหม่");
          console.log(err);
        }
      }
    },
  },
  mounted() {
    this.adminName = localStorage.getItem("adminName");
    this.adminId = localStorage.getItem("adminEmail");
    this.dutyId = localStorage.getItem("dutyId");

    // ฟัง event loginok
    EventBus.on("loginok", () => {
      this.adminName = localStorage.getItem("adminName");
      this.adminId = localStorage.getItem("adminEmail");
      this.dutyId = localStorage.getItem("dutyId");
      console.log("Admin logged in:", this.adminName); // เพิ่มการแจ้งเตือนเพื่อดูผล
    });
  },
  beforeUnmount() {
    EventBus.off("loginok"); // ลบ event listener
  },
};
</script>

<style scoped>
body {
  padding-top: 5rem;
}


.btn-light:hover {
  background-color: red !important;
  color: white !important;
}

.navbar .navbar-toggler-icon {
  background-image: url("data:image/svg+xml; charset=utf8, ...");
}

.shadow {
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
