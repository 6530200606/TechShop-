<template>
  <div>
    <!-- Carousel Header Section -->
    <div
      id="carouselExampleAutoplaying"
      class="carousel slide header"
      data-bs-ride="carousel"
      data-bs-wrap="true"
    >
      <div class="carousel-inner">
        <div
          class="carousel-item"
          :class="{ active: index === 0 }"
          v-for="(image, index) in images"
          :key="index"
        >
          <img :src="image" class="d-block carousel-img" alt="carousel image" />
        </div>
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="prev"
      >
        <span
          class="carousel-control-prev-icon bg-dark rounded-circle"
          aria-hidden="true"
        ></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="next"
      >
        <span
          class="carousel-control-next-icon bg-dark rounded-circle"
          aria-hidden="true"
        ></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

    <div id="service" class="py-5">
      <div class="container box">
        <!-- Logos Section -->
        <div class="row row-cols-2 row-cols-md-5 g-3">
          <div class="col" v-for="(brand, brandId) in brands" :key="brandId">
            <a
              class="card-link"
              @click="goToPageProducts(brand.brandId, brand.brandName)"
            >
              <div class="card" style="height: 120px">
                <!-- ปรับความสูงของการ์ด -->
                <img
                  :src="brand.image"
                  class="card-img-top"
                  style="height: 100%; object-fit: contain; padding: 5px"
                />
              </div>
            </a>
          </div>
        </div>

        <!-- Products Section -->
        <div class="row row-cols-1 row-cols-md-3 g-4 mt-5">
          <div class="col" v-for="(pd, pdId) in products" :key="pdId">
            <router-link
              :to="{ name: 'ProductShow', params: { pdId: pd.pdId } }"
              class="card-link"
              style="text-decoration: none"
            >
              <div
                class="card"
                style="height: 100%; border-radius: 10px"
              >
                <img
                  :src="pd.image"
                  class="card-img-top"
                  alt="..."
                  style="border-radius: 10px 10px 0 0"
                />
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
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HomeDetail",
  data() {
    return {
      products: [],
      brands: [],
      images: [],
    };
  },
  mounted() {
    window.scrollTo(0, 0);
    this.loadImages();
    axios
      .get("http://localhost:3000/products")
      .then((res) => {
        this.products = res.data;
      })
      .catch((err) => {
        console.error(err);
      });

    axios
      .get("http://localhost:3000/brands")
      .then((res) => {
        this.brands = res.data;
      })
      .catch((err) => {
        console.error(err);
      });
  },
  methods: {
    goToPageProducts(brandId, brandName) {
      this.$router.push({
        path: "/products",
        query: { brand: brandId, brandName: brandName },
      });
    },
    loadImages() {
      // ดึงชื่อไฟล์ภาพจาก public/images และสร้าง URL สำหรับภาพแต่ละภาพ
      const context = require.context(
        "@/assets/banner",
        false,
        /\.(png|jpe?g|svg)$/
      );
      this.images = context
        .keys()
        .map((file) => require(`@/assets/banner/${file.replace("./", "")}`));
    },
  },
};
</script>

<style scoped>
.carousel-img {
  width: 100vw; /* เต็มความกว้างของหน้าจอ */
  height: 60vh; /* ความสูงจะปรับตามสัดส่วนของภาพ */
  object-fit: cover; /* ครอบคลุมพื้นที่อย่างเหมาะสม */
}

.card {
  margin: 1rem; /* เพิ่มระยะห่างระหว่างการ์ด */
  cursor: pointer;
  transition: transform 0.2s; /* เอฟเฟกต์การขยายเมื่อ hover */
}

.card:hover {
  transform: scale(1.05); /* ขยายการ์ดเมื่อ hover */
}

.card-link {
  display: block;
  text-decoration: none;
  color: inherit;
}
</style>
