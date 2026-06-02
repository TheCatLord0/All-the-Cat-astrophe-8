const SOURCE_MAX = 100
const SOURCE_INTERVAL = 120
const SOURCE_DRAIN = 1
const SOURCE_HIGH_THRESHOLD = 70
const SOURCE_LOW_THRESHOLD = 20
const SOURCE_EFFECT_DURATION = 130
const SOURCE_JAR_GAIN = 40
const SOURCE_JAR_COST = 1000
const SOURCE_FOOD_GAIN = 20
const SOURCE_FOOD_GAIN_CRAFTED = 30
const SOURCE_DAMAGE_DRAIN_RATIO = 2
const SOURCE_EAT_COOLDOWN = 20
const SOURCE_EFFECT_AMPLIFIER = 1
const SOURCE_HIGH_EFFECT_AMPLIFIER = 0
const SOURCE_JAR_ID = 'ars_nouveau:source_jar'
const SOURCE_CREATIVE_JAR_ID = 'ars_nouveau:creative_source_jar'
const SOURCE_FOODS = [
    'ars_nouveau:sourceberry_bush',
    'ars_nouveau:source_gem',
    'ars_nouveau:bombegranate_pod',
    'ars_nouveau:bastion_pod',
    'ars_nouveau:frostaya_pod',
    'ars_nouveau:mendosteen_pod'
]
const SOURCE_FOODS_CRAFTED = [
    'ars_nouveau:source_berry_pie',
    'ars_nouveau:source_berry_roll'
]

const SCROLL_COST = 30
var SCROLL_FORM_CLASSES = [
    { cls: 'com.hollingsworth.arsnouveau.common.spell.method.MethodProjectile', names: ['Bolt', 'Shot'] },
    { cls: 'com.hollingsworth.arsnouveau.common.spell.method.MethodTouch',      names: ['Touch', 'Grasp'] },
    { cls: 'com.hollingsworth.arsnouveau.common.spell.method.MethodSelf',       names: ['Me', 'Self'] },
    { cls: 'com.hollingsworth.arsnouveau.common.spell.method.MethodUnderfoot',  names: ['Bottom', 'Feet'] },
    { cls: 'alexthw.not_enough_glyphs.common.glyphs.forms.MethodMissile',      names: ['Missile', 'Lance'] }
]
var AOE_PREFIXES  = ['', 'Wide', 'Vast', 'Enormous']
var DUR_PREFIXES  = ['Brief', '', 'Lasting', 'Enduring', 'Eternal']

var EFFECT_DURATION_SET = {
    'com.hollingsworth.arsnouveau.common.spell.effect.EffectBubble': true,
    'com.hollingsworth.arsnouveau.common.spell.effect.EffectFreeze': true,
    'com.hollingsworth.arsnouveau.common.spell.effect.EffectSnare': true,
    'com.hollingsworth.arsnouveau.common.spell.effect.EffectSlowfall': true,
    'com.hollingsworth.arsnouveau.common.spell.effect.EffectPhantomBlock': true
}

var EFFECT_AOE_SET = {
    'com.hollingsworth.arsnouveau.common.spell.effect.EffectGrow': true,
    'com.hollingsworth.arsnouveau.common.spell.effect.EffectBreak': true,
    'com.hollingsworth.arsnouveau.common.spell.effect.EffectFell': true,
    'com.hollingsworth.arsnouveau.common.spell.effect.EffectPhantomBlock': true
}

var SCROLL_EFFECT_CLASSES = [
    { cls: 'com.hollingsworth.arsnouveau.common.spell.effect.EffectIgnite',      names: ['Blazing', 'Scorching'] },
    { cls: 'com.hollingsworth.arsnouveau.common.spell.effect.EffectHarm',        names: ['Vicious', 'Wounding'] },
    { cls: 'com.hollingsworth.arsnouveau.common.spell.effect.EffectHeal',        names: ['Mending', 'Restorative'] },
    { cls: 'com.hollingsworth.arsnouveau.common.spell.effect.EffectLightning',   names: ['Thunderous', 'Shocking'] },
    { cls: 'com.hollingsworth.arsnouveau.common.spell.effect.EffectDispel',      names: ['Cleansing', 'Nullifying'] },
    { cls: 'com.hollingsworth.arsnouveau.common.spell.effect.EffectSlowfall',    names: ['Drifting', 'Floating'] },
    { cls: 'com.hollingsworth.arsnouveau.common.spell.effect.EffectInvisibility',names: ['Phantom', 'Veiled'] },
    { cls: 'com.hollingsworth.arsnouveau.common.spell.effect.EffectSnare',       names: ['Binding', 'Entangling'] },
    { cls: 'com.hollingsworth.arsnouveau.common.spell.effect.EffectFreeze',      names: ['Glacial', 'Frost'] },
    { cls: 'com.hollingsworth.arsnouveau.common.spell.effect.EffectPull',        names: ['Drawing', 'Magnetic'] },
    { cls: 'com.hollingsworth.arsnouveau.common.spell.effect.EffectLight',       names: ['Radiant', 'Illuminating'] },
    { cls: 'com.hollingsworth.arsnouveau.common.spell.effect.EffectBubble',      names: ['Shielding', 'Warding'] },
    { cls: 'com.hollingsworth.arsnouveau.common.spell.effect.EffectFell',        names: ['Felling', 'Cleaving'] },
    { cls: 'com.hollingsworth.arsnouveau.common.spell.effect.EffectBreak',       names: ['Shattering', 'Crushing'] },
    { cls: 'com.hollingsworth.arsnouveau.common.spell.effect.EffectGrow',        names: ['Verdant', 'Flourishing'] },
    { cls: 'com.hollingsworth.arsnouveau.common.spell.effect.EffectFirework',    names: ['Festive', 'Sparkling'] },
    { cls: 'com.hollingsworth.arsnouveau.common.spell.effect.EffectPhantomBlock',names: ['Conjured', 'Spectral'] },
    { cls: 'alexthw.ars_elemental.common.glyphs.EffectSummonBee',                names: ['Swarming summon', 'Buzzing summon'] },
    { cls: 'alexthw.ars_elemental.common.glyphs.EffectSummonSlime',              names: ['Gelatinous summon', 'Viscous summon'] },
    { cls: 'alexthw.ars_elemental.common.glyphs.EffectSlipper',                  names: ['Slipping', 'Gliding'] },
    { cls: 'alexthw.ars_elemental.common.glyphs.EffectGeyser',                   names: ['Gushing', 'Torrential'] }
]


function getPlayerSource(player) {
    if (!player.persistentData.contains('resonant_source')) return SOURCE_MAX
    return player.persistentData.getInt('resonant_source')
}

function setPlayerSource(player, value) {
    player.persistentData.putInt('resonant_source', value)
}

function sourceBossbarColor(source) {
    if (source > SOURCE_HIGH_THRESHOLD) return 'blue'
    if (source > SOURCE_LOW_THRESHOLD) return 'purple'
    if (source > 0) return 'pink'
    return 'red'
}

function resonantBossbarId(player) {
    return 'cat-astrophe:resonant_' + String(player.uuid).replace(/-/g, '')
}

function createSourceBossbar(player) {
    var id = resonantBossbarId(player)
    var source = getPlayerSource(player)
    var server = player.level.getServer()
    server.runCommandSilent('bossbar remove ' + id)
    server.runCommandSilent('bossbar add ' + id + ' {"text":"Resonance"}')
    server.runCommandSilent('bossbar set ' + id + ' max 100')
    server.runCommandSilent('bossbar set ' + id + ' value ' + Math.round(source))
    server.runCommandSilent('bossbar set ' + id + ' color ' + sourceBossbarColor(source))
    server.runCommandSilent('bossbar set ' + id + ' style notched_10')
    server.runCommandSilent('bossbar set ' + id + ' players ' + player.username)
    player.persistentData.putInt('resonant_bossbar_active', 1)
}

function updateSourceBossbar(player, source) {
    var id = resonantBossbarId(player)
    var server = player.level.getServer()
    server.runCommandSilent('bossbar set ' + id + ' value ' + Math.round(source))
    server.runCommandSilent('bossbar set ' + id + ' color ' + sourceBossbarColor(source))
}

function removeSourceBossbar(player) {
    player.level.getServer().runCommandSilent('bossbar remove ' + resonantBossbarId(player))
    player.persistentData.putInt('resonant_bossbar_active', 0)
}

function clearNegativeEffects(player) {
    player.level.getServer().runCommandSilent('effect clear ' + player.username + ' minecraft:weakness')
    player.level.getServer().runCommandSilent('effect clear ' + player.username + ' minecraft:slowness')
    player.level.getServer().runCommandSilent('effect clear ' + player.username + ' minecraft:poison')
}

function tryConsumeSourceFood(player, itemId) {
    var gain = 0
    for (var i = 0; i < SOURCE_FOODS.length; i++) {
        if (SOURCE_FOODS[i] === itemId) { gain = SOURCE_FOOD_GAIN; break }
    }
    if (gain === 0) {
        for (var j = 0; j < SOURCE_FOODS_CRAFTED.length; j++) {
            if (SOURCE_FOODS_CRAFTED[j] === itemId) { gain = SOURCE_FOOD_GAIN_CRAFTED; break }
        }
    }
    if (gain === 0) return false
    var currentSource = getPlayerSource(player)
    if (currentSource >= SOURCE_MAX) return false
    var now = player.level.time
    var lastEat = player.persistentData.getLong('resonant_last_eat')
    if (now - lastEat < SOURCE_EAT_COOLDOWN) return false
    player.persistentData.putLong('resonant_last_eat', now)
    player.level.getServer().runCommandSilent('clear ' + player.username + ' ' + itemId + ' 1')
    var newSource = Math.min(SOURCE_MAX, currentSource + gain)
    setPlayerSource(player, newSource)
    updateSourceBossbar(player, newSource)
    clearNegativeEffects(player)
    player.level.getServer().runCommandSilent('title ' + player.username + ' actionbar {"text":"+' + gain + ' Resonance","color":"blue"}')
    player.level.getServer().runCommandSilent('playsound ars_nouveau:ea_channel block ' + player.username + ' ' + player.x + ' ' + player.y + ' ' + player.z + ' 0.6 1.2')
    player.level.getServer().runCommandSilent('particle minecraft:end_rod ' + player.x + ' ' + (player.y + 1.0) + ' ' + player.z + ' 0.2 0.3 0.2 0.04 10')
    return true
}

NeoOriginsEvents.originChosen(function(event) {
    if (String(event.getOriginId()) !== 'cat-astrophe:resonant') return
    var player = event.getPlayer()
    player.persistentData.putInt('resonant_is_owner', 1)
    player.tags.add('resonant_owner')
    player.tags.remove('resonant_lost_pending')
    try { player.getFoodData().setSaturation(0) } catch(e) {}
    createSourceBossbar(player)
})

NeoOriginsEvents.originChanged(function(event) {
    if (String(event.getOldOriginId()) !== 'cat-astrophe:resonant') return
    event.getPlayer().tags.add('resonant_lost_pending')
})

PlayerEvents.loggedIn(function(event) {
    var player = event.player
    if (player.persistentData.getInt('resonant_is_owner') !== 1) return
    player.tags.add('resonant_owner')
    player.tags.remove('resonant_lost_pending')
    try { player.getFoodData().setSaturation(0) } catch(e) {}
    createSourceBossbar(player)
})

PlayerEvents.loggedOut(function(event) {
    var player = event.player
    if (player.tags.contains('resonant_owner')) removeSourceBossbar(player)
    player.tags.remove('resonant_owner')
})

PlayerEvents.tick(function(event) {
    var player = event.player

    if (player.tags.contains('resonant_lost_pending')) {
        if (player.tags.contains('resonant_owner')) removeSourceBossbar(player)
        player.persistentData.putInt('resonant_is_owner', 0)
        player.tags.remove('resonant_lost_pending')
        player.tags.remove('resonant_owner')
        player.tags.remove('resonant_starved')
        return
    }

    if (!player.tags.contains('resonant_owner')) return
    if (player.isCreative()) return

    if (player.persistentData.getInt('resonant_bossbar_active') < 1) {
        createSourceBossbar(player)
    }

    try { player.getFoodData().setSaturation(0) } catch(e) {}

    var curHealth = Math.floor(player.health)
    var prevHealth = player.persistentData.contains('resonant_prev_health') ? player.persistentData.getInt('resonant_prev_health') : curHealth
    player.persistentData.putInt('resonant_prev_health', curHealth)
    if (curHealth < prevHealth) {
        var dmgDrain = Math.max(1, Math.floor((prevHealth - curHealth) * SOURCE_DAMAGE_DRAIN_RATIO))
        var srcBefore = getPlayerSource(player)
        var srcAfter = Math.max(0, srcBefore - dmgDrain)
        setPlayerSource(player, srcAfter)
        updateSourceBossbar(player, srcAfter)
        if (srcAfter === 0 && srcBefore > 0) {
            player.tags.add('resonant_starved')
            player.level.getServer().runCommandSilent('effect give ' + player.username + ' minecraft:weakness ' + SOURCE_EFFECT_DURATION + ' ' + SOURCE_EFFECT_AMPLIFIER + ' true')
            player.level.getServer().runCommandSilent('effect give ' + player.username + ' minecraft:slowness ' + SOURCE_EFFECT_DURATION + ' ' + SOURCE_EFFECT_AMPLIFIER + ' true')
            player.level.getServer().runCommandSilent('effect give ' + player.username + ' minecraft:poison ' + SOURCE_EFFECT_DURATION + ' ' + SOURCE_EFFECT_AMPLIFIER + ' true')
            player.level.getServer().runCommandSilent('playsound ars_nouveau:dominion_wand_fail block ' + player.username + ' ' + player.x + ' ' + player.y + ' ' + player.z + ' 0.8 0.7')
        }
    }

    if (player.level.time % SOURCE_INTERVAL !== 0) return

    var wasStarved = player.tags.contains('resonant_starved')
    var source = getPlayerSource(player)
    var prevSource = source

    source = Math.max(0, source - SOURCE_DRAIN)
    setPlayerSource(player, source)
    updateSourceBossbar(player, source)

    if (source < SOURCE_LOW_THRESHOLD && prevSource >= SOURCE_LOW_THRESHOLD) {
        player.level.getServer().runCommandSilent('playsound ars_nouveau:dominion_wand_fail block ' + player.username + ' ' + player.x + ' ' + player.y + ' ' + player.z + ' 0.4 1.1')
    }

    if (source === 0) {
        player.tags.add('resonant_starved')
        player.level.getServer().runCommandSilent('effect give ' + player.username + ' minecraft:weakness ' + SOURCE_EFFECT_DURATION + ' ' + SOURCE_EFFECT_AMPLIFIER + ' true')
        player.level.getServer().runCommandSilent('effect give ' + player.username + ' minecraft:slowness ' + SOURCE_EFFECT_DURATION + ' ' + SOURCE_EFFECT_AMPLIFIER + ' true')
        player.level.getServer().runCommandSilent('effect give ' + player.username + ' minecraft:poison ' + SOURCE_EFFECT_DURATION + ' ' + SOURCE_EFFECT_AMPLIFIER + ' true')
        if (!wasStarved) {
            player.level.getServer().runCommandSilent('playsound ars_nouveau:dominion_wand_fail block ' + player.username + ' ' + player.x + ' ' + player.y + ' ' + player.z + ' 0.8 0.7')
        }
        player.level.getServer().runCommandSilent('particle minecraft:reverse_portal ' + player.x + ' ' + (player.y + 0.5) + ' ' + player.z + ' 0.3 0.5 0.3 0.02 8')
    } else {
        if (wasStarved) {
            player.tags.remove('resonant_starved')
            clearNegativeEffects(player)
            player.level.getServer().runCommandSilent('playsound ars_nouveau:dominion_wand_success block ' + player.username + ' ' + player.x + ' ' + player.y + ' ' + player.z + ' 0.7 1.1')
            player.level.getServer().runCommandSilent('particle minecraft:end_rod ' + player.x + ' ' + (player.y + 1.0) + ' ' + player.z + ' 0.3 0.5 0.3 0.05 25')
        }
        if (source < SOURCE_LOW_THRESHOLD) {
            player.level.getServer().runCommandSilent('effect give ' + player.username + ' minecraft:weakness ' + SOURCE_EFFECT_DURATION + ' ' + SOURCE_EFFECT_AMPLIFIER + ' true')
            player.level.getServer().runCommandSilent('effect give ' + player.username + ' minecraft:slowness ' + SOURCE_EFFECT_DURATION + ' ' + SOURCE_EFFECT_AMPLIFIER + ' true')
            player.level.getServer().runCommandSilent('particle minecraft:reverse_portal ' + player.x + ' ' + (player.y + 0.5) + ' ' + player.z + ' 0.2 0.3 0.2 0.01 3')
        }
    }

    if (source > SOURCE_HIGH_THRESHOLD) {
        player.level.getServer().runCommandSilent('effect give ' + player.username + ' minecraft:regeneration ' + SOURCE_EFFECT_DURATION + ' ' + SOURCE_HIGH_EFFECT_AMPLIFIER + ' true')
        player.level.getServer().runCommandSilent('effect give ' + player.username + ' minecraft:glowing ' + SOURCE_EFFECT_DURATION + ' ' + SOURCE_HIGH_EFFECT_AMPLIFIER + ' true')
    }
})

ItemEvents.rightClicked(function(event) {
    if (String(event.hand) !== 'MAIN_HAND') return
    var player = event.player
    if (!player || !player.tags.contains('resonant_owner')) return
    if (player.isCrouching()) return
    if (tryConsumeSourceFood(player, String(event.item.id))) event.cancel()
})

BlockEvents.rightClicked(function(event) {
    if (String(event.hand) !== 'MAIN_HAND') return
    var player = event.player
    if (!player || !player.tags.contains('resonant_owner')) return
    if (!player.isCrouching()) return

    var block = event.block
    var blockId = String(block.id)
    var currentSource = getPlayerSource(player)

    if (blockId === SOURCE_JAR_ID || blockId === SOURCE_CREATIVE_JAR_ID) {
        if (currentSource >= SOURCE_MAX) return
        var isCreative = blockId === SOURCE_CREATIVE_JAR_ID
        var gain = 0
        try {
            var be = block.getEntity()
            if (be !== null) {
                if (isCreative) {
                    gain = Math.min(SOURCE_JAR_GAIN, SOURCE_MAX - currentSource)
                } else {
                    var jarSource = be.getSource()
                    if (jarSource >= SOURCE_JAR_COST) {
                        be.setSource(jarSource - SOURCE_JAR_COST)
                        gain = Math.min(SOURCE_JAR_GAIN, SOURCE_MAX - currentSource)
                    } else if (jarSource > 0) {
                        var partial = Math.floor(jarSource / SOURCE_JAR_COST * SOURCE_JAR_GAIN)
                        if (partial > 0) {
                            be.setSource(0)
                            gain = Math.min(partial, SOURCE_MAX - currentSource)
                        }
                    }
                }
            }
        } catch(e) {}
        if (gain > 0) {
            setPlayerSource(player, currentSource + gain)
            updateSourceBossbar(player, currentSource + gain)
            clearNegativeEffects(player)
            player.level.getServer().runCommandSilent('title ' + player.username + ' actionbar {"text":"+' + gain + ' Resonance","color":"blue"}')
            player.level.getServer().runCommandSilent('playsound ars_nouveau:ea_finish block ' + player.username + ' ' + block.x + ' ' + block.y + ' ' + block.z + ' 0.9 1.0')
            player.level.getServer().runCommandSilent('particle minecraft:end_rod ' + block.x + ' ' + (block.y + 0.5) + ' ' + block.z + ' 0.3 0.4 0.3 0.05 20')
            event.cancel()
        }
        return
    }

    var itemId = String(player.mainHandItem.id)
    if (tryConsumeSourceFood(player, itemId)) event.cancel()
})

function createSpellParchment() {
    try {
        var formEntry = SCROLL_FORM_CLASSES[Math.floor(Math.random() * SCROLL_FORM_CLASSES.length)]
        var effectEntry = SCROLL_EFFECT_CLASSES[Math.floor(Math.random() * SCROLL_EFFECT_CLASSES.length)]
        var formName = formEntry.cls
        var effectName = effectEntry.cls
        var formPart = Java.loadClass(formName).INSTANCE
        var effectPart = Java.loadClass(effectName).INSTANCE
        if (!formPart || !effectPart) return null

        var JASpell = Java.loadClass('com.hollingsworth.arsnouveau.api.spell.Spell')
        var spell = new JASpell()
        var addSingle = 'add(com.hollingsworth.arsnouveau.api.spell.AbstractSpellPart)'
        spell = spell[addSingle](formPart)
        spell = spell[addSingle](effectPart)

        var formLabel = formEntry.names[Math.floor(Math.random() * formEntry.names.length)]
        var effectLabel = effectEntry.names[Math.floor(Math.random() * effectEntry.names.length)]
        var spellPrefix = ''

        if (EFFECT_AOE_SET[effectName]) {
            var aoeCount = Math.floor(Math.random() * 4)
            if (aoeCount > 0) {
                var aoePart = Java.loadClass('com.hollingsworth.arsnouveau.common.spell.augment.AugmentAOE').INSTANCE
                for (var i = 0; i < aoeCount; i++) spell = spell[addSingle](aoePart)
                spellPrefix = AOE_PREFIXES[aoeCount]
            }
        }

        if (EFFECT_DURATION_SET[effectName]) {
            var durRoll = Math.floor(Math.random() * 5) - 1
            var durPrefix = DUR_PREFIXES[durRoll + 1]
            if (durRoll > 0) {
                var extendPart = Java.loadClass('com.hollingsworth.arsnouveau.common.spell.augment.AugmentExtendTime').INSTANCE
                for (var j = 0; j < durRoll; j++) spell = spell[addSingle](extendPart)
            } else if (durRoll < 0) {
                var shortenPart = Java.loadClass('com.hollingsworth.arsnouveau.common.spell.augment.AugmentDurationDown').INSTANCE
                spell = spell[addSingle](shortenPart)
            }
            if (durPrefix) spellPrefix = spellPrefix ? spellPrefix + ' ' + durPrefix : durPrefix
        }

        var spellName = (spellPrefix ? spellPrefix + ' ' : '') + effectLabel + ' ' + formLabel

        var JACasterTomeData = Java.loadClass('com.hollingsworth.arsnouveau.common.crafting.recipes.CasterTomeData')
        var JABuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
        var JAResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
        var imbuedItem = JABuiltInRegistries.ITEM.get(JAResourceLocation.parse('ars_additions:imbued_spell_parchment'))

        return JACasterTomeData.makeTome(imbuedItem, spellName, spell, '')
    } catch(e) {
        console.error('[resonant] createSpellParchment failed: ' + e)
        return null
    }
}

NeoOriginsEvents.powerActivated(function(event) {
    if (String(event.getPowerId()) !== 'cat-astrophe:resonant_channel') return
    var player = event.getPlayer()
    player.tags.remove('resonant_channeled')

    var hasVoidChord = false
    try {
        if (player.persistentData.contains('devil_pacts')) {
            var pactList = JSON.parse(player.persistentData.getString('devil_pacts'))
            for (var i = 0; i < pactList.length; i++) {
                if (pactList[i] === 'void_chord') { hasVoidChord = true; break }
            }
        }
    } catch(e) {}

    var hp = player.health
    if (hasVoidChord) {
        if (hp <= 1.0) {
            player.displayClientMessage(Text.of('§cNot enough health to channel.'), true)
            return
        }
    } else {
        var source = getPlayerSource(player)
        if (source < SCROLL_COST) {
            player.displayClientMessage(Text.of('§cNot enough Resonance.'), true)
            return
        }
    }

    var stack = createSpellParchment()
    if (!stack) {
        player.displayClientMessage(Text.of('§cResonance failed to form.'), true)
        return
    }

    if (hasVoidChord) {
        player.level.getServer().runCommandSilent('damage ' + player.username + ' ' + Math.min(6.0, hp - 1.0) + ' minecraft:out_of_world')
    } else {
        var newSource = Math.max(0, source - SCROLL_COST)
        setPlayerSource(player, newSource)
        updateSourceBossbar(player, newSource)
    }

    player.addItem(stack)
    player.displayClientMessage(Text.of('§9Spell channeled...'), true)
    player.level.getServer().runCommandSilent('playsound ars_nouveau:ea_channel block ' + player.username + ' ' + player.x + ' ' + player.y + ' ' + player.z + ' 0.8 1.2')
    player.level.getServer().runCommandSilent('particle minecraft:end_rod ' + player.x + ' ' + (player.y + 0.5) + ' ' + player.z + ' 0.3 0.5 0.3 0.05 15')
})
