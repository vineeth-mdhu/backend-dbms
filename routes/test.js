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

        if(route_data.data.length>0)
        route_data.data.forEach(ele => {
            tos.push(ele.to)
        })

        console.log(route_data)

        console.log(tos)

        const inventory_data = await supabase
            .from('inventory')
            .select('*')
            .in('eid', tos)
            .eq('pid', pid)
            .gt('quantity_left', qty)
            


        console.log(inventory_data)


        if (inventory_data.data) {
            const vehicle_type = qty < 100 ? 'Van' : 'Truck'
            console.log(vehicle_type)
            
            const vehicle_data = await supabase
                .from('vehicle')
                .select('*')
                .eq('type', 'Van')
                .eq('status', 'available')
                .limit(1)

            var vehicle = vehicle_data.data[0]

            if (vehicle_data.data.length>0) {
                var d = new Date(Date.now());
                d.setMinutes(d.getMinutes() + route_data.data[0].distance / vehicle.speed);

                const data = { 'vid': vehicle.vid, 'delivery_time': d, 'from': inventory_data.data[0].eid, 'to': sid, 'pid': pid, 'quantity': qty, 'status': 'enroute' }
                try {
                    const success = await supabase
                        .from('transport')
                        .insert(data, { returning: "minimal" })
                    console.log(success)
                    res.end()
        
                }
                catch (e) {
                    res.end()
                    console.log("hi")
                    console.log(e)
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