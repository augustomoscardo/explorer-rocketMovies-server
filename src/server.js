require('express-async-errors')
const express = require('express')
const routes = require('./routes')
const migrationsRun = require('./database/sqlite/migrations')
const uploadConfig = require('./configs/upload')
const cors = require('cors')

const app = express()

const AppError = require('./utils/AppError')

app.use(cors())
app.use(express.json())
app.use(routes)

migrationsRun()

const PORT = 3333

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER))

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    })
  }

  console.error(error);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})