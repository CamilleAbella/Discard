
import { Client as DiscordClient, Guild, GuildMember, User, Collection } from 'discord.js'
import { DiscardGuild, DiscardGuildMember, DiscardUser, MoveOptions, Theme } from '../config/interfaces'
import { promises as fs } from 'fs'
import { loadImage } from 'canvas'
import Deck from './Deck'
import Card from './Card'
import Player from './Player'
import moveOptions from '../config/moves'
import { ThemeName } from '../config/types'

const path = require('path')
const Enmap = require('enmap')

export default class Client {

    public client:DiscordClient
    public enmap:any
    public loaded:Promise<Client>
    public themes:Collection<ThemeName,Theme>
    public moveOptions:MoveOptions[]

    constructor( client:DiscordClient, name:string = 'discard' ){

        this.client = client
        this.enmap = new Enmap({name})
        this.moveOptions = moveOptions

        this.loaded = new Promise( async resolve => {
            this.themes = new Collection
            let maybeThemes = await fs.readdir('./themes')
            const themeNames = maybeThemes.filter( name => !name.includes('.') )
            for(const themeName of themeNames){
                const theme:Theme = {
                    background: await loadImage( path.resolve('./themes',themeName,'background.png')),
                    middle: await loadImage( path.resolve('./themes',themeName,'middle.png')),
                    foreground: await loadImage( path.resolve('./themes',themeName,'foreground.png')),
                    config: require( path.resolve('./themes',themeName,'config.json') )
                }
                this.themes.set( themeName as ThemeName, theme )
            }
            resolve(this)
        })
        
    }

    public addMove( moveOptions:MoveOptions ): void {
        this.moveOptions.push(moveOptions)
    }

    public getDeck( guild:Guild ): Deck {
        if((guild as any).deck) return (guild as DiscardGuild).deck;
        (guild as DiscardGuild).deck = new Deck( this, (guild as DiscardGuild) )
        return (guild as DiscardGuild).deck
    }

    public getCard( member:GuildMember ): Card {
        if((member as any).card) return (member as DiscardGuildMember).card;
        (member as DiscardGuildMember).card = new Card( this, (member as DiscardGuildMember) )
        return (member as DiscardGuildMember).card
    }

    public getPlayer( user:User ): Player {
        if((user as any).player) return (user as DiscardUser).player;
        (user as DiscardUser).player = new Player( this, (user as DiscardUser) )
        return (user as DiscardUser).player
    }

}