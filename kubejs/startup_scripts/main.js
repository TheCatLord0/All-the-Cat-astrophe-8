import { effect } from "@package/net/minecraft/world"

const $MobEffectInstance = Java.loadClass('net.minecraft.world.effect.MobEffectInstance')

ItemEvents.modification(event => {
  event.modify("ars_nouveau:mendosteen_pod", item => {
    item.setFood({
        nutrition: 2,
        saturation: 0.4,
        eatSeconds: 1.6,
        canAlwaysEat: true,
        effects: [
        {
          probability: 1,
          effectSupplier: () =>
            new $MobEffectInstance(
              /* Effect:         */ "ars_nouveau:recovery",
              /* Duration:       */ 60 * 20,
              /* Level:          */ 0,
              /* Is ambient:     */ false,
              /* Hide particles: */ true
            )
        }
      ]
    })
  })
  event.modify("ars_nouveau:frostaya_pod", item => {
    item.setFood({
        nutrition: 2,
        saturation: 0.4,
        eatSeconds: 1.6,
        canAlwaysEat: true,
        effects: [
        {
          probability: 1,
          effectSupplier: () =>
            new $MobEffectInstance(
              /* Effect:         */ "ars_nouveau:freezing",
              /* Duration:       */ 30 * 20,
              /* Level:          */ 0,
              /* Is ambient:     */ false,
              /* Hide particles: */ true
            )
        }
      ]
    })
  })
  event.modify("ars_nouveau:bastion_pod", item => {
    item.setFood({
        nutrition: 2,
        saturation: 0.4,
        eatSeconds: 1.6,
        canAlwaysEat: true,
        effects: [
        {
          probability: 1,
          effectSupplier: () =>
            new $MobEffectInstance(
              /* Effect:         */ "ars_nouveau:shielding",
              /* Duration:       */ 60 * 20,
              /* Level:          */ 0,
              /* Is ambient:     */ false,
              /* Hide particles: */ true
            )
        }
      ]
    })
  })
  event.modify("ars_nouveau:bombegranate_pod", item => {
    item.setFood({
        nutrition: 2,
        saturation: 0.4,
        eatSeconds: 1.6,
        canAlwaysEat: true,
        effects: [
        {
          probability: 1,
          effectSupplier: () =>
            new $MobEffectInstance(
              /* Effect:         */ "ars_nouveau:blasting",
              /* Duration:       */ 10 * 20,
              /* Level:          */ 0,
              /* Is ambient:     */ false,
              /* Hide particles: */ true
            )
        }
      ]
    })
  })
  event.modify("ars_elemental:flashpine_pod", item => {
    item.setFood({
        nutrition: 2,
        saturation: 0.4,
        eatSeconds: 1.6,
        canAlwaysEat: true,
        effects: [
        {
          probability: 1,
          effectSupplier: () =>
            new $MobEffectInstance(
              /* Effect:         */ "minecraft:night_vision",
              /* Duration:       */ 30 * 20,
              /* Level:          */ 0,
              /* Is ambient:     */ false,
              /* Hide particles: */ true
            )
        },
        {
          probability: 1,
          effectSupplier: () =>
            new $MobEffectInstance(
              /* Effect:         */ "minecraft:glowing",
              /* Duration:       */ 30 * 20,
              /* Level:          */ 0,
              /* Is ambient:     */ false,
              /* Hide particles: */ true
            )
        },
        {
          probability: 1,
          effectSupplier: () =>
            new $MobEffectInstance(
              /* Effect:         */ "ars_nouveau:shocked",
              /* Duration:       */ 30 * 20,
              /* Level:          */ 0,
              /* Is ambient:     */ false,
              /* Hide particles: */ true
            )
        },
        {
          probability: 1,
          effectSupplier: () =>
            new $MobEffectInstance(
              /* Effect:         */ "ars_elemental:static_charged",
              /* Duration:       */ 30 * 20,
              /* Level:          */ 0,
              /* Is ambient:     */ false,
              /* Hide particles: */ true
            )
        }
      ]
    })
  })
  event.modify("create:blaze_cake", item => {
    item.setFood({
        nutrition: 8,
        saturation: 8.0,
        eatSeconds: 1.6,
        canAlwaysEat: true,
        effects: [
        {
          probability: 1,
          effectSupplier: () =>
            new $MobEffectInstance(
              /* Effect:         */ "ars_nouveau:blasting",
              /* Duration:       */ 10 * 20,
              /* Level:          */ 4,
              /* Is ambient:     */ false,
              /* Hide particles: */ true
            )
        }
      ]
    })
  })
})
