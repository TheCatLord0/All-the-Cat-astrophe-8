// Configuration

// Mimicry
const MIMICRY_HEAL = 0.25
// Tibia
const CORPUS_DURATION = 8 * 20
const CORPUS_MAX_AMPLIFIER = 9
// The First Blade
const FIRST_BLADE_MULTIPLY = 5.33333333333
const FIRST_BLADE_DRAWBACK = 0.33

// Actual code
const CuriosCheck = Java.loadClass('top.theillusivec4.curios.api.CuriosApi')

function getEquippedCurios(player) {
  const optional = CuriosCheck.getCuriosInventory(player)

  if (!optional.isPresent()) {
    return []
  }

  const curiosInventory = optional.get()
  const curios = curiosInventory.getCurios()
  const equipped = []

  curios.entrySet().forEach(entry => {
    const slotType = entry.getKey()
    const handler = entry.getValue()
    const stacks = handler.getStacks()

    for (let i = 0; i < stacks.getSlots(); i++) {
      const stack = stacks.getStackInSlot(i)

      if (!stack.isEmpty()) {
        equipped.push({
          slot: slotType,
          index: i,
          id: stack.id,
          count: stack.count
        })
      }
    }
  })

  return equipped
}

function hasEquippedCurio(player, itemId) {
  return getEquippedCurios(player).some(curio => curio.id === itemId)
}

ServerEvents.commandRegistry(event => {
  const { commands: Commands } = event

  event.register(
    Commands.literal('curios_dump')
      .executes(ctx => {
        const player = ctx.source.playerOrException
        const equipped = getEquippedCurios(player)

        if (equipped.length === 0) {
          player.tell('No curios equipped.')
          return 1
        }

        player.tell('Equipped Curios:')

        equipped.forEach(curio => {
          player.tell(`${curio.slot}[${curio.index}] = ${curio.id} x${curio.count}`)
        })

        return 1
      })
  )
})
ServerEvents.recipes(event => {
event.smithing(
 Item.of('kubejs:ego_mimicry[minecraft:unbreakable={show_in_tooltip:false}]'),
  'minecraft:netherite_upgrade_smithing_template',
  'kubejs:mimicry',
  '#thecatlord:dragonsteel'
)
})
// Funny One Shot
EntityEvents.afterHurt(event => {
    const { entity, source, server } = event
    let attackingEntity = source.actual
    if (!attackingEntity) return
    if (attackingEntity.mainHandItem.id != 'kubejs:executioner') return
    let pitch = 0.9 + Math.random() * 0.2
    server.runCommandSilent(
    `execute positioned ${entity.x} ${entity.y} ${entity.z} run playsound ${'kubejs:item.die'} master @a[distance=..32] ~ ~ ~ 1 ${pitch}`
    )
    entity.kill()
})
EntityEvents.afterHurt(event => {
    if (event.source.player) {
        let player = event.source.player
        let weapon = player.getMainHandItem()
        if (weapon.id === 'kubejs:mimicry') {
            let damageDealt = event.damage
            let healAmount = damageDealt * MIMICRY_HEAL
            player.heal(healAmount)
        }
    }
})
EntityEvents.afterHurt(event => {
    if (event.source.player) {
        let player = event.source.player
        let weapon = player.getMainHandItem()
        if (weapon.id === 'kubejs:ego_mimicry') {
            let damageDealt = event.damage
            let healAmount = damageDealt * MIMICRY_HEAL
            player.heal(healAmount)
        }
    }
})
    const CORPUS_WEAPONS = [
        'kubejs:tibia',
        'kubejs:callisto_tibia'
    ]

    const CORPUS_EFFECT = 'kubejs:corpus'

    EntityEvents.afterHurt(event => {
        const { entity, source } = event

        let attackingEntity = source.actual
        if (!attackingEntity) return

        let heldItem = String(attackingEntity.mainHandItem.id)

        if (!CORPUS_WEAPONS.includes(heldItem)) return

        let active = entity.potionEffects.getActive(CORPUS_EFFECT)

        let currentAmp = active == null ? -1 : active.amplifier
        let nextAmp = Math.min(currentAmp + 1, CORPUS_MAX_AMPLIFIER)

        entity.potionEffects.add(CORPUS_EFFECT, CORPUS_DURATION, nextAmp, false, true)
})
    const PM_SOUND_WEAPONS = [
        'kubejs:tibia',
        'kubejs:callisto_tibia',
        "kubejs:fixer_scythe",
        "kubejs:upgraded_fixer_scythe",
        "kubejs:mimicry",
        "kubejs:ego_mimicry"
    ]

    const PM_HIT_SOUND = 'kubejs:item.project_moon_hit'

    EntityEvents.afterHurt(event => {
        const { entity, source, server } = event

        let attackingEntity = source.actual
        if (!attackingEntity) return

        let heldItem = String(attackingEntity.mainHandItem.id)

        if (PM_SOUND_WEAPONS.indexOf(heldItem) == -1) return

        let pitch = 0.9 + Math.random() * 0.2

        server.runCommandSilent(
            `execute positioned ${entity.x} ${entity.y} ${entity.z} run playsound ${PM_HIT_SOUND} master @a[distance=..12] ~ ~ ~ 1 ${pitch}`
        )
})
EntityEvents.beforeHurt(event => {
  const player = event.source.player
  if (!player) return
  const health = player.getMaxHealth()
  if (!hasEquippedCurio(player, 'kubejs:mark_of_cain')) return
  const weapon = player.mainHandItem
        if (weapon.id === 'kubejs:first_blade') {
            event.setDamage(event.damage * FIRST_BLADE_MULTIPLY)
            player.damage(health * FIRST_BLADE_DRAWBACK)
        }
})