<template>
  <div id="service">
    <!-- ถ้ามีสินค้าให้แสดงผล -->
    <div class="container box" v-if="products.length > 0">
      <h2 class="mt-5">ผลการค้นหาสำหรับ: {{ searchQuery }}</h2>
      <div class="row row-cols-1 row-cols-md-3 g-4 mt-5">
        <div class="col" v-for="(pd, pdId) in products" :key="pdId">
          <router-link
            :to="{ name: 'ProductShow', params: { pdId: pd.pdId } }"
            class="card-link"
            style="text-decoration: none"
          >
            <div class="card" style="width: 398px; height: 500px">
              <img :src="pd.image" class="card-img-top" alt="Product image" />
              <div class="card-body">
                <h5 class="card-title" style="font-size: 1.15rem">
                  {{ pd.pdName }}
                </h5>
                <p
                  class="card-text"
                  style="font-size: 1.5rem; color: red; font-weight: bold"
                >
                  {{ pd.pdPrice }}.-
                </p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- ถ้าไม่มีสินค้าให้แสดงข้อความ -->
    <div class="container box" v-else>
      <h2 class="mt-5">ไม่พบข้อมูลที่คุณกำลังค้นหา</h2>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "PageProduct",
  data() {
    return {
      searchQuery: null, // เก็บคำค้นหา
      products: [], // เก็บรายการสินค้า
    };
  },
  mounted() {
    window.scrollTo(0, 0);
    this.loadProducts();
  },

  methods: {
    // ค้นหาสินค้าตามคำค้นหา
    searchProduct(searchQuery) {
      axios
        .get(`http://localhost:3000/products/search/${searchQuery}`)
        .then((res) => {
          this.products = res.data;
        })
        .catch((err) => {
          console.error(err);
          this.products = []; // ถ้ามีข้อผิดพลาด ตั้งค่าสินค้าเป็น array ว่าง
        });
    },
    // ค้นหาสินค้าตามแบรนด์
    getProductByBrandId(brandId) {
      axios
        .get(`http://localhost:3000/products/brands/${brandId}`)
        .then((res) => {
          this.products = res.data;
        })
        .catch((err) => {
          console.error(err);
          this.products = []; // ถ้ามีข้อผิดพลาด ตั้งค่าสินค้าเป็น array ว่าง
        });
    },
    // ค้นหาสินค้าตามประเภท
    getProductByTypeId(typeId) {
      axios
        .get(`http://localhost:3000/products/types/${typeId}`)
        .then((res) => {
          this.products = res.data;
        })
        .catch((err) => {
          console.error(err);
          this.products = []; // ถ้ามีข้อผิดพลาด ตั้งค่าสินค้าเป็น array ว่าง
        });
    },
    // Handle type and brand search queries
    loadProducts() {
      const query = this.$route.query;
      if (query.search) {
        this.searchQuery = query.search;
        this.searchProduct(query.search);
      } else if (query.brand) {
        this.searchQuery = query.brandName || "Brand Products";
        this.getProductByBrandId(query.brand);
      } else if (query.type) {
        this.searchQuery = query.typeName || "Type Products";
        this.getProductByTypeId(query.type);
      }
    },
  },

  watch: {
    // Watch for changes in query parameters
    "$route.query.search"(newSearch) {
      if (newSearch) {
        this.searchQuery = newSearch;
        this.searchProduct(newSearch);
      }
    },
    "$route.query.brand"(newBrandId) {
      if (newBrandId) {
        this.searchQuery = this.$route.query.brandName || "Brand Products";
        this.getProductByBrandId(newBrandId);
      }
    },
    "$route.query.type"(newTypeId) {
      if (newTypeId) {
        this.searchQuery = this.$route.query.typeName || "Type Products";
        this.getProductByTypeId(newTypeId);
      }
    },
  },
};
</script>

<style >
body {
  padding-top: 5rem;
}
</style>