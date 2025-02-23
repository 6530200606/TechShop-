<template>
  <div class="login-page">
    <div class="container d-flex flex-column align-items-center mt-4">
      <div class="login-box p-5 shadow-lg">
        <div class="logo mb-5">
          <img
            src="../assets/icon/TECH.png"
            alt="Logo"
            width="500"
            height="auto"
          />
        </div>
        <div class="logo-text">Admin Login</div>
        <form @submit.prevent="handleSubmit">
          <div class="form-floating mb-3 position-relative mt-5">
            <input
              type="text"
              class="form-control form-control-lg"
              id="loginname"
              v-model="loginname"
              autocomplete="off"
              required
              autofocus
              placeholder="อีเมลบริษัท"
            />
            <label for="loginname" class="form-label"> อีเมลบริษัท </label>
          </div>
          <div class="form-floating mb-3 position-relative">
            <input
              :type="passwordVisible ? 'text' : 'password'"
              class="form-control form-control-lg"
              id="password"
              v-model="password"
              required
              placeholder="รหัสผ่าน"
            />
            <label for="password" class="form-label">รหัสผ่าน</label>
            <button
              type="button"
              class="btn-icon position-absolute top-50 end-0 me-3 translate-middle-y"
              @click="togglePasswordVisibility"
            >
              <i :class="passwordVisible ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
            </button>
          </div>

          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-primary btn-lg mb-3">
              <i class="bi bi-check-lg"></i>&nbsp;เข้าสู่ระบบ
            </button>

            <div class="text-center">
              <router-link to="/login">
                <a href="#" class="d-inline">Customer (ลูกค้า)</a>
              </router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { EventBus } from "@/event-bus"; // Import EventBus
axios.defaults.withCredentials = true;

export default {
  name: "AdminLogin",
  data() {
    return {
      loginname: null,
      password: null,
      passwordVisible: false,
      adminEmail: null,
      adminName: null,
      dutyId: null,
    };
  },
  mounted() {
    window.scrollTo(0, 0);
    if (localStorage.getItem("memEmail") != null) {
      this.$router.push("/pagemember");
    }
    if (localStorage.getItem("adminEmail") != null) {
      this.$router.push("/");
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
    async handleSubmit() {
      let admin = {
        loginName: this.loginname,
        password: this.password,
      };

      try {
        const response = await axios.post(
          "http://localhost:3000/admins/login",
          admin
        );

        if (response.data.messagelogin === "เข้าสู่ระบบสำเร็จ") {
          window.alert(response.data.messagelogin);
          await this.chkSession();
          EventBus.emit("loginok"); // Emit event after successful login
          this.$router.push("/");
        } else {
          window.alert(response.data.messagelogin);
        }
      } catch (err) {
        console.error("Error:", err);
        window.alert("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      }
    },
    async chkSession() {
      await axios
        .get(`http://localhost:3000/admins/getss`)
        .then((res) => {
          console.log(res.data);
          this.adminEmail = res.data.email;
          this.adminName = res.data.name;
          this.dutyId = res.data.dutyId;
          localStorage.setItem(`adminName`, this.adminName);
          localStorage.setItem(`adminEmail`, this.adminEmail);
          localStorage.setItem(`dutyId`, this.dutyId);
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>

<style scoped>
/* ป้องกันการเลื่อน */
html,
body {
  overflow: hidden;
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #f0f2f5; /* สีพื้นหลังของหน้าจอ */
}
.login-page {
  height: 100vh;
  display: flex;
  align-items: flex-start; /* จัดให้อยู่ด้านบน */
  justify-content: center;
  padding-top: 20px; /* เพิ่ม padding ด้านบน */
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.logo-text {
  font-size: 2.5rem; /* ขนาดตัวอักษรของข้อความโลโก้ */
  font-weight: 700;
  color: #333; /* สีของข้อความโลโก้ */
}

.login-box {
  background-color: white;
  border-radius: 12px; /* มุมโค้งมน */
  padding: 40px;
  width: 100%;
  max-width: 1000px; /* ความกว้างสูงสุดของฟอร์ม */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* เงา */
}

.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
}

.top-50 {
  top: 50%;
}

.end-0 {
  right: 0;
}

.translate-middle-y {
  transform: translateY(-50%);
}

.btn-icon {
  border: none; /* เอากรอบออก */
  background: transparent; /* เอาพื้นหลังออก */
  padding: 0; /* ลบการจัดระยะ padding */
  cursor: pointer; /* เปลี่ยนเป็น cursor pointer */
  font-size: 1.5rem; /* ขนาดของไอคอน */
  outline: none; /* เอา outline ออก */
}

.form-label {
  font-size: 1.1rem; /* ขนาดตัวอักษรของ label */
}

.form-control-lg {
  font-size: 1.1rem; /* ขนาดตัวอักษรใน input */
  padding: 0.75rem 1.25rem; /* เพิ่ม padding ให้ input */
  border-radius: 8px; /* มุมโค้งมน */
}

.btn-lg {
  font-size: 1.1rem; /* ขนาดตัวอักษรในปุ่ม */
  padding: 0.75rem 1.25rem; /* เพิ่ม padding ให้ปุ่ม */
  border-radius: 8px; /* มุมโค้งมน */
  width: 100%; /* ปุ่มยาวเต็มความกว้าง */
}

a {
  text-decoration: none; /* ลบเส้นใต้ */
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7); /* ทำให้พื้นหลังมืดขึ้น */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.overlay-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 400px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  position: relative; /* เพิ่มบรรทัดนี้ */
}

.overlay-content h2 {
  font-size: 1.8rem; /* ขนาดตัวอักษรหัวข้อ */
  margin-bottom: 20px; /* เพิ่มระยะห่างด้านล่าง */
  color: #333; /* สีตัวอักษรหัวข้อ */
}

.overlay-content input {
  width: 100%; /* ให้ input ยาวเต็มความกว้าง */
  padding: 10px; /* เพิ่ม padding ให้ input */
  margin-bottom: 15px; /* เพิ่มระยะห่างระหว่าง input */
  border: 1px solid #ccc; /* กรอบ input */
  border-radius: 8px; /* มุมโค้งมน */
  font-size: 1rem; /* ขนาดตัวอักษรใน input */
}

.submit {
  background-color: #007bff; /* สีพื้นหลังของปุ่ม */
  color: white; /* สีตัวอักษรในปุ่ม */
  padding: 10px 20px; /* เพิ่ม padding ให้ปุ่ม */
  border: none; /* เอากรอบออก */
  border-radius: 8px; /* มุมโค้งมน */
  cursor: pointer; /* เปลี่ยนเป็น cursor pointer */
  transition: background-color 0.3s; /* เพิ่มการเปลี่ยนสีพื้นหลังเมื่อ hover */
}

.submit :hover {
  background-color: #0056b3; /* เปลี่ยนสีเมื่อ hover */
}

.overlay-content p {
  margin-top: 15px; /* เพิ่มระยะห่างด้านบน */
}

.btn-close {
  border: none; /* เอากรอบออก */
  background: transparent; /* เอาพื้นหลังออก */
  font-size: 1.5rem; /* ขนาดของไอคอน */
  color: #333; /* สีของไอคอน */
  cursor: pointer; /* เปลี่ยนเป็น cursor pointer */
  margin: 0.5rem; /* เพิ่มระยะห่างเล็กน้อย */
}
</style>