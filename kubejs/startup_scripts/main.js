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
StartupEvents.registry('fluid', event => {
  event.create('enkephalin')
    .displayName('Enkephalin')
    .type(type => type
      .renderType(3)
      .stillTexture('thecatlord:block/enkephalin_still')
      .flowingTexture('thecatlord:block/enkephalin_flowing')
      .fallDistanceModifier(0)
      .canSwim(false)
      .canDrown(true)
    )
    .tickRate('10')
    .levelDecreasePerBlock('2')
})
StartupEvents.registry('item', (event) => {
    event.create('craft_first_blade', 'occultism:ritual_dummy')
        .pentacleType("craft")
        .displayName('Ritual: Craft The First Blade')
        .ritualTooltip('The blade used by the first murderer.')
    event.create('craft_the_mark', 'occultism:ritual_dummy')
        .pentacleType("craft")
        .displayName('Ritual: Conjure The Mark Of Cain')
        .ritualTooltip('There is no resisting the Mark or the Blade, there is only remission and relapse.')
    event.create('remove_the_mark', 'occultism:ritual_dummy')
        .pentacleType("craft")
        .displayName('Ritual: Break the Curse of the Mark')
        .ritualTooltip('Removing it however releases a far greater evil...')
})
