
    const DETONATION_RADIUS = 7
    const DETONATION_DAMAGE = 24

    // Hold sneak for this many ticks to detonate.
    // 20 ticks = 1 second.
    const DETONATION_HOLD_TICKS = 20

    const CHARGE_KEY = 'kubejs_martyr_core_charge'

    const MARTYR_TRIGGER_KEY = 'kubejs_martyr_core_trigger_ticks'
    const MARTYR_FUSE_KEY = 'kubejs_martyr_core_fuse'

    const MARTYR_FUSE_TICKS = 20
    const FUSE_TICK_SOUND = 'minecraft:block.lever.click'
    const FUSE_TICK_VOLUME = 0.7

    function getSlotEntity(slotContext) {
        if (!slotContext) return null

        if (typeof slotContext.entity === 'function') {
            return slotContext.entity()
        }

        return slotContext.entity ?? null
    }

    function isClientSide(entity) {
        let level = null

        if (typeof entity.level === 'function') {
            level = entity.level()
        } else {
            level = entity.level
        }

        if (!level) return false

        let side = level.isClientSide

        return typeof side === 'function' ? side.call(level) : side
    }

    function isPlayer(entity) {
        if (!entity) return false

        if (typeof entity.isPlayer === 'function') {
            return entity.isPlayer()
        }
        if (typeof entity.getGameProfile === 'function') {
            return true
        }

        return entity.username != null
    }

    function isAlive(entity) {
        if (typeof entity.isAlive === 'function') {
            return entity.isAlive()
        }

        return true
    }

    function isSneaking(entity) {
        if (typeof entity.isShiftKeyDown === 'function') {
            return entity.isShiftKeyDown()
        }

        if (typeof entity.isCrouching === 'function') {
            return entity.isCrouching()
        }

        return !!entity.crouching
    }

    function getPersistentData(entity) {
        if (entity.persistentData) return entity.persistentData

        if (typeof entity.getPersistentData === 'function') {
            return entity.getPersistentData()
        }

        return null
    }

    function getCharge(entity) {
        let data = getPersistentData(entity)
        if (!data) return 0

        if (typeof data.getInt === 'function') {
            return data.getInt(CHARGE_KEY)
        }

        return Number(data[CHARGE_KEY] || 0)
    }

    function setCharge(entity, value) {
        let data = getPersistentData(entity)
        if (!data) return

        if (typeof data.putInt === 'function') {
            data.putInt(CHARGE_KEY, value)
        } else {
            data[CHARGE_KEY] = value
        }
    }

    function getPlayerName(player) {
        if (player.username) return String(player.username)

        if (typeof player.getGameProfile === 'function') {
            return player.getGameProfile().getName()
        }

        if (typeof player.getName === 'function') {
            return player.getName().getString()
        }

        return String(player.name)
    }

    function getServer(player) {
        if (player.server) return player.server

        if (typeof player.getServer === 'function') {
            return player.getServer()
        }

        return null
    }

    function runCommand(player, command) {
        let server = getServer(player)
        if (!server) return

        if (typeof server.runCommandSilent === 'function') {
            server.runCommandSilent(command)
            return
        }
        server.getCommands().performPrefixedCommand(
            server.createCommandSourceStack(),
            command
        )
    }
    function detonate(player, stack) {
        const name = getPlayerName(player)

        setIntData(player, MARTYR_TRIGGER_KEY, 0)
        setIntData(player, MARTYR_FUSE_KEY, 0)

        runCommand(
            player,
            `execute at ${name} run particle minecraft:explosion_emitter ~ ~1 ~ 0 0 0 0 1 force @a[distance=..64]`
        )

        runCommand(
            player,
            `execute at ${name} run playsound minecraft:entity.generic.explode master @a[distance=..64] ~ ~ ~ 1 0.9`
        )

        runCommand(
            player,
            `execute at ${name} as @e[distance=..${DETONATION_RADIUS}] unless entity @s[type=minecraft:player] unless entity @s[type=minecraft:item] unless entity @s[type=minecraft:experience_orb] unless entity @s[type=minecraft:armor_stand] run damage @s ${DETONATION_DAMAGE} minecraft:explosion`
        )

        runCommand(
            player,
            `damage ${name} ${DETONATION_DAMAGE} minecraft:explosion`
        )
    }
    function getIntData(entity, key) {
        let data = getPersistentData(entity)
        if (!data) return 0

        if (typeof data.getInt === 'function') {
            return data.getInt(key)
        }

        return Number(data[key] || 0)
    }
    function setIntData(entity, key, value) {
        let data = getPersistentData(entity)
        if (!data) return

        if (typeof data.putInt === 'function') {
            data.putInt(key, value)
        } else {
            data[key] = value
        }
    }
    function playFuseTick(player, fuse) {
        let interval = 5

        if (fuse >= MARTYR_FUSE_TICKS * 0.75) {
            interval = 2
        } else if (fuse >= MARTYR_FUSE_TICKS * 0.5) {
            interval = 3
        }

        if (fuse != 1 && fuse % interval != 0) return

        let pitch = 0.6 + (fuse / MARTYR_FUSE_TICKS) * 1.3

        runCommand(
            player,
            `execute at ${getPlayerName(player)} run playsound ${FUSE_TICK_SOUND} master @a[distance=..16] ~ ~ ~ ${FUSE_TICK_VOLUME} ${pitch}`
        )
    }
    StartupEvents.registry('item', event => {
        event.create('martyr_core')
            .displayName('§4§lMartyr Core')
            .tooltip("§o§cAt the cost of one's life, release a charge of Aeternitas causing massive damage.")
            .maxStackSize(1)
            .tag('curios:necklace')
            .parentModel('thecatlord:item/contract/martyr_core')
            .texture('thecatlord:item/contract/martyr_core')
            .attachCuriosCapability(
                CuriosJSCapabilityBuilder.create()
                .curioTick((slotContext, stack) => {
                const player = getSlotEntity(slotContext)
                if (!isPlayer(player)) return
                if (isClientSide(player)) return
                if (!isAlive(player)) return
                let fuse = getIntData(player, MARTYR_FUSE_KEY)
                let trigger = getIntData(player, MARTYR_TRIGGER_KEY)
                // Key was pressed recently and no fuse is currently running.
                if (trigger > 0 && fuse <= 0) {
                    setIntData(player, MARTYR_TRIGGER_KEY, 0)
                    fuse = 1
                    setIntData(player, MARTYR_FUSE_KEY, fuse)
                }
                if (fuse <= 0) return
                playFuseTick(player, fuse)
                if (fuse >= MARTYR_FUSE_TICKS) {
                    setIntData(player, MARTYR_FUSE_KEY, 0)
                    detonate(player, stack)
                    return
                }
                setIntData(player, MARTYR_FUSE_KEY, fuse + 1)
                })
            .canEquip((slotContext, stack) => true)
            .canUnequip((slotContext, stack) => {
                const player = getSlotEntity(slotContext)
                if (!player) return true
                return getIntData(player, MARTYR_FUSE_KEY) <= 0
                })
            )
})