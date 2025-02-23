<template>
  <div v-if="member.memEmail == cusId && member.dutyId == 'member'">
    <div class="container">
      <h4 class="pt-5">จัดการบัญชีผู้ใช้</h4>
      <div class="d-flex">
        <ul class="list-unstyled px-2 me-5">
          <li class="pt-3">
            <router-link
              to="/pagemember"
              class="text-decoration-none text-body-secondary"
            >
              <i class="bi bi-card-list px-2"></i>ข้อมูลส่วนตัว
            </router-link>
          </li>
          <li class="pt-3">
            <router-link
              to="#"
              class="text-decoration-none text-body-secondary"
            >
              <i class="bi bi-person-circle px-2"></i
              ><strong>จัดการข้อมูลส่วนตัว</strong>
            </router-link>
          </li>
          <li class="pt-3">
            <router-link
              to="/manage-address"
              class="text-decoration-none text-body-secondary"
            >
              <i class="bi bi-signpost px-2"></i>จัดการที่อยู่การจัดส่ง
            </router-link>
          </li>
          <li class="pt-3">
            <router-link
              to="/History"
              class="text-decoration-none text-body-secondary"
            >
              <i class="bi bi-truck px-2"></i>ประวัติการสั่งซื้อ
            </router-link>
          </li>
        </ul>
        <div class="d-block w-75">
          <h4 class="mb-3">
            <i class="bi bi-card-list px-2"></i>จัดการข้อมูลส่วนตัว
          </h4>

          <div class="row bg-light p-4 rounded">
            <div class="col-md-6 mb-3">
              <label for="firstName" class="form-label">ชื่อ</label>
              <input
                type="text"
                class="form-control"
                id="firstName"
                v-model="member.memName"
              />
            </div>
            <div class="col-md-6 mb-3">
              <label for="lastName" class="form-label">นามสกุล</label>
              <input
                type="text"
                class="form-control"
                id="lastName"
                v-model="member.memSurname"
              />
            </div>
            <div class="col-md-6 mb-3">
              <label for="phone" class="form-label">เบอร์โทรศัพท์</label>
              <input
                type="tel"
                class="form-control"
                id="phone"
                v-model="member.memTel"
              />
            </div>
            <div class="col-md-6 mb-3">
              <label for="email" class="form-label">อีเมล</label>
              <input
                type="email"
                class="form-control"
                id="email"
                v-model="member.memEmail"
                readonly
              />
            </div>
            <div class="col-md-6 mb-3">
              <label for="birthDate">วันเกิด</label>
              <Datepicker
                v-model="birthDate"
                :format="'dd/MM/yyyy'"
                class="form-control custom-input custom-datepicker"
                ref="datePicker"
                @change="onDateChange"
                @mousedown="removeFocus"
              />
            </div>
            <div class="text-end mt-4">
              <button class="btn btn-warning" @click="confirmSave()">
                บันทึก
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <ErrorPage />
  </div>
</template>

<script>
import ErrorPage from "../components/error.vue";
import Datepicker from "vue3-datepicker";
import axios from "axios";
axios.defaults.withCredentials = true;

export default {
  name: "ManageInfo",
  components: {
    Datepicker,
    ErrorPage,
  },
  data() {
    return {
      member: [],
      cusId: null,
      birthDate: null,
      isDataLoaded: false,
    };
  },
  async mounted() {
    window.scrollTo(0, 0);
    await this.chkSession();
    await this.getMB();
  },
  methods: {
    removeFocus() {
      const datePickerInput = this.$refs.datePicker.$el.querySelector("input");
      if (datePickerInput) {
        datePickerInput.blur();
      }
    },
    onDateChange(newDate) {
      this.birthDate = newDate; // ใช้ newDate ตรงๆ โดยไม่ปรับ
    },
    async chkSession() {
      try {
        const res = await axios.get(`http://localhost:3000/members/getss`);
        this.cusId = res.data.email;
      } catch (err) {
        console.error(err);
      }
    },
    async getMB() {
      try {
        const res = await axios.get(
          `http://localhost:3000/members/getMember/${this.cusId}`
        );
        this.member = res.data;
        this.birthDate = new Date(res.data.birthDate);
        this.isDataLoaded = true; // เพิ่มตรงนี้เพื่อแสดงว่าข้อมูลโหลดเสร็จแล้ว
      } catch (err) {
        console.error(err);
      }
    },
    confirmSave() {
      if (confirm("คุณต้องการบันทึกข้อมูลหรือไม่?")) {
        this.saveData();
      }
    },
    async saveData() {
      let birthDate = new Date(this.birthDate);
      let formattedDate =
        birthDate.getFullYear() +
        "-" +
        String(birthDate.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(birthDate.getDate()).padStart(2, "0");

      let updatedData = {
        memName: this.member.memName,
        memSurname: this.member.memSurname,
        memTel: this.member.memTel,
        memEmail: this.cusId,
        birthDate: formattedDate,
      };

      try {
        const response = await axios.put(
          "http://localhost:3000/members/update",
          updatedData
        );
        if (response.data.messageUpdate === "บันทึกข้อมูลสำเร็จ") {
          alert(response.data.messageUpdate);
        } else {
          // แสดงข้อความ error ที่ส่งมาจาก response ถ้ามี
          alert(response.data.messageUpdate || "เกิดข้อผิดพลาด");
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.messageUpdate
        ) {
          alert(`เกิดข้อผิดพลาด: ${error.response.data.messageUpdate}`);
        } else {
          // แสดงข้อความทั่วไปหากไม่มีรายละเอียด error
          alert("เกิดข้อผิดพลาดในการเปลี่ยนแปลงข้อมูล");
        }
        console.error("เกิดข้อผิดพลาดในการเปลี่ยนแปลงข้อมูล", error);
      }
    },
  },
};
</script>

<style scoped>
/* Styles ที่คุณมีอยู่ */
</style>
