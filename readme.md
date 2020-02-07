
# Discard

Discord card game staging the members of Discord. Each guild is a deck.

## Usage:

```js
const Discord = require('discord.js')
const Discard = require('discard')

const client = new Discord.Client()
const discard = new Discard.Client( client )

client.on('message', async message => {

    if(
        message.system || 
        !message.guild || 
        message.author.bot
    ) return

    if(message.content === 'mycard'){

        await discard.loaded
            // wait for discard data are loaded

        discard.getCard( message.member )
            // generate card if not exists
            // and attach card to member
            // and return the card

        message.channel.send( await message.member.card.getAttachment() )
            // send card attachment

    }

    if(message.content === 'mydeck'){

        await discard.loaded

        discard.getDeck( message.guild )
            // generate deck if not exists
            // and attach deck to guild
            // and return the deck

        message.channel.send( message.guild.deck.getAttachment() )
            // send deck info attachment

    }

})

client.login(TOKEN)
```