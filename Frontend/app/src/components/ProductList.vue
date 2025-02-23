<template>
  <div v-if="dutyId !== 'admin' && dutyId !== 'employee'">
    <ErrorPage />
  </div>
  <div v-else>
    <div class="product-management-container">
      <h2 class="mt-5 mx-3 mb-3"><strong>จัดการข้อมูลสินค้า</strong></h2>

      <!-- Filter Input Fields -->
      <div class="filter-container">
        <input
          type="text"
          class="form-control search-input"
          placeholder="รหัสสินค้า"
          v-model="searchText"
        />
        <input
          type="text"
          class="form-control search-input"
          placeholder="ชื่อสินค้า"
          v-model="productName"
        />
        <select class="form-control" v-model="selectedCategory">
          <option value="">ทั้งหมด</option>
          <option v-for="item in types" :key="item.typeId" :value="item.typeId">
            {{ item.typeName }}
          </option>
        </select>
        <select class="form-control" v-model="selectedBrand">
          <option value="">แบรนด์</option>
          <option
            v-for="item in brands"
            :key="item.brandId"
            :value="item.brandId"
          >
            {{ item.brandName }}
          </option>
        </select>
        <button class="btn btn-primary btn-search" @click="applyFilters">
          ค้นหา
        </button>
        <button class="btn btn-success btn-add" @click="showOverlay = true">
          เพิ่มสินค้า
        </button>
      </div>

      <!-- Product Table -->
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>รูปภาพ</th>
                      <th>รหัสสินค้า</th>
                      <th>ชื่อสินค้า</th>
                      <th>ราคา</th>
                      <th>จำนวนในสต็อก</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="product in paginatedProducts"
                      :key="product.productId"
                    >
                      <td>
                        <img
                          :src="product.image"
                          alt="Product Image"
                          class="product-image"
                        />
                      </td>
                      <td>{{ product.pdId }}</td>
                      <td>{{ product.pdName }}</td>
                      <td>{{ formatPrice(product.pdPrice) }}</td>
                      <td>{{ product.stock }}</td>
                      <td>
                        <button
                          class="btn btn-outline-primary btn-sm btn-action"
                          @click="showEditOverlay(product)"
                        >
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button
                          class="btn btn-outline-danger btn-sm btn-action"
                          @click="deleteProduct(product.pdId)"
                        >
                          <i class="bi bi-trash3"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
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

      <div v-if="showOverlay" class="overlay">
        <div class="overlay-content">
          <h3 class="overlay-title">เพิ่มสินค้าใหม่</h3>
          <form @submit.prevent="addProductConfirm()">
            <label for="productTitle">ชื่อสินค้า</label>
            <input
              type="text"
              id="productTitle"
              class="form-control"
              v-model="addProduct.pdName"
              placeholder="ชื่อสินค้า"
              required
            />

            <label for="productCategory">ประเภทสินค้า</label>
            <select
              id="productCategory"
              class="form-control"
              v-model="addProduct.typeId"
              required
            >
              <option value="" disabled selected>-- Select Category --</option>
              <option
                v-for="item in types"
                :key="item.typeId"
                :value="item.typeId"
              >
                {{ item.typeName }}
              </option>
            </select>

            <label for="productBrand">แบรนด์สินค้า</label>
            <select
              id="productBrand"
              class="form-control"
              v-model="addProduct.brandId"
              required
            >
              <option value="" disabled selected>-- Select Brand --</option>
              <option
                v-for="item in brands"
                :key="item.brandId"
                :value="item.brandId"
              >
                {{ item.brandName }}
              </option>
            </select>

            <label for="productBrief">คำอธิบายสินค้า</label>
            <textarea
              id="productBrief"
              class="form-control"
              placeholder="Write your product brief..."
              v-model="addProduct.pdDescribe"
            ></textarea>

            <div class="num-container">
              <div>
                <label for="price">ราคา</label>
                <input
                  type="number"
                  id="price"
                  class="form-control"
                  placeholder="1 THB"
                  v-model.number="addProduct.pdPrice"
                  @change="validatePrice(addProduct.pdPrice)"
                  min="1"
                  required
                />
                <span v-if="priceError" class="text-danger">{{
                  priceError
                }}</span>
              </div>
              <div>
                <label for="warranty">ประกัน</label>
                <input
                  type="number"
                  id="warranty"
                  class="form-control"
                  placeholder="1 Months"
                  v-model.number="addProduct.warranty"
                  @change="validateWarranty(addProduct.warranty)"
                  min="1"
                  required
                />
                <span v-if="warrantyError" class="text-danger">{{
                  warrantyError
                }}</span>
              </div>
              <div>
                <label for="quantity">จำนวน</label>
                <input
                  type="number"
                  id="quantity"
                  class="form-control"
                  placeholder="1"
                  v-model.number="addProduct.stock"
                  @change="validateQuantity(addProduct.stock)"
                  min="1"
                  required
                />
                <span v-if="quantityError" class="text-danger">{{
                  quantityError
                }}</span>
              </div>
            </div>

            <div class="image-upload">
              <label for="uploadImage">อัพโหลดรูปภาพ</label>
              <input
                type="text"
                id="uploadImage"
                class="form-control"
                placeholder="Image's URL"
                v-model="addProduct.image"
                required
              />
            </div>

            <div class="button-container">
              <button
                type="button"
                class="cancel-button"
                @click="showOverlay = false"
              >
                ยกเลิก
              </button>
              <button type="submit" class="add-button">ตกลง</button>
            </div>
          </form>
        </div>
      </div>

      <div v-if="isEditOverlayVisible" class="overlay">
        <div class="overlay-content">
          <h3 class="overlay-title">แก้ไขข้อมูลสินค้า</h3>
          <form @submit.prevent="updateProduct">
            <label for="productName">ชื่อสินค้า</label>
            <input
              type="text"
              id="productName"
              class="form-control"
              v-model="editProducts.pdName"
              placeholder="ชื่อสินค้า"
              required
            />

            <label for="Category">ประเภทสินค้า</label>
            <select
              id="Category"
              class="form-control"
              v-model="editProducts.typeId"
              required
            >
              <option value="" disabled selected>-- Select Category --</option>
              <option
                v-for="item in types"
                :key="item.typeId"
                :value="item.typeId"
              >
                {{ item.typeName }}
              </option>
            </select>

            <label for="Brand">แบรนด์สินค้า</label>
            <select
              id="Brand"
              class="form-control"
              v-model="editProducts.brandId"
              required
            >
              <option value="" disabled selected>-- Select Brand --</option>
              <option
                v-for="item in brands"
                :key="item.brandId"
                :value="item.brandId"
              >
                {{ item.brandName }}
              </option>
            </select>

            <label for="productDescription">คำอธิบายสินค้า</label>
            <textarea
              id="productDescription"
              class="form-control"
              v-model="editProducts.pdDescribe"
            ></textarea>

            <div class="num-container">
              <div>
                <label for="productPrice">ราคา</label>
                <input
                  type="number"
                  id="productPrice"
                  class="form-control"
                  v-model.number="editProducts.pdPrice"
                  @change="validatePrice(editProducts.pdPrice)"
                  min="1"
                  required
                />
                <span v-if="priceError" class="text-danger">{{
                  priceError
                }}</span>
              </div>
              <div>
                <label for="pdwarranty">ประกัน</label>
                <input
                  type="number"
                  id="pdwarranty"
                  class="form-control"
                  v-model.number="editProducts.warranty"
                  @change="validateWarranty(editProducts.warranty)"
                  min="1"
                  required
                />
                <span v-if="warrantyError" class="text-danger">{{
                  warrantyError
                }}</span>
              </div>
              <div>
                <label for="pdquantity">จำนวน</label>
                <input
                  type="number"
                  id="pdquantity"
                  class="form-control"
                  placeholder="1"
                  v-model.number="editProducts.stock"
                  @change="validateQuantity(editProducts.stock)"
                  min="1"
                  required
                />
                <span v-if="quantityError" class="text-danger">{{
                  quantityError
                }}</span>
              </div>
            </div>

            <div class="image-upload">
              <label for="pduploadImage">อัพโหลดรูปภาพ</label>
              <input
                type="text"
                id="pduploadImage"
                class="form-control"
                placeholder="Image's URL"
                v-model="editProducts.image"
                required
              />
            </div>

            <div class="button-container">
              <button
                type="button"
                class="cancel-button"
                @click="isEditOverlayVisible = false"
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
import axios from "axios";
axios.defaults.withCredentials = true;
import ErrorPage from "../components/error.vue";

export default {
  name: "ProductList",
  components: {
    ErrorPage,
  },
  data() {
    return {
      loginEmail: null,
      dutyId: null,
      products: [],
      brands: [],
      types: [],
      filteredProducts: [],
      searchText: null,
      selectedCategory: "",
      selectedBrand: "",
      showOverlay: false,
      productName: null,
      currentPage: 1, // เพิ่มสถานะหน้าปัจจุบัน
      itemsPerPage: 7, // จำนวนสินค้าที่จะแสดงต่อหน้า
      addProduct: {
        pdName: null,
        brandId: null,
        typeId: null,
        pdPrice: null,
        warranty: null,
        stock: null,
        image: null,
        pdDescribe: null,
      },
      isEditOverlayVisible: false,
      editProducts: [],
      priceError: null,
      warrantyError: null,
      quantityError: null,
    };
  },

  computed: {
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredProducts.slice(start, start + this.itemsPerPage);
    },
    totalItems() {
      return this.filteredProducts.length;
    },
  },

  async mounted() {
    window.scrollTo(0, 0);
    await this.chkSession();
    await this.getProductList();
    await this.getBrand();
    await this.getType();
    this.filteredProducts = this.products;
  },

  methods: {
    // ฟังก์ชันที่เรียกใช้งานเมื่อเปลี่ยนหน้า
    changePage(page) {
      this.currentPage = page;
    },

    // ปรับปรุง applyFilters ให้คำนวณจำนวนสินค้าทั้งหมด
    applyFilters() {
      this.filteredProducts = this.products.filter((product) => {
        const matchesSearch = this.searchText
          ? product.pdId.includes(this.searchText) ||
            product.pdName.includes(this.searchText)
          : true;

        const matchesCategory = this.selectedCategory
          ? product.typeId === this.selectedCategory
          : true;

        const matchesBrand = this.selectedBrand
          ? product.brandId === this.selectedBrand
          : true;

        return matchesSearch && matchesCategory && matchesBrand;
      });

      this.totalItems = this.filteredProducts.length; // อัปเดตจำนวนสินค้าทั้งหมด
      this.currentPage = 1; // รีเซ็ตหน้าปัจจุบัน
    },
    async getProductList() {
      const response = await axios.get("http://localhost:3000/products");
      this.products = response.data;
      this.filteredProducts = this.products;
    },

    async getBrand() {
      const response = await axios.get("http://localhost:3000/brands");
      this.brands = response.data;
    },

    async getType() {
      const response = await axios.get("http://localhost:3000/types");
      this.types = response.data;
    },

    showEditOverlay(product) {
      this.editProducts = product;
      this.isEditOverlayVisible = true;
    },

    async addProductConfirm() {
      try {
        const response = await axios.post(
          "http://localhost:3000/products",
          this.addProduct
        );
        if (response.data.messageAddProduct === `เพิ่มสินค้าเรียบร้อยแล้ว`) {
          alert(response.data.messageAddProduct);
          this.addProduct = {
            pdName: null,
            typeId: null,
            brandId: null,
            pdDescribe: null,
            pdPrice: null,
            stock: null,
            warranty: null,
            image: null,
          };
          this.showOverlay = false;
          await this.getProductList();
        } else {
          alert(response.data.messageAddProduct);
        }
      } catch (error) {
        // ตรวจสอบว่ามี error.response หรือไม่
        if (error.response) {
          // แสดง message จาก backend
          alert(
            error.response.data.messageAddProduct ||
              "เกิดข้อผิดพลาด กรุณาลองใหม่ในภายหลัง"
          );
        } else {
          console.error("Error adding product:", error);
          alert("เกิดข้อผิดพลาด กรุณาลองใหม่ในภายหลัง");
        }
      }
    },

    async updateProduct() {
      try {
        const response = await axios.put(
          `http://localhost:3000/products/${this.editProducts.pdId}`,
          this.editProducts
        );
        if (response.data.messageUpdate === `แก้ไขข้อมูลเสร็จสิ้น`) {
          alert(response.data.messageUpdate);
          this.editProducts = [];
          this.isEditOverlayVisible = false;
          await this.getProductList();
        } else {
          alert(response.data.messageUpdate);
        }
      } catch (error) {
        // ตรวจสอบว่ามี error.response หรือไม่
        if (error.response) {
          // แสดง message จาก backend
          alert(
            error.response.data.messageUpdate ||
              "เกิดข้อผิดพลาด กรุณาลองใหม่ในภายหลัง"
          );
        } else {
          console.error("Error adding product:", error);
          alert("เกิดข้อผิดพลาด กรุณาลองใหม่ในภายหลัง");
        }
      }
    },

    closeEditOverlay() {
      this.isEditOverlayVisible = false;
    },

    async deleteProduct(productId) {
      const confirmDel = confirm(`ต้องการลบสินค้ารหัส: ${productId} หรือไม่?`);
      if (confirmDel) {
        try {
          const response = await axios.post(
            `http://localhost:3000/products/delete/${productId}`
          );
          if (response.status === 204) {
            alert(`ลบข้อมูลสินค้ารหัส ${productId} เรียบร้อยแล้ว`);
            await this.getProductList();
          }
        } catch (error) {
          console.error("Error deleting product:", error);
        }
      }
    },

    validatePrice(price) {
      if (price < 1) {
        this.priceError = "ราคาไม่สามารถน้อยกว่า 1 ได้";
      } else {
        this.priceError = null; // Clear error message if valid
      }
    },

    validateWarranty(warranty) {
      if (warranty < 1) {
        this.warrantyError = "ระยะเวลาประกันไม่สามารถน้อยกว่า 1 เดือน";
      } else {
        this.warrantyError = null; // Clear error message if valid
      }
    },

    validateQuantity(stock) {
      if (stock < 1) {
        this.quantityError = "จำนวนสินค้าไม่สามารถน้อยกว่า 1 ได้";
      } else {
        this.quantityError = null; // Clear error message if valid
      }
    },

    formatPrice(price) {
      return `${price.toFixed(2)} THB`;
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
.product-management-container {
  margin: 20px;
  font-family: "Arial", sans-serif;
}

.filter-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  border-radius: 25px;
  padding: 10px;
}

.table th,
.table td {
  text-align: center;
  vertical-align: middle;
}

.card {
  cursor: default;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-search {
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 1.25rem;
}

.btn-add {
  border-radius: 10px;
  padding: 10px 30px; /* เพิ่ม padding ทางด้านข้าง */
  min-width: 150px; /* เพิ่มความกว้างขั้นต่ำ */
  font-size: 1.25rem;
}

.btn-outline-info {
  border-radius: 25px;
}

.btn-action {
  border-radius: 20px;
  padding: 5px 12px;
  margin: 5px;
  align-items: center;
  gap: 5px;
  transition: background-color 0.3s, color 0.3s;
}

.btn-outline-primary {
  color: #007bff;
}

.btn-outline-primary:hover {
  background-color: #007bff;
  color: white;
}

.btn-outline-danger {
  color: #dc3545;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
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

.num-container {
  display: flex;
  gap: 15px;
}

.num-container div {
  flex: 1;
}

.image-upload {
  border: 2px dashed #ddd;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  color: #666;
}

.btn {
  height: 50px;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
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
</style>
