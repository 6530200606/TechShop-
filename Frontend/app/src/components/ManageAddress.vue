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
              to="/manage-info"
              class="text-decoration-none text-body-secondary"
            >
              <i class="bi bi-person-circle px-2"></i>จัดการข้อมูลส่วนตัว
            </router-link>
          </li>
          <li class="pt-3">
            <router-link
              to="#"
              class="text-decoration-none text-body-secondary"
            >
              <i class="bi bi-signpost px-2"></i
              ><strong>จัดการที่อยู่การจัดส่ง</strong>
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
            <i class="bi bi-card-list px-2"></i>จัดการที่อยู่การจัดส่ง
          </h4>

          <div class="row bg-light p-4 rounded">
            <div>
              <p>ที่อยู่การจัดส่ง : {{ member.memAddress }}</p>
            </div>
            <div>
              <label for="memAddress" class="form-label"
                >แก้ไขที่อยู่ของท่านที่นี่</label
              >
              <input
                type="text"
                class="form-control"
                id="memAddress"
                v-model="member.memAddress"
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
    <ErrorPage/>
  </div>
</template>

<script>
import ErrorPage from '../components/error.vue';
import axios from "axios";
axios.defaults.withCredentials = true;

export default {
  name: "ManageAddress",
  components: {
    ErrorPage,
  },
  data() {
    return {
      member: [],
      cusId: null,
    };
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
        this.member = res.data;
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
      const updatedData = {
        memAddress: this.member.memAddress,
      };
      try {
        const response = await axios.put(
          "http://localhost:3000/members/update",
          updatedData
        );
        alert(response.data.messageUpdate);
      } catch (error) {
        console.error(error);
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล!");
      }
    },
  },
};
</script>
