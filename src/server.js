import http from 'http'
import querystring from 'querystring'
import url from 'url'
import { colours } from './utils.js'

const PORT = 3000
const ENDPOINT = `http://localhost:${PORT}/`

const server = http.createServer()

const handleGetRequest = (req, res) => {
  // Set headers
  // The following two headers are commented out at the start of the workshop
  // res.setHeader('Access-Control-Allow-Origin', '*')
  // res.setHeader('Content-Type', 'application/json')

  // Get key value pairs from the query string
  const parsedUrl = url.parse(req.url, true)
  const queryAsObject = parsedUrl.query

  // Get the colour name from the query string value
  const reqColour = queryAsObject['colour']

  // Find details of the colour requested
  let resColour =
    colours.find((c) => c.name.toLowerCase() === reqColour?.toLowerCase()) ||
    null

  // Return all colours if no colour is specified
  if (Object.keys(queryAsObject).length === 0) resColour = colours

  // Set the response status (200 is success, 404 page not found)
  res.statusCode = resColour ? 200 : 404

  // Return details of the colour requested
  res.end(JSON.stringify(resColour))

  // Console log out the request query value and the response
  console.log('Request for colour: ', reqColour)
  console.log('Response: ', JSON.stringify(resColour))
}

const handlePostRequest = (req, res) => {
  // Set headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  // The following header is commented out at the start of the workshop
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Console log out the request method (OPTIONS or POST)
  console.log('Request method: ', req.method)

  // Handle the preflight request (browser generated)
  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  // Handle the POSTed data
  if (req.method === 'POST') {
    let data = ''

    req.on('data', (chunk) => {
      data += chunk.toString()
    })

    req.on('end', () => {
      try {
        const contentType = req.headers['content-type']

        let colour,
          isFromForm = contentType === 'application/x-www-form-urlencoded'

        if (isFromForm) {
          // Posted from the form
          const formData = querystring.parse(data)
          const { name, hex } = formData
          colour = { name, hex }
        }
        // Posted using fetch (JSON format)
        else {
          colour = JSON.parse(data)
        }

        // Check if colour exists
        if (colours.map((hc) => hc.name).includes(colour.name)) {
          // If so, send 409 Conflict
          res.writeHead(409)
          res.end(
            JSON.stringify({
              message: 'Colour already exists',
              colour,
            })
          )
        } else {
          // Otherwise, add the new colour
          colours.push(colour)

          // Console log out
          console.log('Colours: ', colours)

          if (isFromForm) {
            // Respond with a message included in the HTML
            res.writeHead(201, { 'Content-Type': 'text/html' })
            res.end(`
              <html>
              <head><title>Response</title></head>
              <body>
                  <p>Your colour, ${colour.name}, was successfully added. 
                  <a href="/">Go back</a>
              </body>
              </html>
          `)
          } else {
            // Send success response, 201 Created
            res.writeHead(201)

            res.end(
              JSON.stringify({
                message: 'Colour added successfully',
                colour,
              })
            )
          }
        }
      } catch (e) {
        console.log(e)
        // Or the generic fail code 400
        res.writeHead(400)
        res.end(
          JSON.stringify({
            error: 'Invalid data provided',
          })
        )
      }
    })
  }
}

server.on('request', async (req, res) => {
  if (req.method === 'GET') {
    handleGetRequest(req, res)
  } else if (req.url === '/post') {
    handlePostRequest(req, res)
  }
})

server.listen(PORT, () => {
  console.log(`Server running at: ${ENDPOINT}`)
})
