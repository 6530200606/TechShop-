import database from "../services/database.js"

export async function getAllProduct(req, res) {
    console.log('GET /products is requested')
    try {
        const result = await database.query(
            `SELECT p.*,(
                SELECT row_to_json(brand_obj)
                FROM(
                    SELECT "brandId", "brandName"
                    FROM brands
                    WHERE "brandId" = p."brandId"
                    ) brand_obj
                ) AS brand,
                (
                    SELECT row_to_json(type_obj)
                    FROM(
                        SELECT "typeId", "typeName"
                        FROM types
                        WHERE "typeId" = p."typeId"
                    ) type_obj
                ) AS type
            FROM products p WHERE "delStatus" = false ORDER BY "pdId" ASC`
        )
        return res.status(200).json(result.rows)
    }
    catch (err) {
        return res.status(500).json({ error: err.messsage })
    }
}

export async function getProductById(req, res) {
    console.log('GET /products is requested')
    try {
        const result = await database.query({
            text: `
                    SELECT p.*,(
                        SELECT row_to_json(brand_obj)
                        FROM(
                            SELECT "brandId", "brandName"
                            FROM brands
                            WHERE "brandId" = p."brandId"
                        ) brand_obj
                    ) AS brand,
                    (
                        SELECT row_to_json(type_obj)
                        FROM(
                            SELECT "typeId", "typeName"
                            FROM types
                            WHERE "typeId" = p."typeId"
                        ) type_obj
                    ) AS type
                    FROM products p
                    WHERE p."pdId" ILIKE $1 AND p."delStatus" = false
                `,
            values: [req.params.id]

        })
        if (result.rowCount == 0) {
            return res.status(404).json({ error: `Product not Found` })
        }
        return res.status(200).json(result.rows)
    }
    catch (err) {
        return res.status(500).json({ error: err.messsage })
    }
}

export async function getProductByBrandId(req, res) {
    console.log('GET /products is requested')
    try {
        const result = await database.query({
            text: `
                    SELECT p.*,(
                        SELECT row_to_json(brand_obj)
                        FROM(
                            SELECT "brandId", "brandName"
                            FROM brands
                            WHERE "brandId" = p."brandId"
                        ) brand_obj
                    ) AS brand,
                    (
                        SELECT row_to_json(type_obj)
                        FROM(
                            SELECT "typeId", "typeName"
                            FROM types
                            WHERE "typeId" = p."typeId"
                        ) type_obj
                    ) AS type
                    FROM products p
                    WHERE p."brandId" ILIKE $1 AND p."delStatus" = false
                `,
            values: [req.params.id]

        })
        if (result.rowCount == 0) {
            return res.status(404).json({ error: `Product not Found` })
        }
        return res.status(200).json(result.rows)
    }
    catch (err) {
        return res.status(500).json({ error: err.messsage })
    }
}

export async function getProductByTypeId(req, res) {
    console.log('GET /products is requested')
    try {
        const result = await database.query({
            text: `
                    SELECT p.*,(
                        SELECT row_to_json(brand_obj)
                        FROM(
                            SELECT "brandId", "brandName"
                            FROM brands
                            WHERE "brandId" = p."brandId"
                        ) brand_obj
                    ) AS brand,
                    (
                        SELECT row_to_json(type_obj)
                        FROM(
                            SELECT "typeId", "typeName"
                            FROM types
                            WHERE "typeId" = p."typeId"
                        ) type_obj
                    ) AS type
                    FROM products p
                    WHERE p."typeId" ILIKE $1 AND p."delStatus" = false
                `,
            values: [req.params.id]

        })
        if (result.rowCount == 0) {
            return res.status(404).json({ error: `Product not Found` })
        }
        return res.status(200).json(result.rows)
    }
    catch (err) {
        return res.status(500).json({ error: err.messsage })
    }
}

export async function getSearchProduct(req, res) {
    console.log(`GET /Search products is request ${req.params.id}`)
    try {
        const result = await database.query({
            text: `
                    SELECT p.*, b."brandName", t."typeName"
                    FROM products p
                    JOIN brands b ON p."brandId" = b."brandId"
                    JOIN types t ON p."typeId" = t."typeId"
                    WHERE (
                        p."pdId" ILIKE $1
                        OR p."pdName" ILIKE $1
                        OR t."typeName" ILIKE $1
                        OR b."brandName" ILIKE $1
                    )
                    AND p."delStatus" = false
                `,
            values: [`%${req.params.id}%`]

        })
        if (result.rowCount == 0) {
            return res.status(404).json({ error: `Product not Found` })
        }
        return res.status(200).json(result.rows)
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

export async function postProduct(req, res) {
    console.log('POST /products is requested');
    try {
        // ตรวจสอบว่าสินค้ามีอยู่ในฐานข้อมูลและสถานะ delStatus
        const existingProduct = await database.query({
            text: `SELECT * FROM products WHERE "pdName" = $1`,
            values: [req.body.pdName]
        });

        // ถ้าสินค้ามีอยู่แล้วและมีสถานะถูกลบ
        if (existingProduct.rows.length > 0) {
            const product = existingProduct.rows[0];
            if (product.delStatus) {
                // ถ้าสินค้ามีสถานะถูกลบ ให้ทำการอัปเดตข้อมูลและเปลี่ยนสถานะ
                await database.query({
                    text: `UPDATE products
                           SET "pdPrice" = $1,
                               "brandId" = $2,
                               "typeId" = $3,
                               "stock" = $4,
                               "warranty" = $5,
                               "image" = $6,
                               "pdDescribe" = $7,
                               "delStatus" = false
                           WHERE "pdId" = $8`,
                    values: [
                        req.body.pdPrice,
                        req.body.brandId,
                        req.body.typeId,
                        req.body.stock,
                        req.body.warranty,
                        req.body.image,
                        req.body.pdDescribe,
                        product.pdId // ใช้ pdId ของสินค้าที่มีอยู่
                    ]
                });
                return res.status(200).json({ messageAddProduct: `เพิ่มสินค้าเรียบร้อยแล้ว` });
            } else {
                return res.status(409).json({ messageAddProduct: `${req.body.pdName} มีอยู่แล้ว` });
            }
        }

        // ถ้ายังไม่มีสินค้านี้ในฐานข้อมูล
        let i = 0;
        let theId = '';
        let countResult = [];
        do {
            i++;
            theId = `P${String(i).padStart(4, '0')}`;
            countResult = await database.query({
                text: 'SELECT EXISTS (SELECT * FROM products WHERE "pdId" = $1)',
                values: [theId],
            });
        } while (countResult.rows[0].exists);

        await database.query({
            text: `INSERT INTO products ("pdId", "pdName", "pdPrice", "brandId", "typeId", "stock", "warranty", "image", "pdDescribe")
                    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`, // กำหนด delStatus เป็น false
            values: [
                theId,
                req.body.pdName,
                req.body.pdPrice,
                req.body.brandId,
                req.body.typeId,
                req.body.stock,
                req.body.warranty,
                req.body.image,
                req.body.pdDescribe,
            ]
        });

        return res.status(201).json({ messageAddProduct: `เพิ่มสินค้าเรียบร้อยแล้ว` });
    }
    catch (err) {
        return res.status(500).json({ messageAddProduct: `เกิดข้อผิดพลาดในการเพิ่มสินค้า` });
    }
}

export async function putProduct(req, res) {
    console.log(`PUT /products/${req.params.id} is requested`)

    try {
        const result = await database.query({
            text:
                `
                UPDATE "products"
                SET "pdName" = COALESCE($1, "pdName"),
                    "pdPrice" = COALESCE($2, "pdPrice"),
                    "brandId" = COALESCE($3, "brandId"),
                    "typeId" = COALESCE($4, "typeId"),
                    "stock" = COALESCE($5, "stock"),
                    "warranty" = COALESCE($6, "warranty"),
                    "image" = COALESCE($7, "image"),
                    "pdDescribe" = COALESCE($8, "pdDescribe")
                WHERE "pdId" ILIKE $9
            `,
            values: [
                req.body.pdName || null,
                req.body.pdPrice || null,
                req.body.brandId || null,
                req.body.typeId || null,
                req.body.stock || null,
                req.body.warranty || null,
                req.body.image || null,
                req.body.pdDescribe || null,
                req.params.id
            ]
        })

        res.status(201).json({messageUpdate: `แก้ไขข้อมูลเสร็จสิ้น`})
    }
    catch (err) {
        return res.status(500).json({ error: err.message, messageUpdate: `แก้ไขข้อมูลผิดพลาด`})
    }
}

export async function deleteProduct(req, res) {
    console.log(`UPDATE /products/${req.params.id} is requested`);

    try {
        const result = await database.query({
            text:
                `
                UPDATE "products"
                SET "delStatus" = true
                WHERE "pdId" ILIKE $1
                `,
            values: [req.params.id]
        })
        res.status(204).end()
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

export async function decreaseProduct(req, res) {
    console.log(`UPDATE /product Quantity`);
    const bodyData = req.body

    try {
        if (req.params.id == null) {
            return res.json({messageUpdate: 'CartId is required'});
        }

        const cartDetails = await database.query({
            text: `SELECT "pdId", "qty" FROM "cartDtl" WHERE "cartId" = $1`,
            values: [req.params.id]
        })

        if(cartDetails.rows.length === 0){
            return res.json({ messageUpdate: 'No items found in the cart'})
        }

        for(const item of cartDetails.rows) {
            const result = await database.query({
                text: `SELECT "stock" FROM "products" WHERE "pdId" = $1`,
                values: [item.pdId]
            });
            console.log(result.rows[0].stock);
            await database.query({
                text: `UPDATE "products" SET "stock" = $1 WHERE "pdId" = $2`,
                values: [
                    result.rows[0].stock - item.qty,
                    item.pdId
                ]
            })
        }
        console.log('OK')
        return res.json({ messageUpdate: 'Success' })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ messageUpdate: 'An error occurred' });
    }
}