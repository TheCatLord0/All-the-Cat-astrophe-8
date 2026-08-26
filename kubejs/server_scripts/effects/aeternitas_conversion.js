(function () {
  const COOLDOWN_TICKS = 5 * 20
  const EFFECT_DURATION = 2147483647
  const ARS_MANA_PER_HEALTH_POINT = 10
  const IRONS_MANA_PER_HEALTH_POINT = 10

  const Component = Java.loadClass('net.minecraft.network.chat.Component')
  const MobEffectInstance = Java.loadClass('net.minecraft.world.effect.MobEffectInstance')
  const ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
  const ResourceKey = Java.loadClass('net.minecraft.resources.ResourceKey')
  const Registries = Java.loadClass('net.minecraft.core.registries.Registries')
  const BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
  const EventPriority = Java.loadClass('net.neoforged.bus.api.EventPriority')
  const CuriosApi = Java.loadClass('top.theillusivec4.curios.api.CuriosApi')
  const ArsManaCap = Java.loadClass('com.hollingsworth.arsnouveau.common.capability.ManaCap')
  const IronMagicData = Java.loadClass('io.redspace.ironsspellbooks.api.magic.MagicData')
  const IronSyncManaPacket = Java.loadClass('io.redspace.ironsspellbooks.network.SyncManaPacket')
  const PacketDistributor = Java.loadClass('net.neoforged.neoforge.network.PacketDistributor')

  const CHANNEL = 'aeternitas_conversion'
  const ITEM_ID = 'kubejs:aeternitas_control'
  const EFFECT_ID = 'kubejs:aeternitas_conversion'
  const COOLDOWN_KEY = 'aeternitas_conversion_cooldown_ticks_left'
  const ACTIVE_KEY = 'aeternitas_conversion_active'

  const AETERNITAS_EFFECT = BuiltInRegistries.MOB_EFFECT.getHolderOrThrow(
    ResourceKey.create(
      Registries.MOB_EFFECT,
      ResourceLocation.parse(EFFECT_ID)
    )
  )

  function getData(player) {
    return player.persistentData || player.getPersistentData()
  }

  function actionBar(player, message) {
    player.displayClientMessage(Component.literal(message), true)
  }

  function getPacketPlayer(event) {
    return event.player || event.entity || null
  }

  function forEachPlayer(server, callback) {
    try {
      var iterator = server.getPlayerList().getPlayers().iterator()

      while (iterator.hasNext()) {
        callback(iterator.next())
      }
    } catch (error) {
      console.error('[aeternitas_conversion] Player loop failed: ' + error)
    }
  }

  function isEquipped(player) {
    try {
      var optional = CuriosApi.getCuriosInventory(player)

      if (optional == null || !optional.isPresent()) {
        return false
      }

      var iterator = optional.get().getCurios().entrySet().iterator()

      while (iterator.hasNext()) {
        var stacks = iterator.next().getValue().getStacks()

        for (var slot = 0; slot < stacks.getSlots(); slot++) {
          var stack = stacks.getStackInSlot(slot)

          if (!stack || stack.isEmpty()) {
            continue
          }

          var id = String(BuiltInRegistries.ITEM.getKey(stack.getItem()))

          if (id === ITEM_ID) {
            return true
          }
        }
      }
    } catch (error) {
      console.error('[aeternitas_conversion] Curios check failed: ' + error)
    }

    return false
  }

  function enable(player) {
    player.addEffect(
      new MobEffectInstance(
        AETERNITAS_EFFECT,
        EFFECT_DURATION,
        0,
        false,
        true,
        true
      )
    )

    getData(player).putBoolean(ACTIVE_KEY, true)
  }

  function disable(player) {
    player.removeEffect(AETERNITAS_EFFECT)
    getData(player).putBoolean(ACTIVE_KEY, false)
  }

  function syncIronMana(player, magicData) {
    PacketDistributor.sendToPlayer(
      player,
      new IronSyncManaPacket(magicData)
    )
  }

  function giveMana(player, health) {
    var arsAmount = health * ARS_MANA_PER_HEALTH_POINT
    var ironAmount = health * IRONS_MANA_PER_HEALTH_POINT
    var arsCap = null
    var ironData = null
    var oldArsMana = 0
    var oldIronMana = 0

    try {
      arsCap = new ArsManaCap(player)
      ironData = IronMagicData.getPlayerMagicData(player)

      oldArsMana = arsCap.getCurrentMana()
      oldIronMana = ironData.getMana()

      arsCap.addMana(arsAmount)
      arsCap.syncToClient(player)

      ironData.addMana(ironAmount)
      syncIronMana(player, ironData)
    } catch (error) {
      console.error('[aeternitas_conversion] Mana conversion failed: ' + error)

      try {
        if (arsCap != null) {
          arsCap.setMana(oldArsMana)
          arsCap.syncToClient(player)
        }
      } catch (rollbackError) {
        console.error('[aeternitas_conversion] Ars rollback failed: ' + rollbackError)
      }

      try {
        if (ironData != null) {
          ironData.setMana(oldIronMana)
          syncIronMana(player, ironData)
        }
      } catch (rollbackError) {
        console.error('[aeternitas_conversion] Iron rollback failed: ' + rollbackError)
      }
    }
  }

  ServerEvents.tick(function (event) {
    forEachPlayer(event.server, function (player) {
      var data = getData(player)
      var cooldown = data.getInt(COOLDOWN_KEY)

      if (cooldown > 0) {
        data.putInt(COOLDOWN_KEY, cooldown - 1)
      }

      if (data.getBoolean(ACTIVE_KEY) && !isEquipped(player)) {
        disable(player)
      }
    })
  })

  NetworkEvents.dataReceived(CHANNEL, function (event) {
    var player = getPacketPlayer(event)

    if (!player) {
      return
    }

    if (!isEquipped(player)) {
      disable(player)
      actionBar(player, 'Aeternitas Conversion is not equipped.')
      return
    }

    var data = getData(player)
    var cooldown = data.getInt(COOLDOWN_KEY)

    if (cooldown > 0) {
      actionBar(
        player,
        'Aeternitas Conversion cooling down: ' +
          Math.ceil(cooldown / 20) +
          's'
      )

      return
    }

    data.putInt(COOLDOWN_KEY, COOLDOWN_TICKS)

    if (data.getBoolean(ACTIVE_KEY)) {
      disable(player)
      actionBar(player, 'Aeternitas Conversion: OFF')
    } else {
      enable(player)
      actionBar(player, 'Aeternitas Conversion: ON')
    }
  })

  NativeEvents.onEvent(
    EventPriority.LOWEST,
    'net.neoforged.neoforge.event.entity.living.LivingHealEvent',
    function (event) {
      var player = event.getEntity()
      var data = getData(player)

      if (!data.getBoolean(ACTIVE_KEY)) {
        return
      }

      if (!isEquipped(player)) {
        disable(player)
        return
      }

      var healing = event.getAmount()

      if (healing <= 0) {
        return
      }

      var missingHealth = Math.max(
        0,
        player.getMaxHealth() - player.getHealth()
      )

      var convertedHealth = Math.min(healing, missingHealth)

      event.setAmount(0)
      event.setCanceled(true)

      if (convertedHealth > 0) {
        giveMana(player, convertedHealth)
      }
    }
  )
})()