<template>
  <div class="d-flex justify-content-center vh-100 mt-2 mb-2">
    <div class="card shadow-sm p-5 custom-card">
      <!-- Vue.js logo -->
      <div class="text-center mb-4">
        <img src="../assets/icon/TECH.png" alt="Vue Logo" style="width: 300px" />
      </div>

      <!-- Title and Already a Member Link on the Same Line -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="mb-0 fw-bold">สมัครสมาชิก</h3>

        <!-- Already a Member Link -->
        <div class="text-end mt-3">
          <p class="d-inline">เป็นสมาชิกอยู่แล้ว?&nbsp;</p>
          <router-link to="/login">
            <a href="#" class="d-inline">เข้าสู่ระบบ</a>
          </router-link>
        </div>
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- Name Field -->
        <div class="form-group mb-4 mt-2">
          <label for="memName">ชื่อ</label>
          <input
            type="text"
            class="form-control custom-input"
            id="memName"
            v-model.trim="memName"
            required
          />
        </div>

        <!-- Surname Field -->
        <div class="form-group mb-4 mt-5">
          <label for="memSurname">นามสกุล</label>
          <input
            type="text"
            class="form-control custom-input"
            id="memSurname"
            v-model.trim="memSurname"
            required
          />
        </div>

        <!-- Phone Number Field -->
        <div class="form-group mb-4 mt-5">
          <label for="memTel">เบอร์โทรศัพท์</label>
          <input
            type="tel"
            class="form-control custom-input"
            id="memTel"
            v-model.trim="memTel"
            required
          />
        </div>

        <!-- Updated Date Picker -->
        <div class="form-group mb-4 mt-5">
          <label for="birthDate">วันเดือนปีเกิด</label>
          <Datepicker
            v-model="birthDate"
            :format="'dd/MM/yyyy'"
            :editable="true"
            class="form-control custom-input custom-datepicker"
            ref="datePicker"
            @change="onDateChange"
            @mousedown="removeFocus"
          />
        </div>

        <!-- Address Field -->
        <div class="form-group mb-4 mt-5">
          <label for="memAddress">ที่อยู่</label>
          <input
            type="text"
            class="form-control custom-input"
            id="memAddress"
            v-model.trim="memAddress"
            required
          />
        </div>

        <!-- Email Field -->
        <div class="form-group mb-4 mt-5">
          <label for="memEmail">อีเมล</label>
          <input
            type="email"
            class="form-control custom-input"
            id="memEmail"
            v-model.trim="memEmail"
            required
          />
        </div>

        <!-- Password Field -->
        <div class="form-group mb-4 mt-5">
          <label for="password">รหัสผ่าน</label>
          <div class="input-group">
            <input
              type="password"
              class="form-control custom-input"
              id="password"
              v-model.trim="password"
              required
            />
            <span
              class="input-group-text custom-input-group"
              @click="togglePasswordVisibility"
              style="cursor: pointer; border: none; background: transparent"
            >
              <i :class="passwordVisible ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
            </span>
          </div>
        </div>

        <!-- Submit Button -->
        <button class="btn btn-primary w-100 custom-button mt-4" type="submit">
          <i class="bi bi-check-lg"></i> ลงทะเบียน
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import Datepicker from "vue3-datepicker";
import axios from "axios";

export default {
  name: "TheRegister",
  components: {
    Datepicker,
  },
  data() {
    return {
      memEmail: null,
      memName: null,
      memSurname: null,
      memTel: null,
      birthDate: null,
      memAddress: null,
      password: null,
      passwordVisible: false,
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
    removeFocus() {
      // เช็คว่ามีการอ้างอิงถึง Datepicker สำเร็จหรือไม่
      const datePickerInput = this.$refs.datePicker.$el.querySelector("input");
      if (datePickerInput) {
        // บังคับ blur
        datePickerInput.blur();
      }
    },
    async handleSubmit() {
      const member = {
        memEmail: this.memEmail,
        memName: this.memName,
        memSurname: this.memSurname,
        memTel: this.memTel,
        birthDate: this.birthDate,
        memAddress: this.memAddress,
        password: this.password,
      };

      try {
        const response = await axios.post(
          "http://localhost:3000/members",
          member
        );
        window.alert(response.data.messageregister); // Show success message in alert

        if (response.data.messageregister === "ลงทะเบียนสำเร็จ") {
          const createCartResponse = await axios.post(
            "http://localhost:3000/carts/addCart", member // Assuming 'newCustomerId' is returned by the registration API
          );
          console.log(createCartResponse);
          this.$router.push("/login"); // Redirect to login page
        }
      } catch (err) {
        console.log(err);
        window.alert("ลงทะเบียนผิดพลาด"); // Show error message in alert
      }
    },

    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
      const passwordField = document.getElementById("password");
      passwordField.type = this.passwordVisible ? "text" : "password";
    },
  },
};
</script>

<style scoped>
body {
  background-color: #f7f8fa;
  overflow-y: auto; /* เปิดให้เลื่อนในแนวตั้ง */
  min-height: 100vh; /* ทำให้เนื้อหาขยายเต็มความสูงของหน้าจอ */
}

.custom-card {
  max-width: 700px; /* เปลี่ยนความกว้างเป็น max-width เพื่อความยืดหยุ่น */
  width: 100%; /* ทำให้การ์ดเต็มความกว้างบนหน้าจอขนาดเล็ก */
  min-height: 1250px; /* หรือคุณสามารถปรับความสูงให้เหมาะสม */
  border-radius: 20px;
}

.custom-input {
  border: none;
  border-bottom: 2px solid #007bff;
  background-color: transparent;
  height: 50px;
  font-size: 16px;
}

.custom-input:focus {
  outline: none;
  border-color: #0056b3;
}

.custom-datepicker .dp__input {
  width: 100%;
  border: none;
  border-bottom: 2px solid #007bff;
  background-color: transparent;
  height: 50px;
  font-size: 16px;
}

.custom-datepicker .dp__input:focus {
  outline: none;
  border-color: #0056b3;
}

.form-group {
  margin-bottom: 2rem;
}

.custom-button {
  background-color: #007bff;
  border: none;
  font-weight: bold;
  height: 50px;
}

.custom-button:hover {
  background-color: #0056b3;
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: none;
}

/* Set min-height to ensure content can be scrolled */
.min-vh-100 {
  min-height: 100vh;
  padding-top: 30px;
  padding-bottom: 30px;
}
</style>