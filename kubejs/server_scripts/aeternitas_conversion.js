(function () {
  // Configuration

  const COOLDOWN_TICKS = 5 * 20
  const EFFECT_DURATION = 2147483647

  const ARS_MANA_PER_HEALTH_POINT = 10
  const IRONS_MANA_PER_HEALTH_POINT = 10

  // Actual code
  const Component = Java.loadClass('net.minecraft.network.chat.Component')
  const MobEffectInstance = Java.loadClass('net.minecraft.world.effect.MobEffectInstance')

  const ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
  const ResourceKey = Java.loadClass('net.minecraft.resources.ResourceKey')
  const Registries = Java.loadClass('net.minecraft.core.registries.Registries')
  const BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')

  const ServerPlayer = Java.loadClass('net.minecraft.server.level.ServerPlayer')

  const CuriosApi = Java.loadClass('top.theillusivec4.curios.api.CuriosApi')

  // Ars Nouveau mana
  const ArsManaCap = Java.loadClass('com.hollingsworth.arsnouveau.common.capability.ManaCap')

  // Iron's Spells mana
  const IronMagicData = Java.loadClass('io.redspace.ironsspellbooks.api.magic.MagicData')
  const IronSyncManaPacket = Java.loadClass('io.redspace.ironsspellbooks.network.SyncManaPacket')
  const PacketDistributor = Java.loadClass('net.neoforged.neoforge.network.PacketDistributor')

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

  function getPersistentData(targetPlayer) {
    if (targetPlayer.persistentData) {
      return targetPlayer.persistentData
    }

    return targetPlayer.getPersistentData()
  }

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
  function isServerPlayer(entity) {
    return entity != null && entity instanceof ServerPlayer
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
    getPersistentData(targetPlayer).putBoolean(ACTIVE_KEY, false)
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
    getPersistentData(targetPlayer).putBoolean(ACTIVE_KEY, true)
  }
  function syncIronMana(targetPlayer, ironMagicData) {
    PacketDistributor.sendToPlayer(
      targetPlayer,
      new IronSyncManaPacket(ironMagicData)
    )
  }

  function giveAeternitasMana(targetPlayer, healthPointsToConvert) {
    var arsManaToAdd = healthPointsToConvert * ARS_MANA_PER_HEALTH_POINT
    var ironsManaToAdd = healthPointsToConvert * IRONS_MANA_PER_HEALTH_POINT

    var arsCap = null
    var ironMagicData = null

    var oldArsMana = 0
    var oldIronMana = 0

    try {
      arsCap = new ArsManaCap(targetPlayer)
      oldArsMana = arsCap.getCurrentMana()

      ironMagicData = IronMagicData.getPlayerMagicData(targetPlayer)
      oldIronMana = ironMagicData.getMana()

      arsCap.addMana(arsManaToAdd)
      arsCap.syncToClient(targetPlayer)

      ironMagicData.addMana(ironsManaToAdd)
      syncIronMana(targetPlayer, ironMagicData)

      return true
    } catch (error) {
      console.error('[aeternitas_conversion] Mana conversion failed: ' + error)
      try {
        if (arsCap != null) {
          arsCap.setMana(oldArsMana)
          arsCap.syncToClient(targetPlayer)
        }
      } catch (rollbackArsError) {
        console.error('[aeternitas_conversion] Ars rollback failed: ' + rollbackArsError)
      }
      try {
        if (ironMagicData != null) {
          ironMagicData.setMana(oldIronMana)
          syncIronMana(targetPlayer, ironMagicData)
        }
      } catch (rollbackIronError) {
        console.error('[aeternitas_conversion] Iron rollback failed: ' + rollbackIronError)
      }

      return false
    }
  }
  ServerEvents.tick(function (tickEvent) {
    forEachServerPlayer(tickEvent.server, function (serverPlayer) {
      var data = getPersistentData(serverPlayer)
      var cooldownTicksLeft = data.getInt(COOLDOWN_TICKS_LEFT_NBT)

      if (cooldownTicksLeft > 0) {
        data.putInt(COOLDOWN_TICKS_LEFT_NBT, cooldownTicksLeft - 1)
      }
      if (
        data.getBoolean(ACTIVE_KEY) &&
        serverPlayer.hasEffect(AETERNITAS_EFFECT) &&
        !hasAeternitasConversionEquipped(serverPlayer)
      ) {
        disableAeternitasConversion(serverPlayer)
      }
    })
  })
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
    var data = getPersistentData(targetPlayer)
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
  NativeEvents.onEvent('net.neoforged.neoforge.event.entity.living.LivingHealEvent', function (healEvent) {
    var targetEntity = healEvent.getEntity()
    if (!isServerPlayer(targetEntity)) {
      return
    }
    var targetPlayer = targetEntity
    var data = getPersistentData(targetPlayer)
    if (!targetPlayer.hasEffect(AETERNITAS_EFFECT)) {
      data.putBoolean(ACTIVE_KEY, false)
      return
    }
    if (!hasAeternitasConversionEquipped(targetPlayer)) {
      disableAeternitasConversion(targetPlayer)
      return
    }
    var attemptedHealing = healEvent.getAmount()
    if (attemptedHealing <= 0) {
      return
    }
    var missingHealth = targetPlayer.getMaxHealth() - targetPlayer.getHealth()
    var healthPointsToConvert = Math.min(attemptedHealing, missingHealth)
    if (healthPointsToConvert <= 0) {
      healEvent.setCanceled(true)
      return
    }
    if (!giveAeternitasMana(targetPlayer, healthPointsToConvert)) {
      return
    }
    healEvent.setCanceled(true)
  })
})()