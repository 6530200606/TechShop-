<template>
  <div v-if="dutyId !== 'admin'">
    <ErrorPage />
  </div>
  <div v-else>
    <div class="employee-management-container">
      <h2 class="mt-5 mx-3 mb-3"><strong>จัดการข้อมูลพนักงาน</strong></h2>

      <!-- Filter Input Fields -->
      <div class="filter-container">
        <input
          type="text"
          class="form-control search-input"
          placeholder="อีเมลพนักงาน"
          v-model="employeeEmail"
        />
        <input
          type="text"
          class="form-control search-input"
          placeholder="ชื่อพนักงาน"
          v-model="employeeName"
        />
        <select class="form-control" v-model="selectedRole">
          <option value="">สิทธิ์การเข้าใช้งาน</option>
          <option
            v-for="(role, index) in uniqueRoles"
            :key="index"
            :value="role"
          >
            {{ role }}
          </option>
        </select>

        <button class="btn btn-primary btn-search" @click="applyFilters">
          ค้นหา
        </button>
        <button class="btn btn-success btn-add" @click="showOverlay = true">
          เพิ่มพนักงาน
        </button>
      </div>

      <!-- Employee Table -->
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>อีเมล</th>
                      <th>ชื่อพนักงาน</th>
                      <th>เบอร์โทรศัพท์</th>
                      <th>สิทธิ์การเข้าใช้งาน</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="employee in paginatedEmployees"
                      :key="employee.id"
                    >
                      <td>{{ employee.adminEmail }}</td>
                      <td>
                        {{ employee.adminName }} {{ employee.adminSurname }}
                      </td>
                      <td>{{ employee.adminTel }}</td>
                      <td>{{ employee.dutyId }}</td>
                      <td>
                        <button
                          class="btn btn-outline-purple btn-sm btn-action"
                          @click="showEditPassOverlay(employee)"
                        >
                          <i class="bi bi-key"></i>
                        </button>
                        <button
                          class="btn btn-outline-primary btn-sm btn-action"
                          @click="showEditOverlay(employee)"
                        >
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button
                          class="btn btn-outline-danger btn-sm btn-action"
                          @click="deleteEmployee(employee.adminEmail)"
                        >
                          <i class="bi bi-trash3"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <!-- Pagination -->
                <div class="pagination">
                  <button
                    v-for="page in Math.ceil(totalItems / itemsPerPage)"
                    :key="page"
                    @click="changePage(page)"
                    :class="{ active: currentPage === page }"
                  >
                    {{ page }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Overlay for Adding Employee -->
      <div v-if="showOverlay" class="overlay">
        <div class="overlay-content">
          <h3 class="overlay-title">เพิ่มพนักงานใหม่</h3>
          <form @submit.prevent="addEmployee">
            <div class="form-container">
              <div class="name-fields">
                <div class="form-group">
                  <label for="employeeName">ชื่อพนักงาน</label>
                  <input
                    type="text"
                    id="employeeName"
                    class="form-control"
                    v-model="employeeData.adminName"
                    placeholder="ชื่อพนักงาน"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="employeeSurname">นามสกุลพนักงาน</label>
                  <input
                    type="text"
                    id="employeeSurname"
                    class="form-control"
                    v-model="employeeData.adminSurname"
                    placeholder="นามสกุลพนักงาน"
                    required
                  />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="employeeTel">เบอร์โทรศัพท์</label>
              <input
                type="tel"
                id="employeeTel"
                class="form-control"
                v-model="employeeData.adminTel"
                placeholder="เบอร์โทรศัพท์"
                required
              />
            </div>

            <div class="form-group">
              <label for="employeeEmail">อีเมลบริษัท</label>
              <input
                type="email"
                id="employeeEmail"
                class="form-control"
                v-model="employeeData.adminEmail"
                placeholder="อีเมลบริษัท"
                required
              />
            </div>

            <div class="form-group">
              <label for="password">รหัสผ่าน</label>
              <div class="input-group d-flex align-items-center">
                <input
                  type="password"
                  id="password"
                  class="form-control"
                  style="width: 70%"
                  v-model="employeeData.password"
                  placeholder="รหัสผ่าน"
                  required
                />
                <span
                  class="input-group-text custom-input-group"
                  @click="togglePasswordVisibility"
                  style="
                    cursor: pointer;
                    border: none;
                    background: transparent;
                    margin-left: 5px;
                  "
                >
                  <i
                    :class="passwordVisible ? 'bi bi-eye' : 'bi bi-eye-slash'"
                  ></i>
                </span>
              </div>
            </div>

            <div class="form-group">
              <label for="employeePosition">สิทธิ์การเข้าใช้งาน</label>
              <select
                id="employeePosition"
                class="form-control"
                v-model="employeeData.dutyId"
                required
              >
                <option value="" disabled selected>
                  -- เลือกสิทธิ์การเข้าใช้งาน --
                </option>
                <option
                  v-for="(role, index) in uniqueRoles"
                  :key="index"
                  :value="role"
                >
                  {{ role }}
                </option>
              </select>
            </div>

            <div class="button-container">
              <button
                type="button"
                class="cancel-button"
                @click="showOverlay = false"
              >
                ยกเลิก
              </button>
              <button type="submit" class="add-button">บันทึก</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Overlay for Editing Employee -->
      <div v-if="EditOverlay" class="overlay">
        <div class="overlay-content">
          <h3 class="overlay-title">แก้ไขข้อมูลผู้ใช้ระบบ</h3>
          <form @submit.prevent="updateEmployee">
            <div class="form-container">
              <div class="name-fields">
                <div class="form-group">
                  <label for="employeeName">ชื่อพนักงาน</label>
                  <input
                    type="text"
                    id="employeeName"
                    class="form-control"
                    v-model="employeeDataEdit.adminName"
                    placeholder="ชื่อพนักงาน"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="employeeSurname">นามสกุลพนักงาน</label>
                  <input
                    type="text"
                    id="employeeSurname"
                    class="form-control"
                    v-model="employeeDataEdit.adminSurname"
                    placeholder="นามสกุลพนักงาน"
                    required
                  />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="employeeTel">เบอร์โทรศัพท์</label>
              <input
                type="tel"
                id="employeeTel"
                class="form-control"
                v-model="employeeDataEdit.adminTel"
                placeholder="เบอร์โทรศัพท์"
                required
              />
            </div>

            <div class="form-group">
              <label for="employeeEmail">อีเมลบริษัท</label>
              <input
                type="email"
                id="employeeEmail"
                class="form-control"
                v-model="employeeDataEdit.adminEmail"
                placeholder="อีเมลบริษัท"
                required
                readonly
              />
            </div>

            <div class="form-group">
              <label for="employeePosition">สิทธิ์การเข้าใช้งาน</label>
              <select
                id="employeePosition"
                class="form-control"
                v-model="employeeDataEdit.dutyId"
                required
                :disabled="employeeDataEdit.adminEmail === loginEmail"
                :style="{
                  backgroundColor:
                    employeeDataEdit.adminEmail === loginEmail
                      ? '#e0e0e0'
                      : 'white',
                  cursor:
                    employeeDataEdit.adminEmail === loginEmail
                      ? 'not-allowed'
                      : 'pointer',
                }"
              >
                <option value="" disabled selected>
                  -- เลือกสิทธิ์การเข้าใช้งาน --
                </option>
                <option value="admin">admin</option>
                <option value="employee">employee</option>
              </select>
            </div>

            <div class="button-container">
              <button
                type="button"
                class="cancel-button"
                @click="EditOverlay = false"
              >
                ยกเลิก
              </button>
              <button type="submit" class="add-button">บันทึก</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Overlay for Changing Password -->
      <div v-if="EditPassOverlay" class="overlay">
        <div class="overlay-content">
          <h3 class="overlay-title">เปลี่ยนรหัสผ่าน</h3>
          <form @submit.prevent="updatePassword">
            <div class="form-group">
              <label for="newPassword">รหัสผ่านใหม่</label>
              <input
                type="password"
                id="newPassword"
                class="form-control"
                v-model="newPassword"
                placeholder="รหัสผ่านใหม่"
                required
              />
            </div>
            <div class="form-group">
              <label for="confirmPassword">ยืนยันรหัสผ่าน</label>
              <input
                type="password"
                id="confirmPassword"
                class="form-control"
                v-model="confirmPassword"
                placeholder="ยืนยันรหัสผ่าน"
                required
              />
            </div>
            <div class="button-container">
              <button
                type="button"
                class="cancel-button"
                @click="EditPassOverlay = false"
              >
                ยกเลิก
              </button>
              <button type="submit" class="add-button">บันทึก</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ErrorPage from "../components/error.vue";
import axios from "axios";
axios.defaults.withCredentials = true;
export default {
  name: "employeeList",
  components: {
    ErrorPage,
  },
  data() {
    return {
      loginEmail: null,
      dutyId: null,
      employees: [],
      filteredEmployees: [],
      employeeEmail: "",
      employeeName: "",
      selectedRole: "",
      showOverlay: false,
      EditOverlay: false,
      EditPassOverlay: false,
      isEditMode: false,
      employeeData: {},
      employeeDataEdit: {},
      currentPage: 1,
      itemsPerPage: 7,
      passwordVisible: false,
      newPassword: "",
      confirmPassword: "",
    };
  },
  computed: {
    uniqueRoles() {
      return [...new Set(this.employees.map((employee) => employee.dutyId))];
    },
    paginatedEmployees() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredEmployees.slice(start, start + this.itemsPerPage);
    },
    totalItems() {
      return this.filteredEmployees.length;
    },
  },
  async mounted() {
    window.scrollTo(0, 0);
    await this.chkSession();
    await this.getEmployeeList();
    this.filteredEmployees = this.employees;
  },
  methods: {
    changePage(page) {
      this.currentPage = page;
    },
    applyFilters() {
      this.filteredEmployees = this.employees.filter((employee) => {
        const matchesSearch = this.searchText
          ? employee.adminEmail.includes(this.searchText) ||
            employee.adminName.includes(this.searchText)
          : true;
        const matchesRole = this.selectedRole
          ? employee.dutyId === this.selectedRole
          : true;
        return matchesSearch && matchesRole;
      });
    },
    async getEmployeeList() {
      await this.chkSession();
      const response = await axios.get("http://localhost:3000/admins");
      this.employees = response.data;
      this.filteredEmployees = this.employees;
    },
    showEditOverlay(employee) {
      this.employeeDataEdit = { ...employee };
      this.EditOverlay = true;
    },
    showEditPassOverlay(employee) {
      this.employeeDataEdit = { ...employee };
      this.EditPassOverlay = true;
    },
    async addEmployee() {
      try {
        console.log(this.employeeData);
        console.log(this.employeeData.dutyId);
        console.log(this.employeeData.password);
        const response = await axios.post(
          "http://localhost:3000/admins",
          this.employeeData
        );
        if (response.data.messageregister === `ลงทะเบียนผู้ใช้ระบบสำเร็จ`) {
          alert(response.data.messageregister);
          this.employeeData = {};
          this.showOverlay = false;
          await this.getEmployeeList();
        } else {
          alert(response.data.messageregister);
          console.log();
        }
      } catch (error) {
        console.log(error);
        alert(`เกิดข้อผิดพลาดในการเพิ่มผู้ใช้ระบบ`);
      }
    },
    async updateEmployee() {
      try {
        const response = await axios.put(
          `http://localhost:3000/admins/update`,
          this.employeeDataEdit
        );

        if (response.data.messageUpdate === "บันทึกข้อมูลสำเร็จ") {
          alert(response.data.messageUpdate);
          this.employeeDataEdit = {};
          this.EditOverlay = false;
          await this.getEmployeeList();
        } else {
          // แสดงข้อความ error ที่ส่งมาจาก response ถ้ามี
          alert(response.data.messageUpdate || "เกิดข้อผิดพลาด");
        }
      } catch (error) {
        // แสดงข้อความ error ที่ได้รับจากเซิร์ฟเวอร์
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

    async updatePassword() {
      if (this.newPassword !== this.confirmPassword) {
        window.alert("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน");
        return;
      }
      try {
        const response = await axios.put(
          `http://localhost:3000/admins/update`,
          {
            adminEmail: this.employeeDataEdit.adminEmail,
            password: this.newPassword,
          }
        );
        if (response.data.messageUpdate === "บันทึกข้อมูลสำเร็จ") {
          alert(response.data.messageUpdate);
          this.employeeDataEdit = {};
          this.newPassword = "";
          this.confirmPassword = "";
          this.EditPassOverlay = false;
          await this.getEmployeeList();
        }
      } catch (err) {
        console.error("Error changing password:", err);
        window.alert("เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
      }
    },
    async deleteEmployee(id) {
      // Delete employee logic here
      if (id === this.loginEmail) {
        alert("ไม่สามารถลบบัญชีที่ตนกำลังเข้าสู่ระบบอยู่ได้");
        return;
      }
      const confirmDel = confirm(`ต้องการลบบัญชี: ${id} ออกจาากระบบหรือไม่?`);
      if (confirmDel) {
        try {
          const response = await axios.delete(
            `http://localhost:3000/admins/${id}`
          );
          if (response.status === 204) {
            alert(`ลบข้อมูลสินค้ารหัส ${id} เรียบร้อยแล้ว`);
            await this.getEmployeeList();
          }
        } catch (error) {
          console.error("Error deleting product:", error);
        }
      }
    },
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
      const passwordField = document.getElementById("password");
      passwordField.type = this.passwordVisible ? "text" : "password";
    },
    async chkSession() {
      await axios
        .get(`http://localhost:3000/admins/getss`)
        .then((res) => {
          this.loginEmail = res.data.email;
          this.dutyId = res.data.dutyId;
          console.log(this.loginEmail);
          console.log(this.dutyId);
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>

<style scoped>
.employee-management-container {
  margin: 20px;
  font-family: "Arial", sans-serif;
}

.employee-management-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.employee-management-table th,
.employee-management-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.employee-management-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.employee-management-header {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.employee-management-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.employee-management-button:hover {
  background-color: #0056b3;
}

.filter-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.btn {
  height: 50px;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.btn-action {
  margin: 5px;
  align-items: center;
  gap: 5px;
  transition: background-color 0.3s, color 0.3s;
}

.btn-search {
  border-radius: 10px;
  padding: 10px 20px;
}

.btn-add {
  border-radius: 10px;
  padding: 10px 30px; /* เพิ่ม padding ทางด้านข้าง */
  min-width: 150px; /* เพิ่มความกว้างขั้นต่ำ */
}

.btn-outline-info {
  border-radius: 25px;
}

/* Overlay Styling */
.overlay {
  position: fixed;
  margin-top: 40px;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.overlay-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  font-family: Arial, sans-serif;
}

.overlay-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.form-control {
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: border-color 0.3s;
}

.form-control:focus {
  border-color: #4a90e2;
  outline: none;
  box-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
}

.button-container {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}

.cancel-button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  width: 20%;
}

.add-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  width: 20%;
}

.pagination {
  margin-top: 20px;
}

.pagination button {
  margin: 0 5px;
}

.pagination button.active {
  font-weight: bold;
  text-decoration: underline;
}

.name-fields {
  display: flex;
  gap: 10px;
}

.name-fields .form-group {
  flex: 1;
}

.input-group {
  display: flex;
  align-items: center; /* จัดให้อยู่กลางบรรทัด */
}

.custom-input-group {
  padding: 10px;
}

input[readonly] {
  background-color: #f0f0f0; /* เปลี่ยนสีพื้นหลังเป็นเทา */
  cursor: not-allowed; /* แสดงลูกศรแบบไม่อนุญาต */
}

.btn-outline-purple {
  color: #6f42c1; /* สีม่วง */
  border-color: #6f42c1; /* สีกรอบ */
}

.btn-outline-purple:hover {
  background-color: #6f42c1; /* สีพื้นเมื่อเอาเมาส์ไปวาง */
  color: white; /* เปลี่ยนสีตัวอักษรเมื่อเอาเมาส์ไปวาง */
}
</style>

