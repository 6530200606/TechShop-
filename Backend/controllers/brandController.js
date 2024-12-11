import database from "../services/database.js"

export async function getAllbrands(req, res) {
    console.log('GET /brands is requested')
    try {
        const result = await database.query(
            `SELECT * FROM public.brands ORDER BY "brandId" ASC `
        )
        return res.status(200).json(result.rows)
    }
    catch (err) {
        return res.status(500).json({ error: err.messsage })
    }
}