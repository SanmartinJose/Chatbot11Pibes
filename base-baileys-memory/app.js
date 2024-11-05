const { createBot, createProvider, createFlow, addKeyword, addAnswer } = require('@bot-whatsapp/bot')
const{addKeyword}=require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const path = require("path")
const fs = require("fs")

const menuPath = path.join(__dirname,"mensajes","menu.txt")
const menu = fs.readFileSync(menuPath,"utf8")


//Aqui inicia la funcionalidad del bot//

const flowWeb = addKeyword(['desarrollo','web'])
    .addAnswer([
        'Se desarrolla paginas web mediante el uso de:',
        '- JavaScript y Node.JS',
        '- Wordpress'         

    ],

    )
const flowChat = addKeyword(['chatbot','IA'])
    .addAnswer([
        'Construccion y mantenimiento de Chatbots :',
        '- Guardar respuestas en base de Datos para tener una comunicacion más rapida con clientes',
        '- Chatbots con respuesta rapida, envia informacion de preguntas frecuentes'         

    ],

    )
const flowService = addKeyword("servicios")
    .addAnswer([
        'Tenemos Las Camisetas de tus equipos favoritos de',
        'Diversas ligas del mundo, a los mejores precios',
        '*Chatbots*: Se realizar Chatbots con IA para poder mejorar el servicio a sus clientes',
        'Regresar al *Menu*'        
    ],
        null,
        null,
        [flowWeb,flowChat]
)
const flowContactos = addKeyword("contactos")
    .addAnswer([
        '*Contactanos*:',
        '*Lunes a Viernes*',
        'Horarios de atencion 7:00 hasta 17:00',
        '*Sabados',
        'Horarios de atencion 7:00 hasta 12:00',
        "Quito - Pichincha",
        'Regresar al *Menu*'        
    ],  
    
        
)
const flowSomos = addKeyword(["quienes","somos"])
    .addAnswer([
        '*Quienes Somos*:',         
        'Joven emprendedor de 25 años',
        'Estudiante de Ingenieria en Software',
        'Con conocimientos de IA, Desarrollo web',
        'Buscando fortalecer y facilitar la comunicacion entre cliente y vendedores',
        'Mediante el uso de nuevas tecnologias',
        "Quito - Pichincha",
        'Regresar al *Menu*'     
           
    ],        
)

  

const menuFlow = addKeyword('menu').addAnswer(
    menu,
    { capture: true },
    async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
        if (!["1", "2", "3", "0", "Menu"].includes(ctx.body)) {
            return fallBack(
                "Respuesta no válida, por favor selecciona una de las opciones."
            );
        }
        switch (ctx.body) {
            case "1":
                return gotoFlow(flowService);            
            case "2":
                return gotoFlow(flowContactos);           
            case "3":
                return gotoFlow(flowSomos);
            case "4":
                return gotoFlow(flowContactos);
            case "menu":
                return gotoFlow(menuFlow);
            case "0":
                return await flowDynamic(
                    "Saliendo... Puedes volver a acceder a este menú escribiendo '*Menu*'"
                );
        }
    }
);
    
const flowWelcome = addKeyword(['hola', 'buenas', 'buen', 'buena','buenos','ola'])
    .addAnswer('Hola, soy Josue, de 11 Pibes es un gusto en saludarte')
    .addAnswer(
        [
            
            '¿En que te puedo ayudar hoy?',
            'Por favor selecciona una de las opciones: ',
            {
               
                
            }
        ],
        null,
        async (ctx, { gotoFlow }) => {
            return gotoFlow(menuFlow);
        }
);



const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowWelcome,menuFlow])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
