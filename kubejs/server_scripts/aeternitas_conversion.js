(function () {
// Configuration

  const COOLDOWN_TICKS = 5 * 20
  const EFFECT_DURATION = 2147483647

// Actual code
  const Component = Java.loadClass('net.minecraft.network.chat.Component')
  const MobEffectInstance = Java.loadClass('net.minecraft.world.effect.MobEffectInstance')

  const ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
  const ResourceKey = Java.loadClass('net.minecraft.resources.ResourceKey')
  const Registries = Java.loadClass('net.minecraft.core.registries.Registries')
  const BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')

  const CuriosApi = Java.loadClass('top.theillusivec4.curios.api.CuriosApi')

  const CHANNEL = 'aeternitas_conversion'

  const AETERNITAS_CONVERSION_ITEM_ID = 'kubejs:aeternitas_control'

  const AETERNITAS_CONVERSION_EFFECT_ID = 'kubejs:aeternitas_conversion'

  const COOLDOWN_TICKS_LEFT_NBT = 'aeternitas_conversion_cooldown_ticks_left'
  const ACTIVE_KEY = 'aeternitas_conversion_active'

  const AETERNITAS_EFFECT = BuiltInRegistries.MOB_EFFECT.getHolderOrThrow(
    ResourceKey.create(
      Registries.MOB_EFFECT,
      ResourceLocation.parse(AETERNITAS_CONVERSION_EFFECT_ID)
    )
  )

  function actionBar(targetPlayer, message) {
    targetPlayer.displayClientMessage(Component.literal(message), true)
  }

  function getPacketPlayer(networkEvent) {
    if (networkEvent.player) {
      return networkEvent.player
    }

    if (networkEvent.entity) {
      return networkEvent.entity
    }

    return null
  }

  function forEachServerPlayer(server, callback) {
    try {
      var serverPlayers = server.getPlayerList().getPlayers()
      var serverPlayerIterator = serverPlayers.iterator()

      while (serverPlayerIterator.hasNext()) {
        callback(serverPlayerIterator.next())
      }
    } catch (error) {
      console.error('[aeternitas_conversion] Server player loop failed: ' + error)
    }
  }

  ServerEvents.tick(function (tickEvent) {
    forEachServerPlayer(tickEvent.server, function (serverPlayer) {
      var data = serverPlayer.persistentData
      var cooldownTicksLeft = data.getInt(COOLDOWN_TICKS_LEFT_NBT)

      if (cooldownTicksLeft > 0) {
        data.putInt(COOLDOWN_TICKS_LEFT_NBT, cooldownTicksLeft - 1)
      }
    })
  })

  function hasAeternitasConversionEquipped(targetPlayer) {
    try {
      var curiosOptional = CuriosApi.getCuriosInventory(targetPlayer)

      if (curiosOptional == null || !curiosOptional.isPresent()) {
        return false
      }

      var curiosInventory = curiosOptional.get()
      var curiosMap = curiosInventory.getCurios()
      var curiosIterator = curiosMap.entrySet().iterator()

      while (curiosIterator.hasNext()) {
        var curiosEntry = curiosIterator.next()
        var curiosHandler = curiosEntry.getValue()
        var curiosStacks = curiosHandler.getStacks()
        var curiosSlotCount = curiosStacks.getSlots()

        for (var slotIndex = 0; slotIndex < curiosSlotCount; slotIndex++) {
          var curiosStack = curiosStacks.getStackInSlot(slotIndex)

          if (!curiosStack || curiosStack.isEmpty()) {
            continue
          }

          var curiosStackId = String(BuiltInRegistries.ITEM.getKey(curiosStack.getItem()))

          if (curiosStackId === AETERNITAS_CONVERSION_ITEM_ID) {
            return true
          }
        }
      }
    } catch (error) {
      console.error('[aeternitas_conversion] Curios equipped check failed: ' + error)
    }

    return false
  }

  function disableAeternitasConversion(targetPlayer) {
    targetPlayer.removeEffect(AETERNITAS_EFFECT)
    targetPlayer.persistentData.putBoolean(ACTIVE_KEY, false)
  }

  function enableAeternitasConversion(targetPlayer) {
    targetPlayer.addEffect(
      new MobEffectInstance(
        AETERNITAS_EFFECT,
        EFFECT_DURATION,
        0,
        false,
        true,
        true
      )
    )

    targetPlayer.persistentData.putBoolean(ACTIVE_KEY, true)
  }

  NetworkEvents.dataReceived(CHANNEL, function (networkEvent) {
    var targetPlayer = getPacketPlayer(networkEvent)

    if (!targetPlayer) {
      return
    }

    if (!hasAeternitasConversionEquipped(targetPlayer)) {
      disableAeternitasConversion(targetPlayer)
      actionBar(targetPlayer, 'Aeternitas Conversion is not equipped.')
      return
    }

    var data = targetPlayer.persistentData
    var cooldownTicksLeft = data.getInt(COOLDOWN_TICKS_LEFT_NBT)

    if (cooldownTicksLeft > 0) {
      var secondsLeft = Math.ceil(cooldownTicksLeft / 20)
      actionBar(targetPlayer, 'Aeternitas Conversion cooling down: ' + secondsLeft + 's')
      return
    }

    data.putInt(COOLDOWN_TICKS_LEFT_NBT, COOLDOWN_TICKS)

    if (targetPlayer.hasEffect(AETERNITAS_EFFECT)) {
      disableAeternitasConversion(targetPlayer)
      actionBar(targetPlayer, 'Aeternitas Conversion: OFF')
    } else {
      enableAeternitasConversion(targetPlayer)
      actionBar(targetPlayer, 'Aeternitas Conversion: ON')
    }
  })
})()