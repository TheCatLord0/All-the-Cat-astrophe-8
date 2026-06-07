(function () {
  const AABBClass = Java.loadClass('net.minecraft.world.phys.AABB')
  const CuriosApi = Java.loadClass('top.theillusivec4.curios.api.CuriosApi')
  const BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')

  const CHANNEL = 'martyr_core_blast'
  const MARTYR_CORE_ID = 'kubejs:martyr_core'
  const COOLDOWN_TICKS_LEFT_NBT = 'martyr_core_cooldown_ticks_left'

  const COOLDOWN_TICKS = 60
  const RADIUS = 7.0
  const MAX_DAMAGE = 40.0
  const MIN_DAMAGE = 10.0

  ServerEvents.tick(event => {
    forEachServerPlayer(event.server, player => {
      const data = player.persistentData
      const cooldownTicksLeft = data.getInt(COOLDOWN_TICKS_LEFT_NBT)

      if (cooldownTicksLeft > 0) {
        data.putInt(COOLDOWN_TICKS_LEFT_NBT, cooldownTicksLeft - 1)
      }
    })
  })

  NetworkEvents.dataReceived(CHANNEL, event => {
    const player = getPacketPlayer(event)
    if (!player) return

    const data = player.persistentData
    const cooldownTicksLeft = data.getInt(COOLDOWN_TICKS_LEFT_NBT)

    if (cooldownTicksLeft > 0) {
      player.tell(`§7[Martyr Core] Cooldown: ${cooldownTicksLeft} ticks remaining.`)
      return
    }

    data.putInt(COOLDOWN_TICKS_LEFT_NBT, COOLDOWN_TICKS)
    doMartyrBlast(player)
  })

  function getPacketPlayer(event) {
    if (event.player) return event.player
    if (event.entity) return event.entity
    if (event.getEntity) return event.getEntity()
    return null
  }

  function forEachServerPlayer(server, callback) {
    const players = server.players

    try {
      players.forEach(player => callback(player))
      return
    } catch (error) {
    }

    const playerCount = players.size()

    for (let playerIndex = 0; playerIndex < playerCount; playerIndex++) {
      callback(players.get(playerIndex))
    }
  }

  function hasMartyrCoreEquipped(player) {
    try {
      var martyrCoreCuriosOptional = CuriosApi.getCuriosInventory(player)

      if (martyrCoreCuriosOptional == null || !martyrCoreCuriosOptional.isPresent()) {
        return false
      }

      var martyrCoreCuriosInventory = martyrCoreCuriosOptional.get()
      var martyrCoreCuriosMap = martyrCoreCuriosInventory.getCurios()
      var martyrCoreCuriosIterator = martyrCoreCuriosMap.entrySet().iterator()

      while (martyrCoreCuriosIterator.hasNext()) {
        var martyrCoreCuriosEntry = martyrCoreCuriosIterator.next()
        var martyrCoreCuriosHandler = martyrCoreCuriosEntry.getValue()
        var martyrCoreCuriosStacks = martyrCoreCuriosHandler.getStacks()
        var martyrCoreCuriosSlotCount = martyrCoreCuriosStacks.getSlots()

        for (var martyrCoreCuriosSlotIndex = 0; martyrCoreCuriosSlotIndex < martyrCoreCuriosSlotCount; martyrCoreCuriosSlotIndex++) {
          var martyrCoreCuriosStack = martyrCoreCuriosStacks.getStackInSlot(martyrCoreCuriosSlotIndex)

          if (!martyrCoreCuriosStack || martyrCoreCuriosStack.isEmpty()) {
            continue
          }

          var martyrCoreCuriosStackId = String(BuiltInRegistries.ITEM.getKey(martyrCoreCuriosStack.getItem()))

          if (martyrCoreCuriosStackId === MARTYR_CORE_ID) {
            return true
          }
        }
      }
    } catch (error) {
      console.error('[martyr_core] Curios equipped check failed: ' + error)
    }

    return false
  }

  function doMartyrBlast(player) {
    const level = player.level
    const x = player.x
    const y = player.y
    const z = player.z

    player.server.runCommandSilent(
      `execute as ${player.username} at @s run particle minecraft:explosion_emitter ~ ~1 ~ 0 0 0 0 1 force @a[distance=..64]`
    )

    player.server.runCommandSilent(
      `execute as ${player.username} at @s run playsound minecraft:entity.generic.explode master @a[distance=..64] ~ ~ ~ 4 1`
    )

    const box = new AABBClass(
      x - RADIUS, y - RADIUS, z - RADIUS,
      x + RADIUS, y + RADIUS, z + RADIUS
    )

    const damageSource = player.damageSources().explosion(player, player)

    damageEntityFromBlast(player, damageSource, x, y, z)

    for (const entity of level.getEntities(player, box)) {
      damageEntityFromBlast(entity, damageSource, x, y, z)
    }
  }

  function damageEntityFromBlast(entity, damageSource, x, y, z) {
    if (!entity) return
    if (!entity.isAlive()) return

    const dx = entity.x - x
    const dy = entity.y - y
    const dz = entity.z - z
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

    if (distance > RADIUS) return

    const falloff = 1.0 - distance / RADIUS
    const amount = MIN_DAMAGE + (MAX_DAMAGE - MIN_DAMAGE) * falloff

    if (amount <= 0) return

    entity.damage(amount, damageSource)
  }
})()