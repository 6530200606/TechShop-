<template>
  <div v-if="member.memEmail == cusId && member.dutyId == 'member'">
    <div class="container">
      <h4 class="pt-5">จัดการบัญชีผู้ใช้</h4>
      <div class="d-flex">
        <ul class="list-unstyled px-2 me-5">
          <li class="pt-3">
            <router-link
              to="#"
              class="text-decoration-none text-body-secondary"
            >
              <i class="bi bi-card-list px-2"></i><strong>ข้อมูลส่วนตัว</strong>
            </router-link>
          </li>
          <li class="pt-3">
            <router-link
              to="/manage-info"
              class="text-decoration-none text-body-secondary"
            >
              <i class="bi bi-person-circle px-2"></i>จัดการข้อมูลส่วนตัว
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
            <i class="bi bi-card-list px-2"></i>ข้อมูลส่วนตัว
          </h4>
          <div class="mt-1 bg-body-tertiary rounded-2">
            <div class="p-4">
              <div class="d-flex justify-content-between">
                <p class="fs-7 fw-bold">จัดการข้อมูลส่วนตัว</p>
                <p>
                  <router-link
                    to="/manage-info"
                    class="text-decoration-none text-body-secondary"
                  >
                    <i class="bi bi-pencil-square px-2"></i>แก้ไข
                  </router-link>
                </p>
              </div>
              <div>
                <p>ชื่อ : {{ member.memName }}</p>
                <p>นามสกุล : {{ member.memSurname }}</p>
                <p>อีเมล : {{ member.memEmail }}</p>
                <p>เบอร์โทร : {{ member.memTel }}</p>
                <p>วันเดือนปีเกิด : {{ formatDate(member.birthDate) }}</p>
              </div>
            </div>
          </div>

          <h4 class="mb-3 mt-5">
            <i class="bi bi-pin-map px-1"></i>ที่อยู่การจัดส่ง
          </h4>
          <div class="mt-1 bg-body-tertiary rounded-2">
            <div class="p-4">
              <div class="d-flex justify-content-between">
                <p class="fs-7 fw-bold">จัดการข้อมูลส่วนตัว</p>
                <p>
                  <router-link
                    to="/manage-address"
                    class="text-decoration-none text-body-secondary"
                  >
                    <i class="bi bi-pencil-square px-2"></i>แก้ไข
                  </router-link>
                </p>
              </div>
              <div>
                <p>ที่อยู่การจัดส่ง : {{ member.memAddress }}</p>
              </div>
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
import axios from "axios";
axios.defaults.withCredentials = true;

export default {
  name: "PageMember",
  data() {
    return {
      member: [],
      cusId: null,
    };
  },
  components: {
    ErrorPage,
  },
  async mounted() {
    window.scrollTo(0, 0);
    await this.chkSession();
    await this.getMB();
  },
  methods: {
    async chkSession() {
      await axios
        .get(`http://localhost:3000/members/getss`)
        .then((res) => {
          this.cusId = res.data.email;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async getMB() {
      try {
        const res = await axios.get(
          `http://localhost:3000/members/getMember/${this.cusId}`
        );
        this.member = res.data; // Store member data
      } catch (err) {
        console.error(err);
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
  },
};
</script>
