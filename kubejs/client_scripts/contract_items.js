    const GLFW = Java.loadClass('org.lwjgl.glfw.GLFW')
    const Minecraft = Java.loadClass('net.minecraft.client.Minecraft')

    // Change this if you want a different key.
    const MARTYR_DETONATE_KEY = GLFW.GLFW_KEY_I

    let wasDown = false

    ClientEvents.tick(event => {
        const mc = Minecraft.getInstance()
        if (!mc) return

        const player = Client.player
        if (!player) {
            wasDown = false
            return
        }

        // Prevent detonation while typing in chat, using inventory, menus, etc.
        if (mc.screen != null) {
            wasDown = false
            return
        }

        const windowId = mc.getWindow().getWindow()
        const isDown = GLFW.glfwGetKey(windowId, MARTYR_DETONATE_KEY) == GLFW.GLFW_PRESS

        // Only fire once per key press, not every tick while held.
        if (isDown && !wasDown) {
            player.sendData('kubejs:martyr_core_detonate', {})
        }

        wasDown = isDown
    })