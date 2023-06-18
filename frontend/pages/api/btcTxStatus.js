export default async function handler(req, res) {
    const { tx } = req.body // Extract the 'tx' property from the request body
    try {
        const response = await fetch(`https://mempool.space/api/tx/${tx}/status`)
        const data = await response.json()
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}
