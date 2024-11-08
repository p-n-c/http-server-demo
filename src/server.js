import http from 'http'
import url from 'url'

const PORT = 3000
const ENDPOINT = `http://localhost:${PORT}/`
const QS_KEY_1 = 'qs1'

const reqRes = [
  {
    req: 'A',
    res: '1',
  },
  {
    req: 'B',
    res: '2',
  },
  {
    req: 'J',
    res: '10',
  },
]

const statusCodes = [
  200, // default (success)
  404, // not found
]

const config = {
  headers: [
    {
      name: 'Access-Control-Allow-Origin',
      value: '*',
    },
    {
      name: 'Content-Type',
      value: 'application/json',
    },
  ],
}

const server = http.createServer()

server.on('request', (req, res) => {
  // Set headers
  config.headers.forEach((header) => {
    res.setHeader(header.name, header.value)
  })

  // Get key value pairs from the query string
  const parsedUrl = url.parse(req.url, true)
  const queryAsObject = parsedUrl.query
  console.log('queryAsObject: ', queryAsObject)

  // Get first query string value
  const reqValue = queryAsObject[QS_KEY_1]
  console.log('reqValue: ', reqValue)

  let resValue

  // Lookup return value for first query string value
  resValue =
    reqRes.find((rr) => rr.req.toLowerCase() === reqValue?.toLowerCase())
      ?.res || null

  console.log('resValue: ', resValue)

  res.statusCode = resValue ? statusCodes[0] : statusCodes[1]

  // Return request response
  res.end(JSON.stringify(resValue))
})

server.listen(PORT, () => {
  console.log(`Server running at ${ENDPOINT}`)
})