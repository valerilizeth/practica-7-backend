console.log('Hola mundo con Node JS')

// forma antigua de llamar libreria
// const express = require('express')

// forma actual con ECMAScript 6 de llamar librerias
import bodyParser from 'body-parser'
import express from 'express'
import { ObjectId } from 'mongodb'
import client from './db.js'

const app = express()
const port = 3000

app.use(bodyParser.json())

// ---------------- Endpoint -------------------
// con 'get' le indicamos que nuestra API acepta
// el method GET.
// El primer parametro establece el path (ruta) del
// codigo que queremos ejecutar
// El segundo parametro establece el codigo a ejecutar
// en forma de callback
// - el callback recibe 2 parametros:
// - req: request o la peticion
// - res: response o la respuesta
app.get('/api/v1/usuarios', async (req, res) => {

    console.log(req.query)

    // 1. conectarnos a la base de datos
    await client.connect()

    // 2. seleccionar la db que vamos a utilizar
    const dbSampleMflix = client.db('sample_mflix')

    // 3. seleccionar la coleccion
    const userCollection = dbSampleMflix.collection('users')

    // 4. hacer la consulta -> query
    const userList = await userCollection.find({}).toArray()

    // console.log(userList)

    // 5. cerrar la coneccion a la db
    await client.close()


    // const respuesta = {
    //     mensaje: "hola"
    // }

    // res.json(respuesta)

    res.json({
        mensaje: 'lista de usuarios',
        data: userList
    })
})

// obtener un usuario
app.get('/api/v1/usuarios/:id', async (req, res) => {
    console.log(req.params)
    let id = req.params.id

    // 1. conectarnos a la base de datos
    await client.connect()

    // 2. seleccionar la db que vamos a utilizar
    const dbSampleMflix = client.db('sample_mflix')

    // 3. seleccionar la coleccion
    const userCollection = dbSampleMflix.collection('users')

    id = new ObjectId(id)
    console.log(id)
    // 4. consulta
    const user = await userCollection.find({
        _id: id
    }).toArray()

    // 5. cerrar la coneccion
    await client.close()

    res.json({
        mensaje: `usuario obtenido con el id: ${id}`,
        data: user
    })
})

// post: crear datos
app.post('/api/v1/usuarios', async (req, res) => {

    console.log(req.body)
    const userData = req.body

    // 1. conectarnos a la base de datos
    await client.connect()

    // 2. seleccionar la db que vamos a utilizar
    const dbSampleMflix = client.db('sample_mflix')

    // 3. seleccionar la coleccion
    const userCollection = dbSampleMflix.collection('users')

    // 4. almacenar un usuario
    await userCollection.insertOne({
        nombre: userData.nombre,
        apellido: userData.apelido,
        email: userData.email,
        edad: userData.edad,
        // ubicacion: userData.ubicacion
        ubicacion: {
            latitud: userData.ubicacion.latitud,
            longitud: userData.ubicacion.longitud
        }
    })

    // 5. cerrar coneccion
    await client.close()


    res.json({
        mensaje: 'usuario guardado'
    })
})

// put: actualizar todos los
// datos de un elemento
app.put('/api/v1/usuarios/:id', async (req, res) => {

    let id = req.params.id
    const userData = req.body

    // 1. conectarnos a la base de datos
    await client.connect()

    // 2. seleccionar la db que vamos a utilizar
    const dbSampleMflix = client.db('sample_mflix')

    // 3. seleccionar la coleccion
    const userCollection = dbSampleMflix.collection('users')

    id = new ObjectId(id)
    // 4. realizar consulta a la DB
    await userCollection.updateOne(
        { _id: id },
        {
            $set: {
                name: userData.name
            }
        }
    )

    // 5. cerrar la conexion
    await client.close()

    res.json({
        mensaje: `usuario con id: ${id} actualizado`
    })
})

// patch: actualiza algunos campos
// de nuestro elemetno
app.patch('/api/v1/usuarios/:cedula', (req, res) => {

    const cedula = req.params.cedula

    res.json({
        mensaje: `edad del usuario con cedula ${cedula} actualizada`
    })
})

// delete: eliminar un elemento
app.delete('/api/v1/usuarios/:id', async (req, res) => {

    let id = req.params.id

    // 1. conectarnos a la base de datos
    await client.connect()

    // 2. seleccionar la db que vamos a utilizar
    const dbSampleMflix = client.db('sample_mflix')

    // 3. seleccionar la coleccion
    const userCollection = dbSampleMflix.collection('users')

    id = new ObjectId(id)
    // 4. realizar la consulta
    await userCollection.deleteOne({
        _id: id
    })

    await client.close()

    res.json({
        mensaje: `usuario con id ${id} eliminado`
    })
})

// Le indicamos a nuesta API que empiece a escuchar peticiones
// en el puerto 3000 y cuando se encienda nos muestre el mensaje
// que hay en el console.log
app.listen(port, () => {
    console.log(`La API esta escuchando en el puerto ${port}`)
})

