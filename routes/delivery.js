const router = require('express').Router()
const supabase = require('../utils/supabaseClient')

router.post('/', async (req, res) => {
    const sid = req.query.sid;
    const qty = req.query.qty;
    const pid = req.query.pid;

    try {

        const route_data = await supabase
            .from('route')
            .select('from,to,distance')
            .eq('from', sid)
            .order('distance', { ascending: true })
        var tos = []

        tos.push(route_data.data.forEach(ele => {
            return ele.to
        }))

        console.log(route_data)

        const inventory_data = await supabase
            .from('inventory')
            .select('*')


        const vehicle_type = qty < 100 ? 'Van' : 'Truck'
        console.log(vehicle_type)
        const vehicle_data = await supabase
            .from('vehicle')
            .select('*')
            .eq('type', 'Van')
            .eq('status', 'available')


        if (vehicle_data.data.length > 0) {
            var vehicle = vehicle_data.data[0]


            if (inventory_data && route_data) {
                var breakCheck = false
                for (const element of route_data.data) {
                    console.log(element)
                    for (const item of inventory_data.data)
                        if (element.to == item.eid && item.pid == pid && item.quantity_left > qty) {
                            console.log(item)
                            var d = new Date(Date.now());
                            d.setMinutes(d.getMinutes() + element.distance / vehicle.speed);

                            const data = { 'vid': vehicle.vid, 'delivery_time': d, 'from': element.to, 'to': sid, 'pid': pid, 'quantity': qty, 'status': 'enroute' }
                            try {
                                const success = await supabase
                                    .from('transport')
                                    .insert(data, { returning: "minimal" })
                                console.log(success)


                                breakCheck = true
                                res.end()
                                break
                            }
                            catch (e) {
                                res.end()
                                console.log("hi")
                                console.log(e)
                            }
                        }
                    if (breakCheck)
                        break
                }
            }
        }
    }
    catch (e) {
        res.end()
        console.log(e);
        console.log('error')
    }

})

module.exports = router