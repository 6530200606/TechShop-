import database from "../services/database.js"
import bcrypt from "bcrypt"

export async function postMember(req, res) {
    console.log('POST /members is requested');
    const bodyData = req.body;
    try {
        if (
            req.body.memEmail == null ||
            req.body.memName == null ||
            req.body.memSurname == null ||
            req.body.memTel == null ||
            req.body.memAddress == null ||
            req.body.birthDate == null ||
            req.body.password == null
        ) {
            return res.json({ messageregister: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        // Check if the email already exists
        const emailExistsResult = await database.query({
            text: `SELECT EXISTS (SELECT * FROM members WHERE "memEmail" = $1)`,
            values: [req.body.memEmail]
        });

        if (emailExistsResult.rows[0].exists) {
            return res.json({ messageregister: 'อีเมลนี้ถูกใช้งานแล้ว' });
        }

        // Check if the phone number already exists
        const phoneExistsResult = await database.query({
            text: `SELECT EXISTS (SELECT * FROM members WHERE "memTel" = $1)`,
            values: [req.body.memTel]
        });

        if (phoneExistsResult.rows[0].exists) {
            return res.json({ messageregister: 'เบอร์โทรนี้ถูกใช้งานแล้ว' });
        }

        const thePwd = req.body.password;
        const saltround = 11;
        const pwdHash = await bcrypt.hash(thePwd, saltround);

        const result = await database.query({
            text: `INSERT INTO members (
                      "memEmail", 
                      "memName", 
                      "memSurname", 
                      "memAddress",
                      "memTel", 
                      "birthDate", 
                      "memHash"
                   ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            values: [
                req.body.memEmail,
                req.body.memName,
                req.body.memSurname,
                req.body.memAddress,
                req.body.memTel,
                req.body.birthDate,
                pwdHash,
            ],
        });
        console.log('OK');
        return res.json({ messageregister: 'ลงทะเบียนสำเร็จ' });
    } catch (err) {
        return res.json({ messageregister: 'ลงทะเบียนไม่สำเร็จ' });
    }
}

export async function loginMember(req, res) {
    console.log('POST /loginMember is requested');
    const bodyData = req.body;
    try {
        if (req.body.loginName == null || req.body.password == null) {
            return res.json({ messagelogin: 'กรุณากรอกอีเมล/เบอร์โทรศัพท์ และรหัสผ่าน' });
        }

        // Query to check if loginName is either email or phone number
        const existsResult = await database.query({
            text: `
                SELECT EXISTS (
                    SELECT * FROM members m 
                    WHERE m."memEmail" = $1 
                    OR m."memTel" = $1
                )
            `,
            values: [req.body.loginName]
        });

        if (!existsResult.rows[0].exists) {
            return res.json({ messagelogin: 'อีเมล/เบอร์โทรศัพท์ หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่' });
        }

        // Query to retrieve the member's data based on email or phone number
        const result = await database.query({
            text: `
                SELECT * FROM members m 
                WHERE m."memEmail" = $1 
                OR m."memTel" = $1
            `,
            values: [req.body.loginName]
        });

        // Compare password hash
        const loginOK = await bcrypt.compare(req.body.password, result.rows[0].memHash);

        if (loginOK) {
            req.session.memEmail = result.rows[0].memEmail
            req.session.memName = result.rows[0].memName
            req.session.dutyId = result.rows[0].dutyId
            console.log(req.session)
            return res.json({ messagelogin: 'เข้าสู่ระบบสำเร็จ' });
        } else {
            return res.json({ messagelogin: 'อีเมล/เบอร์โทรศัพท์ หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่' });
        }
    } catch (err) {
        console.error('Error:', err);
        return res.json({ messagelogin: 'เข้าสู่ระบบไม่สำเร็จ' });
    }
}

export async function getSession(req, res) {
    console.log('GET /getSession is requested')
    console.log(req.session)
    const thedata = {
        email: req.session.memEmail,
        name: req.session.memName,
        duty: req.session.dutyId
    }
    console.log(thedata)
    return res.json(thedata)
}

export async function logoutMember(req, res) {
    console.log(`GET /logoutNember is requested`)
    try {
        req.session.destroy()
        res.clearCookie('connect.sid')
        return res.status(200).json({ messagelogout: 'ออกจากระบบเสร็จสิ้น' })
    }
    catch (err) {
        return res.status(500).json({ messagelogout: 'เกิดข้อผิดพลาดในการออกจากระบบ กรุณาลองใหม่' })
    }
}

export async function getMembers(req, res) {
    console.log('GET /getMember is requested');
    try {
        const result = await database.query({
            text: `SELECT * FROM "members" WHERE "memEmail" = $1`,
            values: [req.params.id],
        });

        if (result.rows.length > 0) {
            return res.json(result.rows[0]);
        } else {
            return res.status(404).json({ message: 'ไม่พบที่อยู่สำหรับอีเมลนี้' });
        }
    } catch (err) {
        console.error('Error fetching Email:', err);
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
    }
}


export async function updateMember(req, res) {
    console.log(`PUT /Member is required`);

    try {
        if (req.body.memTel) {
            const phoneExistsResult = await database.query({
                text: `SELECT EXISTS (SELECT * FROM members WHERE "memTel" = $1 AND "memEmail" != $2)`,
                values: [req.body.memTel, req.body.memEmail]
            });

            if (phoneExistsResult.rows[0].exists) {
                return res.status(400).json({ messageUpdate: 'เบอร์โทรนี้ถูกใช้งานแล้ว' });
            }
        }

        let pwdHash = null;
        if (req.body.password) {
            const thePwd = req.body.password;
            const saltround = 11;
            pwdHash = await bcrypt.hash(thePwd, saltround)
        }
        const result = await database.query({
            text: `
                UPDATE "members"
                SET "memEmail" = COALESCE($1, "memEmail"),
                    "memName" = COALESCE($2, "memName"),
                    "memSurname" = COALESCE($3, "memSurname"),
                    "memAddress" = COALESCE($4, "memAddress"),
                    "memTel" = COALESCE($5, "memTel"),
                    "birthDate" = COALESCE($6, "birthDate"),
                    "memHash" = COALESCE($7, "memHash")
                WHERE "memEmail" = COALESCE($8, "memEmail");
            `,
            values: [
                req.body.memEmail || null,
                req.body.memName || null,
                req.body.memSurname || null,
                req.body.memAddress || null,
                req.body.memTel || null,
                req.body.birthDate || null,
                pwdHash || null,
                req.body.memEmail || null,
            ]
        });
        res.status(201).json({ messageUpdate: 'บันทึกข้อมูลสำเร็จ' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
