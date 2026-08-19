// Configuration

// Mimicry
const MIMICRY_HEAL = 0.25
// Tibia
const CORPUS_DURATION = 8 * 20
const CORPUS_MAX_AMPLIFIER = 9
// The First Blade
const FIRST_BLADE_MULTIPLY = 5.33333333333
const FIRST_BLADE_DRAWBACK = 0.33
// STOMPEEZ
const STOMPEEZ_ITEM = 'kubejs:stompeez'
const STOMPEEZ_BOOST = 2.0
const STOMPEEZ_VERTICAL_MULTIPLIER = 0.2
const STOMPEEZ_MAX_SPEED = 8.0
const STOMPEEZ_RECHARGE = 40
// Recipes
ServerEvents.recipes(event => {
 event.shaped(
        'kubejs:palindrome[unbreakable={show_in_tooltip:0b},enchantment_glint_override=false]',
    [
        'INI',
        'GDG',
        'INI'
    ],
    {
        I: 'minecraft:diamond',
        N: 'minecraft:netherite_ingot',
        G: 'minecraft:gold_ingot',
        D: 'minecraft:diamond_sword'
    }
  )
 event.shaped(
        'kubejs:debt[unbreakable={show_in_tooltip:0b},enchantment_glint_override=false]',
    [
        'INI',
        'GDG',
        ' B '
    ],
    {
        I: 'minecraft:iron_block',
        N: 'minecraft:netherite_ingot',
        G: 'minecraft:gold_block',
        D: 'minecraft:diamond_block',
        B: 'minecraft:blaze_rod'
    }
  )
})
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
{
    var $LivingDamagePre = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingDamageEvent$Pre')
    var WEAPON = 'kubejs:debt'
    var MAX_DEBT = 100
    var ARMED_TICKS = 200
    var DEBT = 'debt_amount'
    var ARMED = 'debt_armed_until'
    var DAY = 'debt_last_day'
    var getDebt = p => p.persistentData.getDouble(DEBT)
    var setDebt = (p, amount) => {
        p.persistentData.putDouble(DEBT, Math.min(MAX_DEBT, Math.max(0, amount)))
    }
    var disarm = p => {
        p.persistentData.remove(ARMED)
    }
    var clearDebt = p => {
        p.persistentData.remove(DEBT)
        p.persistentData.remove(ARMED)
        p.persistentData.remove(DAY)
    }
    var currentDay = p => {
        return Math.floor(p.level.getDayTime() / 24000)
    }
    var armed = p => {
        return p.persistentData.getInt(ARMED) > 0
    }
    ItemEvents.rightClicked(WEAPON, event => {
        var player = event.player
        if (event.hand.toString() !== 'MAIN_HAND') return
        if (getDebt(player) <= 0) return
        player.persistentData.putInt(ARMED, ARMED_TICKS)
    })
    NativeEvents.onEvent($LivingDamagePre, event => {
        var target = event.getEntity()
        var source = event.getSource()
        var attacker = source.actual
        var direct = source.immediate
        if (
            attacker &&
            attacker.isPlayer() &&
            direct === attacker &&
            attacker.mainHandItem.id === WEAPON
        ) {
            var damage = event.getNewDamage()
            if (damage <= 0) return
            var half = damage / 2
            if (armed(attacker)) {
                var stored = getDebt(attacker)
                event.setNewDamage(half + stored)
                setDebt(attacker, half)
                disarm(attacker)
            } else {
                event.setNewDamage(half)
                setDebt(attacker, getDebt(attacker) + half)
            }
            if (!attacker.persistentData.contains(DAY)) {
                attacker.persistentData.putLong(DAY, currentDay(attacker))
            }
            return
        }
        if (!target || !target.isPlayer()) return
        if (!armed(target)) return
        if (getDebt(target) <= 0) return
        if (!attacker || !direct) return
        if (direct !== attacker) return
        var damage = event.getNewDamage()
        if (damage <= 0) return
        event.setNewDamage(damage * (1 - getDebt(target) / 100))
        setDebt(target, 0)
        disarm(target)
    })
    PlayerEvents.tick(event => {
        var p = event.player
        var armedTicks = p.persistentData.getInt(ARMED)
        if (armedTicks > 0) {
            p.persistentData.putInt(ARMED, armedTicks - 1)
        }
        var debt = getDebt(p)
        if (debt <= 0) return
        var today = currentDay(p)
        if (!p.persistentData.contains(DAY)) {
            p.persistentData.putLong(DAY, today)
            return
        }
        var previous = p.persistentData.getLong(DAY)
        if (today <= previous) return
        setDebt(p, debt * Math.pow(1.5, today - previous))
        p.persistentData.putLong(DAY, today)
    })
    EntityEvents.death(event => {
        if (event.entity && event.entity.isPlayer()) {
            clearDebt(event.entity)
        }
    })
    PlayerEvents.loggedOut(event => {
        clearDebt(event.player)
    })
  }
(function () {
    var $StompeezVec3 = Java.loadClass('net.minecraft.world.phys.Vec3')
    var CHARGE_1 = 'stompeez_charge_1'
    var CHARGE_2 = 'stompeez_charge_2'
    NetworkEvents.dataReceived('stompeez_dash', event => {
        var player = event.player
        if (!hasEquippedCurio(player, STOMPEEZ_ITEM)) return
        var data = player.persistentData
        var charge
        if (data.getInt(CHARGE_1) <= 0) {
            charge = CHARGE_1
        } else if (data.getInt(CHARGE_2) <= 0) {
            charge = CHARGE_2
        } else {
            return
        }
        var motion = player.getDeltaMovement()
        var moveX = event.data.getDouble('moveX')
        var moveZ = event.data.getDouble('moveZ')
        var dirX
        var dirY
        var dirZ
        var groundInput = Math.sqrt(moveX * moveX + moveZ * moveZ)
        if (groundInput > 0.001) {
            dirX = moveX / groundInput
            dirZ = moveZ / groundInput
            if (player.onGround()) {
                dirY = 0
            } else {
                var verticalReference = Math.abs(motion.y)
                dirY = verticalReference > 0.001 ? Math.sign(motion.y) : 0
            }
        } else {
            var length = Math.sqrt(
                motion.x * motion.x +
                motion.y * motion.y +
                motion.z * motion.z
            )
            if (length < 0.001) return
            dirX = motion.x / length
            dirY = motion.y / length
            dirZ = motion.z / length
        }
        var newX = motion.x + dirX * STOMPEEZ_BOOST
        var newY = motion.y + dirY * STOMPEEZ_BOOST * STOMPEEZ_VERTICAL_MULTIPLIER
        var newZ = motion.z + dirZ * STOMPEEZ_BOOST
        var horizontalSpeed = Math.sqrt(
            newX * newX +
            newZ * newZ
        )
        if (horizontalSpeed > STOMPEEZ_MAX_SPEED) {
            var scale = STOMPEEZ_MAX_SPEED / horizontalSpeed
            newX *= scale
            newZ *= scale
        }
        player.setDeltaMovement(
            new $StompeezVec3(
                newX,
                newY,
                newZ
            )
        )
        player.hurtMarked = true
        data.putInt(charge, STOMPEEZ_RECHARGE)
    })
    PlayerEvents.tick(event => {
        var data = event.player.persistentData
        var charge1 = data.getInt(CHARGE_1)
        var charge2 = data.getInt(CHARGE_2)
        if (charge1 > 0) {
            data.putInt(CHARGE_1, charge1 - 1)
        }
        if (charge2 > 0) {
            data.putInt(CHARGE_2, charge2 - 1)
        }
    })
    PlayerEvents.loggedOut(event => {
        var data = event.player.persistentData
        data.remove(CHARGE_1)
        data.remove(CHARGE_2)
    })
})()
{
    var $LivingIncomingDamageEvent = Java.loadClass(
        'net.neoforged.neoforge.event.entity.living.LivingIncomingDamageEvent'
    )
    var WEAPON = 'kubejs:palindrome'
    var PHASE = 'palindrome_phase'
    var HIT_INDEX = 'palindrome_hit_index'
    var HIT_1 = 'palindrome_hit_1'
    var HIT_2 = 'palindrome_hit_2'
    var HIT_3 = 'palindrome_hit_3'
    var SLOT = 'palindrome_slot'
    var resetPalindrome = player => {
        player.persistentData.remove(PHASE)
        player.persistentData.remove(HIT_INDEX)
        player.persistentData.remove(HIT_1)
        player.persistentData.remove(HIT_2)
        player.persistentData.remove(HIT_3)
    }
    NativeEvents.onEvent($LivingIncomingDamageEvent, event => {
        var source = event.getContainer().getSource()
        var player = event.source.player
        if (player == null || !player.isPlayer()) return
        var weapon = player.getMainHandItem()
        if (weapon.id != WEAPON) return
        var data = player.persistentData
        var damage = event.getAmount()
        var phase = data.getInt(PHASE)
        var index = data.getInt(HIT_INDEX)
        if (phase == 0) {
            if (index == 0) {
                data.putDouble(HIT_1, damage)
            } else if (index == 1) {
                data.putDouble(HIT_2, damage)
            } else if (index == 2) {
                data.putDouble(HIT_3, damage)
            }
            index++
            if (index >= 3) {
                data.putInt(PHASE, 1)
                data.putInt(HIT_INDEX, 0)
            } else {
                data.putInt(HIT_INDEX, index)
            }
            return
        }
        var replayDamage
        if (index == 0) {
            replayDamage = data.getDouble(HIT_3)
        } else if (index == 1) {
            replayDamage = data.getDouble(HIT_2)
        } else {
            replayDamage = data.getDouble(HIT_1)
        }
        event.getContainer().setNewDamage(replayDamage)
        index++
        if (index >= 3) {
            resetPalindrome(player)
        } else {
            data.putInt(HIT_INDEX, index)
        }
    })
    PlayerEvents.tick(event => {
        var player = event.player
        var data = player.persistentData
        var weapon = player.getMainHandItem()
        var slot = player.inventory.selected
        if (weapon.id != WEAPON) {
            if (data.contains(PHASE) || data.contains(HIT_INDEX)) {
                resetPalindrome(player)
            }
            data.remove(SLOT)
            return
        }
        if (!data.contains(SLOT)) {
            data.putInt(SLOT, slot)
            return
        }
        if (data.getInt(SLOT) != slot) {
            resetPalindrome(player)
            data.putInt(SLOT, slot)
        }
    })
}