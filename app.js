const express = require('express')
const bodyParser = require('body-parser')
const handleb = require('express-handlebars')
const path = require('path')
const nodemailer = require('nodemailer')

const app = express()

// View engine
app.engine('handlebars', handleb.engine())
app.set('view engine', 'handlebars')

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')))

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Routes
app.get('/', (req, res) => {
    res.render('contact')
})

app.post('/send', (req, res) => {
    const output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>  
            <li>Name: ${req.body.name}</li>
            <li>Company: ${req.body.company}</li>
            <li>Email: ${req.body.email}</li>
            <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;

    // Criando um tranportador reutilizavel com o mesmo tranporte SMTP
    let transporter = nodemailer.createTransport({
        host: 'mail.YOURDOMAIN.com',
        port: 8081,
        secure: false,
        auth: {
            user: 'YOUREMAIL',
            pass: 'YOURPASSWORD'
        },
        tls:{
            rejectUnauthorized:false
        }
    })

    let mailOptions = {
        from: '"Nodemailer Contact" <your@email.com>',
        to: 'RECEIVEREMAILS',
        subject: 'Node Contact Request',
        text: 'Hello world?',
        html: output
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            return console.log(error)
        }
        console.log('message sent: %s', info.messageId)
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))

        res.render('contact', {msg: 'Email enviado com sucesso!'})
    })
})

app.listen(8181, () => console.log('Servidor rodando!'))