ItemEvents.modification(event => {
let nerfedArchFruit = [
    "ars_nouveau:mendosteen_pod",
    "ars_nouveau:bastion_pod",
    "ars_nouveau:bombegranate_pod",
    "ars_nouveau:frostaya_pod",
    "ars_elemental:flashpine_pod",
]
  event.modify(nerfedArchFruit, item => {
    item.foodProperties = food => {
        food.hunger(2)
        food.saturation(0.4)
    }
  })
})