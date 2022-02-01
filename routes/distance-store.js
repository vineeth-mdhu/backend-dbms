const router = require('express').Router()
const supabase = require('../utils/supabaseClient')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))

router.post('/', async (req, res) => {
    console.log(req.query.eid)
    var src = null

    supabase
        .from('establishment')
        .select('*')
        .then(estd => {

            estd.data.forEach(element => {
                if (element.eid == req.query.eid)
                    src = element
            })

            estd.data.forEach(element => {
                if (element.type == 'Warehouse') {
                    console.log(element)
                    fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${src.longitude},${src.latitude};${element.longitude},${element.latitude}?annotations=maxspeed&overview=full&geometries=geojson&access_token=pk.eyJ1IjoidmluZWV0aDEzIiwiYSI6ImNreTY2emY4cTBkaTAyb3BmYWJ6eDBoY24ifQ.h1v4PPd5PheueCpIgdMKaw`)
                        .then(route_data => {
                            route_data.json()
                                .then(route_data => {
                                    const data = { 'from': src.eid, 'to': element.eid, 'distance': route_data.routes[0].distance, 'waypoints': { "data": route_data.routes[0].geometry.coordinates } }
                                    supabase
                                        .from('route')
                                        .insert(data, { returning: "minimal" })
                                        .then(success => {
                                            console.log(success)
                                            res.json(success).end()
                                        })
                                        .catch(console.error)
                                    // console.log({ "route": route_data.routes[0].geometry.coordinates },{"distance":route_data.routes[0].distance},"\n")
                                })
                        })
                        .catch(console.error)
                }
            })
        })
        .catch(console.error)
})

module.exports = router