    const MARTYR_TRIGGER_KEY = 'kubejs_martyr_core_trigger_ticks'

    function getPersistentData(entity) {
        if (entity.persistentData) return entity.persistentData

        if (typeof entity.getPersistentData === 'function') {
            return entity.getPersistentData()
        }

        return null
    }

    function getInt(entity, key) {
        let data = getPersistentData(entity)
        if (!data) return 0

        if (typeof data.getInt === 'function') {
            return data.getInt(key)
        }

        return Number(data[key] || 0)
    }

    function setInt(entity, key, value) {
        let data = getPersistentData(entity)
        if (!data) return

        if (typeof data.putInt === 'function') {
            data.putInt(key, value)
        } else {
            data[key] = value
        }
    }

    NetworkEvents.dataReceived('kubejs:martyr_core_detonate', event => {
        let player = event.player
        if (!player) return

        // Short-lived trigger.
        // If the curio is not equipped, this expires instead of detonating later.
        setInt(player, MARTYR_TRIGGER_KEY, 5)
    })

    PlayerEvents.tick(event => {
        let player = event.player
        if (!player) return

        let ticks = getInt(player, MARTYR_TRIGGER_KEY)

        if (ticks > 0) {
            setInt(player, MARTYR_TRIGGER_KEY, ticks - 1)
        }
    })