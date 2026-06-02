
const NETWORK_CAP = 20

const SPREAD_INTERVAL = 2400
const SPREAD_RANGE = 5
const FREEZE_INTERVAL = 40
const SOUND_INTERVAL = 200
const FUNGAL_SOUND = 'minecraft:block.fungus.break'

var FUNGAL_SOUNDS = [
    'minecraft:block.fungus.break',
    'minecraft:block.fungus.step',
    'minecraft:block.mud.break',
    'minecraft:block.mud.step',
    'minecraft:block.mud.place',
    'minecraft:block.muddy_mangrove_roots.break',
    'minecraft:block.moss.break',
    'minecraft:block.moss.step',
    'minecraft:block.shroomlight.break',
    'minecraft:block.nether_sprouts.break',
    'minecraft:block.sculk.spread',
    'minecraft:entity.bogged.ambient'
]

function randomFungalSound() {
    return FUNGAL_SOUNDS[Math.floor(Math.random() * FUNGAL_SOUNDS.length)]
}

function toArray(javaCollection) {
    var arr = []
    try {
        var iter = javaCollection.iterator()
        while (iter.hasNext()) arr.push(iter.next())
    } catch(e) {
        try {
            for (var i = 0; i < javaCollection.size(); i++) arr.push(javaCollection.get(i))
        } catch(e2) {}
    }
    return arr
}

function getInfectedMobs(player) {
    var result = []
    try {
        var data = player.persistentData
        if (!data.contains('myconid_infected_uuids')) return result
        var list = JSON.parse(data.getString('myconid_infected_uuids'))
        var entities = toArray(player.level.getEntities())
        for (var i = 0; i < entities.length; i++) {
            var e = entities[i]
            if (!e.isPlayer() && list.indexOf(e.uuid.toString()) !== -1) {
                result.push(e)
            }
        }
    } catch(e) {}
    return result
}

function getInfectedMobsOrdered(player) {
    var result = []
    try {
        var data = player.persistentData
        if (!data.contains('myconid_infected_uuids')) return result
        var list = JSON.parse(data.getString('myconid_infected_uuids'))
        var entities = toArray(player.level.getEntities())
        var entityMap = {}
        for (var i = 0; i < entities.length; i++) {
            var e = entities[i]
            if (!e.isPlayer()) entityMap[e.uuid.toString()] = e
        }
        for (var j = 0; j < list.length; j++) {
            var m = entityMap[list[j]]
            if (m && m.isAlive()) result.push(m)
        }
    } catch(e) {}
    return result
}

function saveInfectedUUID(player, uuid) {
    try {
        var data = player.persistentData
        var list = []
        if (data.contains('myconid_infected_uuids')) {
            list = JSON.parse(data.getString('myconid_infected_uuids'))
        }
        if (list.indexOf(uuid) === -1) list.push(uuid)
        data.putString('myconid_infected_uuids', JSON.stringify(list))
    } catch(e) {}
}

function removeInfectedUUID(player, uuid) {
    try {
        var data = player.persistentData
        if (!data.contains('myconid_infected_uuids')) return
        var list = JSON.parse(data.getString('myconid_infected_uuids'))
        list = list.filter(function(u) { return u !== uuid })
        data.putString('myconid_infected_uuids', JSON.stringify(list))
    } catch(e) {}
}

function infectMob(mob, ownerPlayer) {
    try {
        if (mob.isPlayer()) return false
        if (mob.tags.contains('myconid_infected')) return false
        var maxHp = 0
        try { maxHp = mob.maxHealth } catch(e) {}
        if (maxHp <= 0) return false
        var infectedCount = 0
        try {
            if (ownerPlayer.persistentData.contains('myconid_infected_uuids'))
                infectedCount = JSON.parse(ownerPlayer.persistentData.getString('myconid_infected_uuids')).length
        } catch(e) {}
        if (infectedCount >= NETWORK_CAP) return false

        mob.tags.add('myconid_infected')
        mob.persistentData.putBoolean('PersistenceRequired', true)
        saveInfectedUUID(ownerPlayer, mob.uuid.toString())
        mob.level.getServer().runCommandSilent('effect give @e[uuid=' + mob.uuid.toString() + '] minecraft:slowness 1000000 0 true')

        var log = {
            owner: ownerPlayer.username,
            infectedDay: Math.floor(ownerPlayer.level.time / 24000),
            spreadCount: 0
        }
        mob.persistentData.putString('myconid_log', JSON.stringify(log))

        mob.level.getServer().runCommandSilent(
            'execute positioned ' + mob.x + ' ' + mob.y + ' ' + mob.z +
            ' run playsound ' + randomFungalSound() + ' hostile @a[distance=..16] ~ ~ ~ 0.6 0.5'
        )
        return true
    } catch(e) {
        return false
    }
}

function sendCameraPacket(player, entity) {
    try {
        var JAPacket = Java.loadClass('net.minecraft.network.protocol.game.ClientboundSetCameraPacket')
        player.connection.send(new JAPacket(entity))
        return true
    } catch(e) {
        return false
    }
}

function exitPossession(player) {
    sendCameraPacket(player, player)
    player.tags.remove('myconoid_possessing')
    player.persistentData.remove('myconid_possess_uuid')
    player.persistentData.remove('myconid_slot_prev')
    player.level.getServer().runCommandSilent('effect clear ' + player.username + ' minecraft:slowness')
}

function getMobName(entity) {
    if (entity.hasCustomName()) {
        try { return String(entity.name.getString()) } catch(e) { return String(entity.name) }
    }
    var mobType = entity.type.toString()
    var name = mobType.indexOf(':') !== -1 ? mobType.split(':')[1] : mobType
    name = name.split('_').join(' ')
    return name.charAt(0).toUpperCase() + name.slice(1)
}

function clearMob(mob, ownerPlayer) {
    try {
        removeInfectedUUID(ownerPlayer, mob.uuid.toString())
        mob.tags.remove('myconid_infected')
        mob.persistentData.remove('PersistenceRequired')
        mob.persistentData.remove('myconid_log')
        mob.level.getServer().runCommandSilent('effect clear @e[uuid=' + mob.uuid.toString() + '] minecraft:slowness')
    } catch(e) {}
}


NeoOriginsEvents.powerActivated(function(event) {
    var powerId = String(event.getPowerId())
    var player = event.getPlayer()

    if (powerId === 'cat-astrophe:myconoid_network_collapse') {
        var collapseInfected = getInfectedMobs(player)
        if (collapseInfected.length === 0) {
            player.displayClientMessage(Text.of('§8[§2Myconid§8] §7No hosts in network.'), true)
            return
        }
        player.displayClientMessage(Text.of('§8[§2Myconid§8] §7Collapsing §2' + collapseInfected.length + ' §7host(s)...'), true)
        for (var ci = 0; ci < collapseInfected.length; ci++) {
            var cmob = collapseInfected[ci]
            if (!cmob.isAlive()) continue
            cmob.attack(2.0)
            cmob.level.getServer().runCommandSilent('effect give @e[uuid=' + cmob.uuid.toString() + '] minecraft:slowness 4 4 true')
            cmob.level.getServer().runCommandSilent('effect give @e[uuid=' + cmob.uuid.toString() + '] minecraft:blindness 4 0 true')
            cmob.level.getServer().runCommandSilent(
                'execute positioned ' + cmob.x + ' ' + cmob.y + ' ' + cmob.z +
                ' run playsound ' + FUNGAL_SOUND + ' hostile @a[distance=..24] ~ ~ ~ 1.2 0.3'
            )
            clearMob(cmob, player)
        }
        return
    }

    if (powerId !== 'cat-astrophe:myconoid_possess') return
    player.tags.remove('myconoid_possess_activated')

    if (player.tags.contains('myconoid_possessing')) return

    var infected = getInfectedMobs(player)
    var nearest = null
    var nearestDist = 9999999
    for (var i = 0; i < infected.length; i++) {
        var mob = infected[i]
        if (!mob.isAlive()) continue
        var dx = mob.x - player.x, dy = mob.y - player.y, dz = mob.z - player.z
        var d = dx*dx + dy*dy + dz*dz
        if (d < nearestDist) { nearest = mob; nearestDist = d }
    }

    if (nearest === null) {
        player.displayClientMessage(Text.of('§8[§2Myconid§8] §7No living hosts in network.'), true)
        return
    }

    player.displayClientMessage(Text.of('§8[§2Myconid§8] §7Observing: §2' + getMobName(nearest)), true)

    sendCameraPacket(player, nearest)
    player.persistentData.putString('myconid_possess_uuid', String(nearest.uuid))
    player.persistentData.putInt('myconid_slot_prev', player.inventory.selected)
    player.tags.add('myconoid_possessing')
    player.level.getServer().runCommandSilent('effect give ' + player.username + ' minecraft:slowness 999999 10 true')
})

ItemEvents.firstLeftClicked(function(event) {
    var player = event.player
    if (!player.tags.contains('myconoid_owner')) return
    if (!player.mainHandItem.isEmpty()) return

    var entities = toArray(player.level.getEntities())
    var nearest = null
    var nearestDist = 16.0
    for (var i = 0; i < entities.length; i++) {
        var e = entities[i]
        if (e.isPlayer() || !e.isAlive()) continue
        var edx = e.x - player.x, edy = e.y - player.y, edz = e.z - player.z
        var d = edx*edx + edy*edy + edz*edz
        if (d < nearestDist) {
            nearest = e
            nearestDist = d
        }
    }
    if (nearest) infectMob(nearest, player)
})

NeoOriginsEvents.originChosen(function(event) {
    if (String(event.getOriginId()) !== 'cat-astrophe:myconoid') return
    var player = event.getPlayer()
    player.persistentData.putInt('myconoid_is_owner', 1)
    player.tags.add('myconoid_owner')
    player.tags.remove('myconoid_lost_pending')
})

NeoOriginsEvents.originChanged(function(event) {
    if (String(event.getOldOriginId()) !== 'cat-astrophe:myconoid') return
    event.getPlayer().tags.add('myconoid_lost_pending')
})

PlayerEvents.loggedIn(function(event) {
    var player = event.player
    if (player.persistentData.getInt('myconoid_is_owner') !== 1) return
    player.tags.add('myconoid_owner')
    player.tags.remove('myconoid_lost_pending')
})

PlayerEvents.loggedOut(function(event) {
    var player = event.player
    if (player.tags.contains('myconoid_possessing')) {
        player.persistentData.remove('myconid_possess_uuid')
        player.persistentData.remove('myconid_slot_prev')
        player.level.getServer().runCommandSilent('effect clear ' + player.username + ' minecraft:slowness')
    }
    player.tags.remove('myconoid_owner')
})

PlayerEvents.respawned(function(event) {
    var player = event.player
    player.persistentData.remove('myconid_possess_uuid')
    player.persistentData.remove('myconid_slot_prev')
    if (!player.tags.contains('myconoid_owner')) return

    var infected = getInfectedMobs(player)
    var origin = { x: player.x, y: player.y, z: player.z }

    for (var i = 0; i < infected.length; i++) {
        var mob = infected[i]
        if (!mob.isAlive()) continue

        var dx = mob.x - origin.x
        var dz = mob.z - origin.z
        var delay = Math.floor(Math.sqrt(dx * dx + dz * dz) * 0.5)

        ;(function(m, d) {
            m.level.getServer().scheduleInTicks(d, function() {
                if (!m.isAlive()) return
                m.attack(6.0)
                m.level.getServer().runCommandSilent('effect give @e[uuid=' + m.uuid.toString() + '] minecraft:slowness 15 4 true')
                m.level.getServer().runCommandSilent('effect give @e[uuid=' + m.uuid.toString() + '] minecraft:blindness 15 0 true')
                m.level.getServer().runCommandSilent(
                    'execute positioned ' + m.x + ' ' + m.y + ' ' + m.z +
                    ' run playsound ' + FUNGAL_SOUND + ' hostile @a[distance=..32] ~ ~ ~ 2.0 0.25'
                )
                m.level.getServer().runCommandSilent(
                    'execute positioned ' + m.x + ' ' + (m.y + 1) + ' ' + m.z +
                    ' run particle minecraft:spore_blossom_air ~ ~ ~ 0.5 0.5 0.5 0.05 40 normal'
                )
                clearMob(m, player)
            })
        })(mob, delay)
    }
})

ItemEvents.entityInteracted(function(event) {
    var player = event.player
    var target = event.target
    if (!player.isCrouching()) return
    if (!player.tags.contains('myconoid_owner')) return
    if (!target.tags.contains('myconid_infected')) return

    var owned = getInfectedMobs(player)
    var isOwned = false
    for (var oi = 0; oi < owned.length; oi++) {
        if (owned[oi].uuid.toString() === target.uuid.toString()) { isOwned = true; break }
    }
    if (!isOwned) return

    player.persistentData.putString('myconid_sneak_uuid', target.uuid.toString())
    player.persistentData.putInt('myconid_sneak_ticks', 10)
    event.cancel()
})

EntityEvents.death(function(event) {
    var entity = event.entity
    var deadUUID = String(entity.uuid)
    var allPlayers = toArray(entity.level.players)
    for (var di = 0; di < allPlayers.length; di++) {
        var dp = allPlayers[di]
        if (!dp.tags.contains('myconoid_possessing')) continue
        if (!dp.persistentData.contains('myconid_possess_uuid')) continue
        if (String(dp.persistentData.getString('myconid_possess_uuid')) !== deadUUID) continue
        exitPossession(dp)
        if (entity.hasCustomName()) dp.displayClientMessage(Text.of('§8[§2Myconid§8] §7Host lost — connection severed.'), true)
    }

    if (!entity.tags.contains('myconid_infected')) return

    var x = Math.floor(entity.x), y = Math.floor(entity.y), z = Math.floor(entity.z)
    entity.level.getServer().runCommandSilent('loot spawn ' + x + ' ' + y + ' ' + z + ' loot cat-astrophe:myconoid_infected_mob')
    entity.level.getServer().runCommandSilent(
        'execute positioned ' + x + ' ' + y + ' ' + z +
        ' run playsound ' + FUNGAL_SOUND + ' hostile @a[distance=..16] ~ ~ ~ 1.0 0.4'
    )

    var ownerName = ''
    try {
        var ownerLogStr = entity.persistentData.getString('myconid_log')
        if (ownerLogStr !== 'null' && ownerLogStr !== '') {
            var ownerLog = JSON.parse(String(ownerLogStr))
            ownerName = ownerLog.owner || ''
        }
    } catch(e) {}
    var sameDimPlayers = toArray(entity.level.players)
    for (var i = 0; i < sameDimPlayers.length; i++) {
        var p = sameDimPlayers[i]
        var pddx = p.x - x, pddy = p.y - y, pddz = p.z - z
        if (pddx*pddx + pddy*pddy + pddz*pddz < 64) {
            p.level.getServer().runCommandSilent('effect give ' + p.username + ' minecraft:slowness 3 0 true')
        }
    }

    var allServerPlayers = toArray(entity.level.getServer().getPlayerList().getPlayers())
    for (var j = 0; j < allServerPlayers.length; j++) {
        var op = allServerPlayers[j]
        if (String(op.username) !== ownerName) continue
        removeInfectedUUID(op, entity.uuid.toString())
        op.level.getServer().runCommandSilent('playsound minecraft:block.sculk.charge player ' + op.username + ' ' + op.x + ' ' + op.y + ' ' + op.z + ' 1.0 0.5')
        op.displayClientMessage(Text.of('§8[§2Myconid§8] §7Host lost: §2' + getMobName(entity)), true)
        break
    }
})

PlayerEvents.tick(function(event) {
    var player = event.player
    var time = player.level.time

    if (player.tags.contains('myconoid_lost_pending')) {
        player.persistentData.putInt('myconoid_is_owner', 0)
        player.tags.remove('myconoid_lost_pending')
        player.tags.remove('myconoid_owner')
        var lostMobs = getInfectedMobs(player)
        for (var li = 0; li < lostMobs.length; li++) {
            clearMob(lostMobs[li], player)
        }
        return
    }

    if (!player.tags.contains('myconoid_owner')) return

    if (player.tags.contains('myconoid_possessing')) {
        if (player.isCrouching()) {
            exitPossession(player)
            return
        }
        var curSlot = player.inventory.selected
        var prevSlot = player.persistentData.getInt('myconid_slot_prev')
        player.persistentData.putInt('myconid_slot_prev', curSlot)
        if (curSlot !== prevSlot) {
            var forward = (curSlot > prevSlot) || (prevSlot === 8 && curSlot === 0)
            var orderedInfected = getInfectedMobsOrdered(player)
            if (orderedInfected.length <= 1) {
                player.displayClientMessage(Text.of('§8[§2Myconid§8] §7No other hosts in network.'), true)
            } else {
                var curUUID = player.persistentData.contains('myconid_possess_uuid') ? String(player.persistentData.getString('myconid_possess_uuid')) : ''
                var curIdx = 0
                for (var oi = 0; oi < orderedInfected.length; oi++) {
                    if (String(orderedInfected[oi].uuid) === curUUID) { curIdx = oi; break }
                }
                var nextIdx = forward ? (curIdx + 1) % orderedInfected.length : (curIdx - 1 + orderedInfected.length) % orderedInfected.length
                var nextHost = orderedInfected[nextIdx]
                sendCameraPacket(player, nextHost)
                player.persistentData.putString('myconid_possess_uuid', String(nextHost.uuid))
                player.displayClientMessage(Text.of('§8[§2Myconid§8] §7Observing: §2' + getMobName(nextHost) + ' §8(' + (nextIdx + 1) + '/' + orderedInfected.length + ')'), true)
            }
        }
        return
    }

    if (time % 2 === 0) {
        if (player.isCrouching()) {
            var infected = getInfectedMobs(player)
            var nearest = null
            var nearestDist = 25.0
            for (var ni = 0; ni < infected.length; ni++) {
                var sdx = infected[ni].x - player.x, sdy = infected[ni].y - player.y, sdz = infected[ni].z - player.z
                var d = sdx*sdx + sdy*sdy + sdz*sdz
                if (d < nearestDist) { nearest = infected[ni]; nearestDist = d }
            }
            if (nearest !== null) {
                var pdata = player.persistentData
                var prevUUID = pdata.contains('myconid_sneak_uuid') ? pdata.getString('myconid_sneak_uuid') : ''
                var prevTicks = pdata.contains('myconid_sneak_ticks') ? pdata.getInt('myconid_sneak_ticks') : 0
                var nearUUID = nearest.uuid.toString()

                if (prevUUID === 'cooldown') {
                    if (prevTicks < 0) {
                        pdata.putInt('myconid_sneak_ticks', prevTicks + 2)
                    } else {
                        pdata.putString('myconid_sneak_uuid', '')
                        pdata.putInt('myconid_sneak_ticks', 0)
                    }
                } else if (prevUUID === nearUUID && prevTicks >= 10) {
                    pdata.putString('myconid_sneak_uuid', 'cooldown')
                    pdata.putInt('myconid_sneak_ticks', -40)
                    try {
                        var logStr = nearest.persistentData.getString('myconid_log')
                        var logStrJS = String(logStr).split('NaN').join('0')
                        var log = JSON.parse(logStrJS)
                        var currentDay = Math.floor(nearest.level.time / 24000)
                        var daysSince = currentDay - (Math.floor(log.infectedDay) || 0)
                        var spread = Math.floor(log.spreadCount) || 0

                        var mobType = nearest.type.toString()
                        var flavor = 'Unknown host — mycelium adapting. Colony behaviour uncharted.'
                        var undead = ['minecraft:zombie','minecraft:skeleton','minecraft:drowned','minecraft:phantom','minecraft:wither_skeleton','minecraft:stray','minecraft:husk','minecraft:zombie_villager','minecraft:zombified_piglin','minecraft:zoglin']
                        var arthropod = ['minecraft:spider','minecraft:cave_spider']
                        var livestock = ['minecraft:cow','minecraft:sheep','minecraft:pig','minecraft:chicken','minecraft:rabbit','minecraft:horse','minecraft:donkey','minecraft:mule','minecraft:llama']
                        var aquatic = ['minecraft:squid','minecraft:glow_squid','minecraft:cod','minecraft:salmon','minecraft:tropical_fish','minecraft:pufferfish','minecraft:turtle','minecraft:axolotl','minecraft:tadpole']
                        var hostVolatile = ['minecraft:creeper','minecraft:witch','minecraft:pillager','minecraft:vindicator','minecraft:ravager','minecraft:iron_golem']
                        var neutral = ['minecraft:wolf','minecraft:cat','minecraft:fox','minecraft:bee','minecraft:goat','minecraft:panda','minecraft:polar_bear','minecraft:trader_llama']
                        var sapient = ['minecraft:villager','minecraft:wandering_trader']
                        var nether = ['minecraft:piglin','minecraft:blaze','minecraft:ghast','minecraft:magma_cube','minecraft:hoglin','minecraft:strider']
                        var end = ['minecraft:enderman','minecraft:shulker']

                        if (undead.indexOf(mobType) !== -1) flavor = 'Reanimated tissue — mycelium bonded to necrotic substrate. Durable. Mindless.'
                        else if (arthropod.indexOf(mobType) !== -1) flavor = 'Chitinous host — spore threads woven between exoskeletal plates. Skittish but persistent.'
                        else if (livestock.indexOf(mobType) !== -1) flavor = 'Docile carrier — colony thrives undisturbed. High exposure risk in open terrain.'
                        else if (aquatic.indexOf(mobType) !== -1) flavor = 'Aquatic host — mycelium adapted to saline substrate. Network signal degraded by distance.'
                        else if (hostVolatile.indexOf(mobType) !== -1) flavor = 'Volatile host — spore integration unstable. Handle with discretion.'
                        else if (neutral.indexOf(mobType) !== -1) flavor = 'Semi-aware host — mycelium suppressing territorial instincts. Bond is tenuous.'
                        else if (sapient.indexOf(mobType) !== -1) flavor = 'Sapient host — colony concealed beneath social behaviour. Highest intelligence carrier.'
                        else if (nether.indexOf(mobType) !== -1) flavor = 'Extreme environment host — mycelium under thermal stress. Integrity may degrade.'
                        else if (end.indexOf(mobType) !== -1) flavor = 'Spatial anomaly host — spore threads disrupted by dimensional phasing. Unpredictable.'

                        var healthPct = Math.floor((nearest.health / nearest.maxHealth) * 100)
                        var integrity = healthPct > 75 ? 'stable' : healthPct > 40 ? 'weakened' : 'critical'
                        var networkSize = infected.length

                        var nearbyNodes = 0
                        var allEntities = toArray(nearest.level.getEntities())
                        for (var nj = 0; nj < allEntities.length; nj++) {
                            var ne = allEntities[nj]
                            var nndx = ne.x - nearest.x, nndy = ne.y - nearest.y, nndz = ne.z - nearest.z
                            if (ne !== nearest && ne.tags.contains('myconid_infected') && nndx*nndx + nndy*nndy + nndz*nndz <= 1024) {
                                var neUUID = ne.uuid.toString()
                                var isOwned = false
                                for (var ok = 0; ok < infected.length; ok++) {
                                    if (infected[ok].uuid.toString() === neUUID) { isOwned = true; break }
                                }
                                if (isOwned) nearbyNodes++
                            }
                        }
                        var nodeFlav = nearbyNodes === 0 ? 'isolated host, no reinforcement' : nearbyNodes < 3 ? 'sparse cluster' : 'dense colony cluster detected'

                        player.tell(Text.of('§8[§2Myconid§8] §7' + flavor))
                        player.tell(Text.of('§8Host integrity: §2' + integrity + ' §7(' + healthPct + '%) §8— Network: §2' + networkSize + '§7/§220'))
                        player.tell(Text.of('§8Adjacent nodes: §2' + nearbyNodes + ' §7— ' + nodeFlav))
                        player.tell(Text.of('§8Colonized §2' + daysSince + ' §8day(s) ago  §8Spread: §2' + spread))
                    } catch(e) {}
                }
            } else {
                player.persistentData.putString('myconid_sneak_uuid', '')
                player.persistentData.putInt('myconid_sneak_ticks', 0)
            }
        } else {
            player.persistentData.putString('myconid_sneak_uuid', '')
            player.persistentData.putInt('myconid_sneak_ticks', 0)
        }
    }

    if (time % FREEZE_INTERVAL !== 0) return

    var infected = getInfectedMobs(player)
    var isCrouching = player.isCrouching()

    for (var mi = 0; mi < infected.length; mi++) {
        var mob = infected[mi]
        if (!mob.isAlive()) {
            clearMob(mob, player)
            continue
        }

        if (isCrouching) {
            mob.level.getServer().runCommandSilent('effect give @e[uuid=' + mob.uuid.toString() + '] minecraft:slowness 3 1 true')
            continue
        }

        mob.level.getServer().runCommandSilent('effect give @e[uuid=' + mob.uuid.toString() + '] minecraft:slowness 1000000 0 true')

        mob.level.getServer().runCommandSilent(
            'execute positioned ' + mob.x + ' ' + (mob.y + 1) + ' ' + mob.z +
            ' run particle minecraft:spore_blossom_air ~ ~ ~ 0.3 0.5 0.3 0.02 8 normal'
        )

        if (time % SOUND_INTERVAL === 0) {
            mob.level.getServer().runCommandSilent(
                'execute positioned ' + mob.x + ' ' + mob.y + ' ' + mob.z +
                ' run playsound ' + randomFungalSound() + ' hostile @a[distance=..16] ~ ~ ~ 0.8 0.35'
            )
        }

        if (time % SPREAD_INTERVAL === 0) {
            var nearbyEntities = toArray(mob.level.getEntities())
            var candidates = []
            for (var ni = 0; ni < nearbyEntities.length; ni++) {
                var ne = nearbyEntities[ni]
                var spdx = ne.x - mob.x, spdy = ne.y - mob.y, spdz = ne.z - mob.z
                if (!ne.isPlayer() &&
                    ne.isAlive() &&
                    ne !== mob &&
                    !ne.tags.contains('myconid_infected') &&
                    spdx*spdx + spdy*spdy + spdz*spdz <= SPREAD_RANGE * SPREAD_RANGE) {
                    candidates.push(ne)
                }
            }
            if (candidates.length > 0) {
                var target = candidates[Math.floor(Math.random() * candidates.length)]
                var success = infectMob(target, player)
                if (success) {
                    try {
                        var logStr = mob.persistentData.getString('myconid_log')
                        if (logStr && logStr !== 'null') {
                            var log = JSON.parse(String(logStr))
                            log.spreadCount = (log.spreadCount || 0) + 1
                            mob.persistentData.putString('myconid_log', JSON.stringify(log))
                        }
                    } catch(e) {}
                    player.level.getServer().runCommandSilent('playsound minecraft:block.mycelium.step player ' + player.username + ' ' + player.x + ' ' + player.y + ' ' + player.z + ' 0.8 0.7')
                    player.displayClientMessage(Text.of('§2The network grows...'), true)
                }
            }
        }
    }
})

ServerEvents.commandRegistry(function(event) {
    var JACommands = Java.loadClass('net.minecraft.commands.Commands')
    event.register(
        JACommands.literal('myconid').requires(function(src) { return src.hasPermission(2) })
            .then(JACommands.literal('purge').executes(function(ctx) {
                var server = ctx.getSource().getServer()
                var count = 0
                var levels = toArray(server.getAllLevels())
                for (var li = 0; li < levels.length; li++) {
                    var entities = toArray(levels[li].getEntities())
                    for (var ei = 0; ei < entities.length; ei++) {
                        var e = entities[ei]
                        if (!e.tags.contains('myconid_infected')) continue
                        e.tags.remove('myconid_infected')
                        e.persistentData.remove('PersistenceRequired')
                        e.persistentData.remove('myconid_log')
                        server.runCommandSilent('effect clear @e[uuid=' + e.uuid + '] minecraft:slowness')
                        count++
                    }
                }
                var players = toArray(server.getPlayerList().getPlayers())
                for (var pi = 0; pi < players.length; pi++) {
                    players[pi].persistentData.remove('myconid_infected_uuids')
                }
                ctx.getSource().sendSuccess(function() { return Text.of('Purged ' + count + ' infected entities and cleared all networks.') }, false)
                return 1
            }))
    )
})

