const MOMENTUM_MAX = 100
const MOMENTUM_INTERVAL = 20
const MOMENTUM_GAIN_MAX = 3
const MOMENTUM_DRAIN = 1
const MOMENTUM_SPEED_THRESHOLD = 80
const MOMENTUM_COLOR_HIGH = 60
const MOMENTUM_COLOR_LOW = 30

const STALL_EFFECT_DURATION = 40
const STALL_PARTICLE_COUNT = 6
const SPEED_EFFECT_DURATION = 40

const RUSH_DURATION = 100
const RUSH_TRAIL_SLOTS = 8
const RUSH_TRAIL_INTERVAL = 5

const RPM_SCAN_RANGE = 4
const RPM_SCAN_Y = 2
const RPM_TIER_SIZE = 64
const RPM_FAST_EXIT = MOMENTUM_GAIN_MAX * RPM_TIER_SIZE
const CREATIVE_MOTOR_RPM = 256
const CREATIVE_MOTOR_ID = 'create:creative_motor'

var JADustParticle = null
var JAVec3f = null
try {
    JADustParticle = Java.loadClass('net.minecraft.core.particles.DustParticleOptions')
    JAVec3f = Java.loadClass('org.joml.Vector3f')
} catch(e) {}

function spawnDust(level, x, y, z, r, g, b, size) {
    if (!JADustParticle || !JAVec3f) return
    try {
        var data = new JADustParticle(new JAVec3f(r, g, b), size)
        level.sendParticles(data, x, y, z, 1, 0, 0, 0, 0)
    } catch(e) {}
}

function getMomentum(player) {
    if (!player.persistentData.contains('automaton_momentum')) return MOMENTUM_MAX
    return player.persistentData.getInt('automaton_momentum')
}

function setMomentum(player, value) {
    player.persistentData.putInt('automaton_momentum', value)
}

function getNearbyRPM(player) {
    var px = Math.floor(player.x)
    var py = Math.floor(player.y)
    var pz = Math.floor(player.z)
    var maxRPM = 0
    for (var dx = -RPM_SCAN_RANGE; dx <= RPM_SCAN_RANGE; dx++) {
        for (var dz = -RPM_SCAN_RANGE; dz <= RPM_SCAN_RANGE; dz++) {
            for (var dy = -RPM_SCAN_Y; dy <= RPM_SCAN_Y; dy++) {
                var block = player.level.getBlock(px + dx, py + dy, pz + dz)
                if (String(block.id) === CREATIVE_MOTOR_ID) return CREATIVE_MOTOR_RPM
                try {
                    var be = block.getEntity()
                    if (be !== null) {
                        var speed = be.getSpeed()
                        speed = speed < 0 ? -speed : speed
                        if (speed > maxRPM) {
                            maxRPM = speed
                            if (maxRPM >= RPM_FAST_EXIT) return maxRPM
                        }
                    }
                } catch(e) {}
            }
        }
    }
    return maxRPM
}

function hasMoved(player) {
    var data = player.persistentData
    var cx = Math.floor(player.x)
    var cz = Math.floor(player.z)
    if (!data.contains('automaton_prev_x')) {
        data.putInt('automaton_prev_x', cx)
        data.putInt('automaton_prev_z', cz)
        return false
    }
    var px = data.getInt('automaton_prev_x')
    var pz = data.getInt('automaton_prev_z')
    data.putInt('automaton_prev_x', cx)
    data.putInt('automaton_prev_z', cz)
    return cx !== px || cz !== pz
}

function automatonBossbarColor(momentum) {
    if (momentum > MOMENTUM_COLOR_HIGH) return 'yellow'
    if (momentum > MOMENTUM_COLOR_LOW) return 'red'
    return 'purple'
}

function automatonBossbarId(player) {
    return 'cat-astrophe:automaton_' + String(player.uuid).replace(/-/g, '')
}

function createBossbar(player) {
    var id = automatonBossbarId(player)
    var momentum = getMomentum(player)
    var server = player.level.getServer()
    server.runCommandSilent('bossbar remove ' + id)
    server.runCommandSilent('bossbar add ' + id + ' {"text":"Momentum"}')
    server.runCommandSilent('bossbar set ' + id + ' max 100')
    server.runCommandSilent('bossbar set ' + id + ' value ' + Math.round(momentum))
    server.runCommandSilent('bossbar set ' + id + ' color ' + automatonBossbarColor(momentum))
    server.runCommandSilent('bossbar set ' + id + ' players ' + player.username)
    player.persistentData.putInt('automaton_is_owner', 1)
    player.persistentData.putInt('automaton_bossbar_active', 1)
}

function updateBossbar(player, momentum) {
    var id = automatonBossbarId(player)
    var server = player.level.getServer()
    server.runCommandSilent('bossbar set ' + id + ' value ' + Math.round(momentum))
    server.runCommandSilent('bossbar set ' + id + ' color ' + automatonBossbarColor(momentum))
}

function removeBossbar(player) {
    player.level.getServer().runCommandSilent('bossbar remove ' + automatonBossbarId(player))
    player.persistentData.putInt('automaton_bossbar_active', 0)
}

NeoOriginsEvents.originChosen(function(event) {
    if (String(event.getOriginId()) !== 'cat-astrophe:automaton') return
    var player = event.getPlayer()
    player.persistentData.putInt('automaton_is_owner', 1)
    player.tags.add('automaton_owner')
    player.tags.remove('automaton_lost_pending')
    createBossbar(player)
})

NeoOriginsEvents.originChanged(function(event) {
    if (String(event.getOldOriginId()) !== 'cat-astrophe:automaton') return
    event.getPlayer().tags.add('automaton_lost_pending')
})

PlayerEvents.loggedIn(function(event) {
    var player = event.player
    if (player.persistentData.getInt('automaton_is_owner') !== 1) return
    player.tags.add('automaton_owner')
    player.tags.remove('automaton_lost_pending')
    createBossbar(player)
})

PlayerEvents.loggedOut(function(event) {
    var player = event.player
    if (player.tags.contains('automaton_owner')) removeBossbar(player)
    player.tags.remove('automaton_owner')
})

PlayerEvents.tick(function(event) {
    var player = event.player

    if (player.tags.contains('automaton_lost_pending')) {
        if (player.tags.contains('automaton_owner')) removeBossbar(player)
        player.persistentData.putInt('automaton_is_owner', 0)
        player.persistentData.putInt('automaton_rush_ticks', 0)
        for (var cs = 0; cs < RUSH_TRAIL_SLOTS; cs++) player.persistentData.putInt('automaton_ta' + cs, 0)
        player.tags.remove('automaton_lost_pending')
        player.tags.remove('automaton_owner')
        player.tags.remove('automaton_stalled')
        return
    }

    if (!player.tags.contains('automaton_owner')) return

    if (player.persistentData.getInt('automaton_bossbar_active') < 1) {
        createBossbar(player)
    }

    var rushTicks = player.persistentData.getInt('automaton_rush_ticks')
    if (rushTicks > 0) {
        var newRushTicks = rushTicks - 1
        player.persistentData.putInt('automaton_rush_ticks', newRushTicks)
        if (newRushTicks === 0) {
            var srv = player.level.getServer()
            srv.runCommandSilent('effect clear ' + player.username + ' minecraft:speed')
            srv.runCommandSilent('effect clear ' + player.username + ' ars_elemental:static_charged')
            for (var cs = 0; cs < RUSH_TRAIL_SLOTS; cs++) player.persistentData.putInt('automaton_ta' + cs, 0)
        }
        spawnDust(player.level, player.x + (Math.random()-0.5)*0.6, player.y + Math.random()*1.8, player.z + (Math.random()-0.5)*0.6, 0.3, 0.7, 1.0, 0.5)
        spawnDust(player.level, player.x + (Math.random()-0.5)*0.6, player.y + Math.random()*1.8, player.z + (Math.random()-0.5)*0.6, 0.5, 0.9, 1.0, 0.4)
        try {
            player.level.sendParticles(
                Java.loadClass('net.minecraft.core.particles.ParticleTypes').ELECTRIC_SPARK,
                player.x, player.y + 0.9, player.z, 2, 0.3, 0.5, 0.3, 0.02)
        } catch(e) {}
        if (rushTicks % RUSH_TRAIL_INTERVAL === 0) {
            var slot = Math.floor((RUSH_DURATION - rushTicks) / RUSH_TRAIL_INTERVAL) % RUSH_TRAIL_SLOTS
            var pd = player.persistentData
            pd.putDouble('automaton_tx' + slot, player.x)
            pd.putDouble('automaton_ty' + slot, player.y)
            pd.putDouble('automaton_tz' + slot, player.z)
            pd.putInt('automaton_ta' + slot, 1)
            player.level.getServer().runCommandSilent('summon minecraft:area_effect_cloud ' + player.x + ' ' + player.y + ' ' + player.z + ' {Radius:1.2f,WaitTime:0,Duration:50}')
            for (var s = 0; s < RUSH_TRAIL_SLOTS; s++) {
                if (pd.getInt('automaton_ta' + s) !== 1) continue
                var tx = pd.getDouble('automaton_tx' + s)
                var ty = pd.getDouble('automaton_ty' + s)
                var tz = pd.getDouble('automaton_tz' + s)
                player.level.getServer().runCommandSilent('execute positioned ' + tx + ' ' + ty + ' ' + tz + ' as @e[type=!minecraft:player,distance=..2] run effect give @s ars_elemental:static_charged 5 0 false')
            }
        }
    }

    if (player.level.time % MOMENTUM_INTERVAL !== 0) return

    var wasStalled = player.tags.contains('automaton_stalled')
    var moved = hasMoved(player)
    var nearRPM = getNearbyRPM(player)
    var momentum = getMomentum(player)

    var rpmGain = nearRPM > 0 ? Math.min(MOMENTUM_GAIN_MAX, Math.ceil(nearRPM / RPM_TIER_SIZE)) : 0
    var moveGain = moved ? MOMENTUM_GAIN_MAX : 0
    var gain = Math.max(moveGain, rpmGain)

    if (gain > 0) {
        momentum = Math.min(MOMENTUM_MAX, momentum + gain)
    } else {
        momentum = Math.max(0, momentum - MOMENTUM_DRAIN)
    }

    setMomentum(player, momentum)
    updateBossbar(player, momentum)

    if (momentum === 0) {
        player.tags.add('automaton_stalled')
        player.level.getServer().runCommandSilent('effect give ' + player.username + ' minecraft:slowness ' + STALL_EFFECT_DURATION + ' 1 true')
        player.level.getServer().runCommandSilent('playsound create:steam block ' + player.username + ' ' + player.x + ' ' + player.y + ' ' + player.z + ' 0.8 0.8')
        player.level.getServer().runCommandSilent('particle minecraft:large_smoke ' + player.x + ' ' + (player.y + 1.0) + ' ' + player.z + ' 0.3 0.5 0.3 0.01 ' + STALL_PARTICLE_COUNT)
    } else if (wasStalled) {
        player.tags.remove('automaton_stalled')
        player.level.getServer().runCommandSilent('playsound create:cogs block ' + player.username + ' ' + player.x + ' ' + player.y + ' ' + player.z + ' 0.7 1.2')
    }

    if (momentum > MOMENTUM_SPEED_THRESHOLD) {
        player.level.getServer().runCommandSilent('effect give ' + player.username + ' minecraft:speed ' + SPEED_EFFECT_DURATION + ' 0 true')
    }
})

NeoOriginsEvents.powerActivated(function(event) {
    if (String(event.getPowerId()) !== 'cat-astrophe:automaton_grapple') return
    var player = event.getPlayer()
    var srv = player.level.getServer()
    srv.runCommandSilent('effect give ' + player.username + ' minecraft:speed ' + RUSH_DURATION + ' 3 false')
    srv.runCommandSilent('effect give ' + player.username + ' ars_elemental:static_charged ' + RUSH_DURATION + ' 0 false')
    player.persistentData.putInt('automaton_rush_ticks', RUSH_DURATION)
    srv.runCommandSilent('playsound create:cogs block ' + player.username + ' ' + player.x + ' ' + player.y + ' ' + player.z + ' 1.0 1.6')
    srv.runCommandSilent('particle minecraft:electric_spark ' + player.x + ' ' + (player.y + 1.0) + ' ' + player.z + ' 0.4 0.6 0.4 0.1 30')
})

BlockEvents.rightClicked(function(event) {
    if (String(event.hand) !== 'MAIN_HAND') return
    var player = event.player
    if (!player || !player.tags.contains('automaton_owner')) return
    if (!player.isCrouching()) return

    var block = event.block
    var id = String(block.id)
    var colon = id.indexOf(':')
    var namespace = colon !== -1 ? id.substring(0, colon) : 'minecraft'
    var path = colon !== -1 ? id.substring(colon + 1) : id
    var bx = Math.floor(block.x)
    var by = Math.floor(block.y)
    var bz = Math.floor(block.z)

    if (player.mainHandItem.isEmpty() && (path.indexOf('_log') !== -1 || path.indexOf('_wood') !== -1) && path.indexOf('stripped_') !== 0) {
        var strippedId = namespace + ':stripped_' + path
        var axis = 'y'
        try {
            var axisVal = String(block.properties['axis'])
            if (axisVal !== 'null' && axisVal !== 'undefined') axis = axisVal
        } catch(e) {}
        player.level.getServer().runCommandSilent('setblock ' + bx + ' ' + by + ' ' + bz + ' ' + strippedId + '[axis=' + axis + ']')
        player.level.getServer().runCommandSilent('playsound minecraft:item.axe.strip block ' + player.username + ' ' + bx + ' ' + by + ' ' + bz + ' 1.0 1.0')
        return
    }

    if (player.mainHandItem.isEmpty()) {
        var crumbleResult = null
        if (id === 'minecraft:stone') crumbleResult = 'minecraft:cobblestone'
        else if (id === 'minecraft:cobblestone') crumbleResult = 'minecraft:gravel'
        if (crumbleResult) {
            player.level.getServer().runCommandSilent('setblock ' + bx + ' ' + by + ' ' + bz + ' ' + crumbleResult)
            player.level.getServer().runCommandSilent('playsound minecraft:block.stone.break block ' + player.username + ' ' + bx + ' ' + by + ' ' + bz + ' 1.0 1.0')
        }
    }
})
