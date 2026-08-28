const NO_REMOVAL = [
    'cataclysm:ghost_form',
    'cataclysm:ghost_sickness',
    'malum:wyrd_exhaustion'
]
const DISABLED_EFFECTS = [
    'spectrum:fatal_slumber',
    'ars_nouveau:snared'
]
const MOB_EFFECT_IMMUNITY_RULES = [
  {
    mobs: [
      'minecraft:zombie',
      'minecraft:husk',
      'minecraft:drowned'
    ],
    effects: [
      'minecraft:poison',
      'minecraft:hunger'
    ]
  },
  {
    mobs: [
      'minecraft:player'
    ],
    effects: [
      'ars_nouveau:snared'
    ]
  }
]

const DispelPre = Java.loadClass('com.hollingsworth.arsnouveau.api.event.DispelEvent$Pre')
const EntityHitResult = Java.loadClass('net.minecraft.world.phys.EntityHitResult')

NativeEvents.onEvent(DispelPre, event => {
  if (!(event.rayTraceResult instanceof EntityHitResult)) return
  const target = event.rayTraceResult.entity
  if (event.shooter instanceof Player && target instanceof Player) event.setCanceled(true)
})

const $BuiltInRegistries = Java.loadClass(
  'net.minecraft.core.registries.BuiltInRegistries'
)
const $MobEffectApplicableResult = Java.loadClass(
  'net.neoforged.neoforge.event.entity.living.MobEffectEvent$Applicable$Result'
)
const $MobEffectApplicable = Java.loadClass(
  'net.neoforged.neoforge.event.entity.living.MobEffectEvent$Applicable'
)
const $MobEffectRemove = Java.loadClass(
  'net.neoforged.neoforge.event.entity.living.MobEffectEvent$Remove'
)
const $EffectCures = Java.loadClass(
  'net.neoforged.neoforge.common.EffectCures'
)
NativeEvents.onEvent($MobEffectApplicable, event => {
  const effect = event.effectInstance

  if (!effect) return
  if (!NO_REMOVAL.some(effectId => effect.is(effectId))) return

  effect.cures.remove($EffectCures.MILK)
})
ServerEvents.tags('mob_effect', event => {
  event.add(
    'ars_nouveau:deny_dispel',
    NO_REMOVAL
  )
})
NativeEvents.onEvent($MobEffectApplicable, event => {
  const effect = event.getEffectInstance()
  if (!effect) return
  const isDisabled = DISABLED_EFFECTS.some(effectId =>
    effect.is(effectId)
  )
  if (!isDisabled) return
  event.setResult($MobEffectApplicableResult.DO_NOT_APPLY)
})
NativeEvents.onEvent($MobEffectApplicable, event => {
  const entity = event.getEntity()
  const effect = event.getEffectInstance()
  if (!entity || !effect) return
  const entityId = $BuiltInRegistries.ENTITY_TYPE
    .getKey(entity.getType())
    .toString()
  const isImmune = MOB_EFFECT_IMMUNITY_RULES.some(rule => {
    if (!rule.mobs.includes(entityId)) return false
    return (
      rule.effects.includes('*') ||
      rule.effects.some(effectId => effect.is(effectId))
    )
  })
  if (!isImmune) return
  event.setResult($MobEffectApplicableResult.DO_NOT_APPLY)
})
